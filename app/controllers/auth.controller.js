const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role || 'user'
  });

  try {
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to Celery Body!',
      text: `Hello ${user.username}, thanks for joining our fitness family!`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) { console.log("Email error: ", error); }
    });

    res.send({ message: "User was registered successfully!" });

  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while creating the User." });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
    }

    var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token
    });

  } catch (err) {
    res.status(500).send({ message: err.message || "Error during signin." });
  }
};