const config = require("./lib/config");
const { connect, ensureIndexes } = require("./lib/db");
const { createApp } = require("./app");

connect(config.mongoUri)
  .then(async () => {
    await ensureIndexes();
    createApp().listen(config.port, () => console.log(`Net Pro Group API listening on port ${config.port}`));
  })
  .catch((err) => {
    console.error("Could not start:", err.message);
    process.exit(1);
  });
