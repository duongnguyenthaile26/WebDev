const path = require("path");
const mongoose = require("mongoose");
const https = require("https");
const paymentApp = require(path.join(__dirname, "paymentApp"));
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const key = fs.readFileSync(
  path.join(__dirname, "certificates", "auxKey.pem"),
  "utf8"
);
const cert = fs.readFileSync(
  path.join(__dirname, "certificates", "auxCert.pem"),
  "utf8"
);

const port = process.env.AUX_PORT || 8000;
const DB = process.env.AUX_DATABASE.replace(
  "<password>",
  process.env.AUX_DATABASE_PASSWORD
);

(async () => {
  await mongoose.connect(DB);
  const httpsServer = https.createServer({ key, cert }, paymentApp);
  httpsServer.listen(port, () =>
    console.log(`Auxiliary server running at https://127.0.0.1:${port}`)
  );
})();
