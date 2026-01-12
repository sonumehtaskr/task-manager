require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};