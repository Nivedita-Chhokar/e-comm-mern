const admin = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err });
  }
};

// module.exports = verifyToken;
module.exports = (req, res, next) => {
    req.user = { uid: "dummy-user-123" };
    console.log("Middleware hit, user simulated:", req.user);  // to test token
    next();
};
