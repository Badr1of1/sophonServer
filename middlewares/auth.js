const { Company } = require("../Models");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!company) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Company not found" });
    }

    req.token = token;
    req.company = company;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = { auth };