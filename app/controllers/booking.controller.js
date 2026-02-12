const db = require("../models");
const Booking = db.booking;
const Class = db.class;

exports.createBooking = async (req, res) => {
  try {
    const classId = req.body.classId;
    const userId = req.userId;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).send({ message: "Class not found." });
    }

    if (classData.enrolled >= classData.capacity) {
      return res.status(400).send({ message: "Class is full." });
    }

    const existingBooking = await Booking.findOne({ user: userId, class: classId });
    if (existingBooking) {
      return res.status(400).send({ message: "You already booked this class." });
    }

    const booking = new Booking({
      user: userId,
      class: classId
    });

    await booking.save();
    
    await Class.findByIdAndUpdate(classId, { $inc: { enrolled: 1 } });

    res.status(201).send({ message: "Booking created successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).send({ message: "Booking not found." });
    }

    if (booking.user.toString() !== req.userId && req.role !== "admin") {
      return res.status(403).send({ message: "Unauthorized!" });
    }

    await Class.findByIdAndUpdate(booking.class, { $inc: { enrolled: -1 } });

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).send({ message: "Booking was cancelled successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Could not delete Booking with id=" + bookingId });
  }
};