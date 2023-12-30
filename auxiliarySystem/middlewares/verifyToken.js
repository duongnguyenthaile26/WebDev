const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const issuer = process.env.ISSUER;
const audience = process.env.AUDIENCE;

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.json({
      status: "fail",
      statusCode: 403,
      message: "No token to verify",
    });
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { issuer, audience },
    function (error, decoded) {
      if (error) {
        return res.json({
          status: "fail",
          statusCode: 401,
          message: "Unauthorized",
        });
      }
      req.decoded = decoded;
      next();
    }
  );
}

module.exports = verifyToken;
