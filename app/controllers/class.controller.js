const db = require("../models");
const Class = db.class;

// Create and Save a new Class
exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const newClass = new Class({
    title: req.body.title,
    trainer: req.body.trainer,
    date: req.body.date,
    capacity: req.body.capacity,
    description: req.body.description,
    enrolled: 0
  });

  newClass
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Class."
      });
    });
};

// Retrieve all Classes
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Class.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving classes."
      });
    });
};

// Find a single Class with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Class.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Class with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Class with id=" + id });
    });
};

// Update a Class by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Class.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Class with id=${id}. Maybe Class was not found!`
        });
      } else res.send({ message: "Class was updated successfully.", data: data });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Class with id=" + id
      });
    });
};

// Delete a Class with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Class.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Class with id=${id}. Maybe Class was not found!`
        });
      } else {
        res.send({
          message: "Class was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Class with id=" + id
      });
    });
};