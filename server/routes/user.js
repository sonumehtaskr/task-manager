const express = require("express");
const router = express.Router();

const { signup, verifyEmail, login, logout } = require("../controllers/auth");
const { auth } = require("../middlewares/auth");

const {firebaselogin,firebaselogout} = require("../firebasecontrollers/auth");
const {firebaseauth} = require("../firebasemiddleware/auth");

router.post("/signup", signup);
router.post("/login", firebaselogin);
router.get("/verify-email", verifyEmail);
router.get("/logout", firebaseauth, firebaselogout);

module.exports = router;
