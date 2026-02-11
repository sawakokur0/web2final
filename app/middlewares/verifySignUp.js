const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({
    username: req.body.username
  }).then(user => {
    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Проверка Email
    User.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.role) {
    if (!['user', 'admin'].includes(req.body.role)) {
      res.status(400).send({
        message: `Failed! Role ${req.body.role} does not exist!`
      });
      return;
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;