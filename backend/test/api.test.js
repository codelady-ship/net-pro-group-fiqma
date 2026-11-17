// API tests on an in-memory MongoDB. Run: npm test
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

process.env.JWT_SECRET = "test-secret";
process.env.ADMIN_EMAIL = "admin@test.local";
process.env.ADMIN_PASSWORD = "test-password";
process.env.PUBLIC_RATE_LIMIT = "200";

const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server-core");
const { createApp } = require("../src/app");

let mongo;
let app;
let auth;
let reference;
const valid = { name: "Test Müştəri", email: "Test@Example.com", phone: "+994 50 000 00 00", message: "UPS sistemi haqqında qiymət təklifi istəyirəm.", topic: "Liebert® GXT5 UPS", page: "elaqe.html" };

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri("npg-test"));
  app = createApp();
  const login = await request(app).post("/api/auth/login").send({ email: "admin@test.local", password: "test-password" });
  auth = { Authorization: `Bearer ${login.body.token}` };
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test("inquiry: saved with a reference", async () => {
  const res = await request(app).post("/api/inquiries").send(valid);
  assert.equal(res.status, 201, JSON.stringify(res.body));
  assert.match(res.body.reference, /^NPG-[0-9A-F]{6}$/);
  assert.deepEqual(Object.keys(res.body), ["reference"]);
  reference = res.body.reference;
  await request(app).post("/api/inquiries").send({ ...valid, phone: "", topic: "Helpdesk" });
});

test("inquiry: validation messages in Azerbaijani", async () => {
  const res = await request(app).post("/api/inquiries").send({ name: "A", email: "x", phone: "12", message: "qısa" });
  assert.equal(res.status, 400);
  assert.deepEqual(res.body.details.map((d) => d.field).sort(), ["email", "message", "name", "phone"]);
  assert.match(res.body.details.find((d) => d.field === "message").message, /10 simvol/);
});

test("inquiry: honeypot stores bots as spam and hides them", async () => {
  const res = await request(app).post("/api/inquiries").send({ ...valid, website: "http://spam.example" });
  assert.equal(res.status, 201);
  const list = (await request(app).get("/api/admin/inquiries").set(auth)).body;
  assert.equal(list.total, 2);
  assert.equal((await request(app).get("/api/admin/inquiries?status=spam").set(auth)).body.total, 1);
});

test("admin: auth required", async () => {
  assert.equal((await request(app).get("/api/admin/inquiries")).status, 401);
  assert.equal((await request(app).get("/api/admin/stats").set("Authorization", "Bearer x")).status, 401);
});

test("admin: workflow, search, notes, stats, delete", async () => {
  const one = (await request(app).get(`/api/admin/inquiries/${reference.toLowerCase()}`).set(auth)).body;
  assert.equal(one.email, "test@example.com");
  assert.equal(one.status, "new");

  const upd = await request(app).patch(`/api/admin/inquiries/${reference}`).set(auth).send({ status: "in_progress", note: "Zəng edildi, təklif hazırlanır." });
  assert.equal(upd.body.status, "in_progress");
  assert.equal(upd.body.notes.length, 1);
  assert.equal((await request(app).patch(`/api/admin/inquiries/${reference}`).set(auth).send({})).status, 400);
  assert.equal((await request(app).patch(`/api/admin/inquiries/${reference}`).set(auth).send({ status: "won" })).status, 400);

  assert.equal((await request(app).get("/api/admin/inquiries?q=gxt5").set(auth)).body.total, 1);
  assert.equal((await request(app).get("/api/admin/inquiries?q=(((").set(auth)).status, 200);

  const stats = (await request(app).get("/api/admin/stats").set(auth)).body;
  assert.deepEqual(stats.status, { new: 1, in_progress: 1, closed: 0, spam: 1 });
  assert.equal(stats.topTopics.length, 2);

  assert.equal((await request(app).delete(`/api/admin/inquiries/${reference}`).set(auth)).status, 204);
  assert.equal((await request(app).get(`/api/admin/inquiries/${reference}`).set(auth)).status, 404);
});
