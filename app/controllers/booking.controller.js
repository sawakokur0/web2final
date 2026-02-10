const db = require("../models");
const Booking = db.booking;
const Class = db.class;

exports.create = (req, res) => {
  if (!req.body.classId) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  Class.findById(req.body.classId)
    .then(fitnessClass => {
      if (!fitnessClass) {
        return res.status(404).send({ message: "Class not found." });
      }

      if (fitnessClass.enrolled >= fitnessClass.capacity) {
        return res.status(400).send({ message: "Class is full." });
      }

      Booking.findOne({
        user: req.userId,
        class: req.body.classId
      }).then(existingBooking => {
        if (existingBooking) {
          return res.status(400).send({ message: "You already booked this class." });
        }

        const booking = new Booking({
          user: req.userId,
          class: req.body.classId,
          date: new Date()
        });

        booking.save(booking)
          .then(data => {
            fitnessClass.enrolled += 1;
            fitnessClass.save();
            
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while creating the Booking." });
          });
      });
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving Class." });
    });
};

exports.findAll = (req, res) => {
  Booking.find({ user: req.userId })
    .populate("class")
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving bookings." });
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).send({ message: "Booking not found!" });
    }

    await Booking.findByIdAndDelete(id);

    if (booking.class) {
        await Class.findByIdAndUpdate(
            booking.class,
            { $inc: { enrolled: -1 } }
        );
    }

    res.send({ message: "Booking was cancelled successfully!" });

  } catch (err) {
    res.status(500).send({ message: "Could not delete Booking with id=" + id });
  }
};