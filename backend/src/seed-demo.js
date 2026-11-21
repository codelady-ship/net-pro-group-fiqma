// Seeds the sample inquiries for the public demo admin (DEMO_LOGIN=true, demo@netprogroup.az / demo1234).
// Run: npm run seed:demo  (needs MONGODB_URI). Safe to re-run: it resets only the demo: true inquiries.
const mongoose = require("mongoose");
const config = require("./lib/config");
const { connect, ensureIndexes } = require("./lib/db");
const { Inquiry } = require("./models");
const samples = require("./demoInquiries");

const ago = (days) => new Date(Date.now() - days * 86400000);

async function main() {
  await connect(config.mongoUri);
  await ensureIndexes();
  await Inquiry.deleteMany({ demo: true });
  const docs = samples.map(({ daysAgo, notes, ...s }) => ({
    ...s,
    demo: true,
    notes: notes.map((n) => ({ text: n.text, at: ago(n.daysAgo) })),
    createdAt: ago(daysAgo),
    updatedAt: ago(daysAgo),
  }));
  await Inquiry.insertMany(docs, { timestamps: false });
  console.log(`Seeded ${docs.length} demo inquiries`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
