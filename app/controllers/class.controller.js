const db = require("../models");
const Class = db.class;

exports.findAll = (req, res) => {
  Class.find()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error occurred." }));
};

exports.create = (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }
  const fitnessClass = new Class({
    title: req.body.title,
    trainer: req.body.trainer,
    date: req.body.date,
    description: req.body.description,
    capacity: req.body.capacity
  });

  fitnessClass.save()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Class.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).send({ message: `Cannot delete Class with id=${id}.` });
    }

    res.send({ message: "Class was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Could not delete Class with id=" + id });
  }
};