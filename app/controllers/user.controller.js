const db = require("../models");
const User = db.user;
const Role = db.role;
const Booking = db.booking;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getUserProfile = (req, res) => {
  User.findById(req.userId).select("-password")
    .then(user => {
      if (!user) return res.status(404).send({ message: "User not found" });
      res.status(200).send(user);
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.updateUserProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.userId,
    { username: req.body.username },
    { new: true, useFindAndModify: false }
  ).select("-password")
    .then(user => {
      if (!user) return res.status(404).send({ message: "User not found" });
      res.status(200).send(user);
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.getUserBookings = (req, res) => {
  Booking.find({ user: req.userId })
    .populate("class")
    .then(bookings => res.status(200).send(bookings))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAllTrainers = async (req, res) => {
  try {
    const role = await Role.findOne({ name: "trainer" });
    if (!role) {
      return res.status(404).send({ message: "Trainer role not found. Please run seed.js" });
    }
    const users = await User.find({ roles: { $in: [role._id] } }).select("-password");
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error retrieving trainers" });
  }
};