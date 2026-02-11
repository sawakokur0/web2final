const db = require("../models");
const User = db.user;
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
  User.findByIdAndUpdate(req.userId, req.body, { new: true, useFindAndModify: false }).select("-password")
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

exports.findAllTrainers = (req, res) => {
  User.find({ role: "trainer" }) 
    .select("-password") 
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving trainers."
      });
    });
};