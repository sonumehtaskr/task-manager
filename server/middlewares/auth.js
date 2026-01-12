const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  console.log("Entering in auth verify section");
  try {
    console.log(req);
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");
    console.log("Token is ", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }
    try {
      const email = jwt.verify(token, process.env.JWT_SECRET).email;
      console.log("Email is ", email);
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized user",
        });
      }
      console.log("User is: ",user);
      req.user = user;
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    next();
  } catch (error) {
    console.log("Error in auth verification");
    return res.status(400).json({
      success: false,
      message: "Went Wrong in authorizaton",
    });
  }
};
