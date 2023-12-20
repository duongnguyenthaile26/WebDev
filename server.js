const path = require("path");
const mongoose = require("mongoose");
const https = require("https");
const app = require(path.join(__dirname, "app"));
const fs = require("fs");
require("dotenv").config();

const key = fs.readFileSync(
  path.join(__dirname, "certificates", "key.pem"),
  "utf8"
);
const cert = fs.readFileSync(
  path.join(__dirname, "certificates", "cert.pem"),
  "utf8"
);

const port = process.env.PORT || 3000;
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

(async () => {
  await mongoose.connect(DB);
  const httpsServer = https.createServer({ key, cert }, app);
  httpsServer.listen(port, () =>
    console.log(`Server running at https://127.0.0.1:${port}`)
  );
})();
