const db = require("../models");
const User = db.user;

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).send({ message: "User Not found." });
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { username: req.body.username },
      { new: true }
    );
    res.status(200).send({ message: "Profile updated!", user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};