// Public demo admin: read-only, sees only the seeded sample inquiries. Run: npm test
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

process.env.JWT_SECRET = "test-secret";
process.env.ADMIN_EMAIL = "admin@test.local";
process.env.ADMIN_PASSWORD = "test-password";
process.env.DEMO_LOGIN = "true";
process.env.PUBLIC_RATE_LIMIT = "200";

const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server-core");
const { createApp } = require("../src/app");
const { Inquiry } = require("../src/models");
const samples = require("../src/demoInquiries");

let mongo;
let app;
let demo;
let admin;
let realRef;

before(async () => {
  mongo = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } }); // slow first start on Windows
  await mongoose.connect(mongo.getUri("npg-demo-test"));
  app = createApp();
  await Inquiry.insertMany(samples.map(({ daysAgo, notes, ...s }) => ({ ...s, demo: true, notes: notes.map((n) => ({ text: n.text })) })));
  realRef = (await request(app).post("/api/inquiries").send({ name: "Real Visitor", email: "real@example.com", message: "Real customer message, must stay private." })).body.reference;
  const d = await request(app).post("/api/auth/login").send({ email: "DEMO@netprogroup.az", password: "demo1234" });
  assert.equal(d.status, 200, JSON.stringify(d.body));
  demo = { Authorization: `Bearer ${d.body.token}` };
  const a = await request(app).post("/api/auth/login").send({ email: "admin@test.local", password: "test-password" });
  admin = { Authorization: `Bearer ${a.body.token}` };
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test("demo: sees only the sample inquiries", async () => {
  const list = (await request(app).get("/api/admin/inquiries").set(demo)).body;
  assert.equal(list.total, samples.filter((s) => s.status !== "spam").length);
  assert.ok(list.items.every((i) => i.demo === true));
  assert.equal((await request(app).get(`/api/admin/inquiries/${realRef}`).set(demo)).status, 404);
  assert.equal((await request(app).get("/api/admin/inquiries?q=Real").set(demo)).body.total, 0);
  const stats = (await request(app).get("/api/admin/stats").set(demo)).body;
  assert.equal(Object.values(stats.status).reduce((a, b) => a + b, 0), samples.length);
});

test("demo: every write is blocked with a friendly 403", async () => {
  const ref = samples[0].reference;
  const patch = await request(app).patch(`/api/admin/inquiries/${ref}`).set(demo).send({ status: "closed" });
  assert.equal(patch.status, 403);
  assert.match(patch.body.error, /Demo rejimi/);
  assert.equal((await request(app).delete(`/api/admin/inquiries/${ref}`).set(demo)).status, 403);
  assert.equal((await Inquiry.findOne({ reference: ref })).status, samples[0].status);
});

test("demo: wrong password is rejected; admin keeps full rights and sees everything", async () => {
  assert.equal((await request(app).post("/api/auth/login").send({ email: "demo@netprogroup.az", password: "nope" })).status, 401);
  assert.equal((await request(app).get(`/api/admin/inquiries/${realRef}`).set(admin)).status, 200);
  const upd = await request(app).patch(`/api/admin/inquiries/${realRef}`).set(admin).send({ status: "closed" });
  assert.equal(upd.status, 200);
});
