var admin = require("firebase-admin");
const { initializeApp, cert } = require("firebase-admin/app");

var serviceAccount = require("../firebaseconfig/exploring-firebase-cd785-firebase-adminsdk-w2sw0-676354d849.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://exploring-firebase-cd785-default-rtdb.firebaseio.com",
});

exports.firebaselogin = async (req, res) => {
  try {
    const idToken = req.body.idToken.toString();
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken.email_verified) {
      console.log("Account doesn't exist or email is not verified");
      return res.status(401).json({
        success: false,
        message: "User is not verified",
      });
    }

    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    const options = {
      withCredentials: true,
      httpOnly: true,
      SameSite: "None",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + expiresIn),
    };

    res.cookie("session", sessionCookie, options).status(200).json({
      success: true,
      sessionCookie,
      message: "Login successful",
    });
  } catch (error) {
    console.log("Error in login", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

exports.firebaselogout = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: false,
      SameSite: "None",
    };
    res.clearCookie("session", options);
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

exports.firebasesignup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  await admin.auth().createUser({
    email: email,
    emailVerified: false,
    password: password,
    name: name,
  });
};
