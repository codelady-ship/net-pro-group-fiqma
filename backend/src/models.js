const mongoose = require("mongoose");
const { jsonOpts } = require("./lib/base");

const STATUSES = ["new", "in_progress", "closed", "spam"];

const inquirySchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    topic: { type: String, trim: true, maxlength: 120, default: "" }, // product or service from ?movzu=
    page: { type: String, trim: true, maxlength: 60, default: "" }, // page the form was sent from
    status: { type: String, enum: STATUSES, default: "new", index: true },
    demo: { type: Boolean, default: false, index: true }, // sample inquiry from `npm run seed:demo`
    notes: [
      {
        _id: false,
        text: { type: String, required: true, trim: true, maxlength: 1000 },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true, toJSON: jsonOpts }
);

module.exports = { STATUSES, Inquiry: mongoose.model("Inquiry", inquirySchema) };
