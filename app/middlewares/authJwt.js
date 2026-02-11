const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
        return res.status(404).send({ message: "User not found." });
    }

    if (user.role === "admin") {
        next();
        return;
    }

    if (user.roles) {
        const roles = await Role.find({ _id: { $in: user.roles } });
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                next();
                return;
            }
        }
    }

    res.status(403).send({ message: "Require Admin Role!" });
    
  } catch (err) {
    res.status(500).send({ message: err.message || "Error checking admin role" });
  }
};

isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
        return res.status(404).send({ message: "User not found." });
    }

    if (user.role === "moderator") {
        next();
        return;
    }

    if (user.roles) {
        const roles = await Role.find({ _id: { $in: user.roles } });
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                next();
                return;
            }
        }
    }

    res.status(403).send({ message: "Require Moderator Role!" });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error checking moderator role" });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;