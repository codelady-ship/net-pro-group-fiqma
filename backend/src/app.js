const crypto = require("crypto");
const express = require("express");
const { z } = require("zod");
const { createBaseApp, publicWriteLimiter } = require("./lib/base");
const { requireAdmin } = require("./lib/auth");
const { HttpError, validate, notFound, errorHandler } = require("./lib/errors");
const { STATUSES, Inquiry } = require("./models");

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Adınızı və soyadınızı yazın.").max(80),
  email: z.string().trim().email("E-poçt ünvanını düzgün yazın.").max(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === "" || /^[0-9 +()-]{7,}$/.test(v), "Telefon nömrəsini düzgün yazın.")
    .optional()
    .default(""),
  message: z.string().trim().min(10, "Mesaj ən azı 10 simvol olmalıdır.").max(3000),
  topic: z.string().trim().max(120).optional().default(""),
  page: z.string().trim().max(60).optional().default(""),
  website: z.string().optional(), // honeypot: real visitors never fill it
});

const updateSchema = z
  .object({ status: z.enum(STATUSES).optional(), note: z.string().trim().min(1).max(1000).optional() })
  .refine((u) => u.status || u.note, "Send a status or a note");

function createApp() {
  const app = createBaseApp();
  const api = express.Router();

  /* ----- Public: contact / product inquiry ----- */
  api.post("/inquiries", publicWriteLimiter(), validate(inquirySchema), async (req, res) => {
    const { website, ...data } = req.body;
    // Bots that fill the hidden field get the same answer, but the inquiry is stored as spam.
    for (let attempt = 0; ; attempt++) {
      const reference = "NPG-" + crypto.randomBytes(3).toString("hex").toUpperCase();
      try {
        await Inquiry.create({ ...data, reference, status: website ? "spam" : "new" });
        return res.status(201).json({ reference });
      } catch (err) {
        if (err.code !== 11000 || attempt >= 2) throw err; // retry a reference collision
      }
    }
  });

  /* ----- Admin (JWT) ----- */
  api.get("/admin/inquiries", requireAdmin, async (req, res) => {
    const filter = {};
    if (req.query.status) filter.status = String(req.query.status);
    else filter.status = { $ne: "spam" };
    if (req.query.q) {
      const rx = new RegExp(String(req.query.q).slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { email: rx }, { topic: rx }, { message: rx }];
    }
    const page = Math.max(1, Number(req.query.page) || 1);
    const [items, total] = await Promise.all([
      Inquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * 50).limit(50),
      Inquiry.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / 50) });
  });

  api.get("/admin/inquiries/:reference", requireAdmin, async (req, res) => {
    const doc = await Inquiry.findOne({ reference: String(req.params.reference).toUpperCase() });
    if (!doc) throw new HttpError(404, "Inquiry not found");
    res.json(doc);
  });

  api.patch("/admin/inquiries/:reference", requireAdmin, validate(updateSchema), async (req, res) => {
    const update = {};
    if (req.body.status) update.$set = { status: req.body.status };
    if (req.body.note) update.$push = { notes: { text: req.body.note } };
    const doc = await Inquiry.findOneAndUpdate({ reference: String(req.params.reference).toUpperCase() }, update, { new: true });
    if (!doc) throw new HttpError(404, "Inquiry not found");
    res.json(doc);
  });

  api.delete("/admin/inquiries/:reference", requireAdmin, async (req, res) => {
    const doc = await Inquiry.findOneAndDelete({ reference: String(req.params.reference).toUpperCase() });
    if (!doc) throw new HttpError(404, "Inquiry not found");
    res.status(204).end();
  });

  // Dashboard numbers: inquiries per status and the most asked-about topics.
  api.get("/admin/stats", requireAdmin, async (_req, res) => {
    const [byStatus, topTopics] = await Promise.all([
      Inquiry.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Inquiry.aggregate([
        { $match: { topic: { $ne: "" }, status: { $ne: "spam" } } },
        { $group: { _id: "$topic", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 },
        { $project: { _id: 0, topic: "$_id", count: 1 } },
      ]),
    ]);
    const status = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    byStatus.forEach((r) => (status[r._id] = r.count));
    res.json({ status, topTopics });
  });

  app.use("/api", api);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
