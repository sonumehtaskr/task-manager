var admin = require("firebase-admin");

exports.firebaseauth = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.session || "";
    if (!sessionCookie) {
      return res.status(401).json({
        success: false,
        message: "Cookies missing",
      });
    }

    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then((userData) => {
        console.log("Logged in:", userData);
        req.user = userData;
        next();
      })
      .catch((error) => {
        console.log("Error in auth firebase", error);
        return res.status(401).json({
          success: false,
          message: "Unauthorized user",
        });
      });
  } catch (error) {
    console.log("Error in firebase auth", error);
    return res.status(400).json({
      success: false,
      message: "Went Wrong in authorizaton",
    });
  }
};
