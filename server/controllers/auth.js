const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mailTemplate = require("../mail/emailVerificationTemplate");
const mailSender = require("./../utils/mailSender");
const { createSecretToken } = require("./../utils/createSecretToken");
require("dotenv").config();

const fileSave = (file, filename) => {
  try {
    console.log("File ", file);

    const fileType = file.name.split(".").pop().toLowerCase();
    const supportedTypes = ["jpeg", "jpg", "png"];

    if (!supportedTypes.includes(fileType)) {
      throw new Error("File type not supported");
    }

    const filePath =
      __dirname + "/uploads/" + filename + "-" + Date.now() + "." + fileType;
    console.log("Path: ", filePath);

    file.mv(filePath, (err) => {
      if (err) {
        console.error("Error during file movement: ", err);
        throw new Error("File movement failed");
      }
    });
    return filePath; // Return the file path
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while uploading the file");
  }
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  const profilePicture = req.files?.profilePicture; // Using file upload handling from Express (assuming using 'express-fileupload')

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser?.verified) {
      console.log("Email is already in use");
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    // Handle file upload
    let profilePicturePath = "";
    if (profilePicture) {
      const filename = email.split("@")[0];
      profilePicturePath = fileSave(profilePicture, filename);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = createSecretToken(email);

    const updatedUser = await User.findOneAndUpdate(
      { email }, // Find the user by email
      {
        $set: {
          name,
          password: hashedPassword,
          profilePicture: profilePicturePath,
          verificationToken,
        },
      }, // Update the fields
      { new: true, upsert: true } // Return the updated document, create if not found
    );

    console.log(updatedUser);

    // Construct email verification link
    const verificationLink = `${process.env.FRONTEND_URL}verify-email?token=${verificationToken}`;

    const mailBody = mailTemplate(verificationLink);

    // Send email
    mailSender(email, "Please verify email", mailBody);

    console.log("SignUp successs");
    return res.status(201).json({
      message:
        "User registered successfully! Please check your email to verify your account.",
      user: { name, email, profilePicture: profilePicturePath },
    });
  } catch (error) {
    console.error("Signup Error: ", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    console.log("Invalid or missing token");
    return res.status(400).json({ message: "Invalid or missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decodedToken);

    const user = await User.findOne({ email: decodedToken.email });
    console.log("User is: ", user);

    if (!user || token != user.verificationToken) {
      console.log("User not found or invalid token");
      return res
        .status(404)
        .json({ message: "User not found or invalid token" });
    }

    user.verified = true;
    user.verificationToken = "";
    await user.save();

    console.log("Email verified successfully");
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      console.error("Error decoding JWT: ", error);
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    console.error("Error verifying email: ", error);
    return res
      .status(500)
      .json({ message: "Error verifying email. Please try again later." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully",
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser?.verified) {
      console.log("Account doesn,t exist");
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    const auth = await bcrypt.compare(password, existingUser.password);
    if (!auth) {
      return res.status(403).json({
        success: false,
        message: "Wrong Password or username",
      });
    }

    const token = createSecretToken(email);
    let options = {
      withCredentials: true,
      httpOnly: true,
      SameSite: 'None',
      secure:false,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      email,
      message: "Login succesful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

exports.logout = async (req, res) => {
  console.log("Entering in logout section");
  try {
    const options = {
      httpOnly: true,
      secure: false,
      SameSite: 'None',
      
    };
    res.clearCookie("token", options);
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error while logging out: ", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed, Something went wrong",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const profileDetails = User.findOne({ email });

    if (!profileDetails) {
      console.log(error)("Invalid User");
      return res.status(500).json({
        success: false,
        message: "Invalid User",
      });
      return;
    }

    console.log(error)("Profile Details fetched successfuly ");
    return res.status(200).json({
      success: true,
      message: "Profile Details fetched successfuly",
    });
  } catch {
    console.log(error)("Error while fetching profile details: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching profile details",
    });
  }
};
