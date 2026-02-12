require("dotenv").config();
const mongoose = require("mongoose");
const db = require("./app/models");
const Class = db.class;
const User = db.user;
const Role = db.role;
const bcrypt = require("bcryptjs");

const initialClasses = [
  {
    title: "Morning Yoga",
    trainer: "Amina Sergazina",
    date: new Date(new Date().setHours(new Date().getHours() + 24)),
    description: "Start your day with energy.",
    capacity: 15,
    enrolled: 5
  },
  {
    title: "HIIT Training",
    trainer: "Professional Coach",
    date: new Date(new Date().setHours(new Date().getHours() + 26)),
    description: "Intense cardio workout.",
    capacity: 10,
    enrolled: 0
  },
  {
    title: "Pilates",
    trainer: "Yoga Instructor",
    date: new Date(new Date().setHours(new Date().getHours() + 48)),
    description: "Core strength and flexibility.",
    capacity: 12,
    enrolled: 12
  }
];

mongoose
  .connect(db.url)
  .then(async () => {
    console.log("Connected to MongoDB...");

    await Class.deleteMany({});
    await User.deleteMany({ email: { $in: ["amina@celery.com", "coach1@celery.com", "yoga@celery.com"] } });
    
    let trainerRole = await Role.findOne({ name: "trainer" });
    if (!trainerRole) {
      trainerRole = new Role({ name: "trainer" });
      await trainerRole.save();
    }

    const trainers = [
      { username: "Amina Sergazina", email: "amina@celery.com", image: "5413438310036140376.jpg" },
      { username: "Professional Coach", email: "coach1@celery.com", image: "5413438310036140377.jpg" },
      { username: "Yoga Instructor", email: "yoga@celery.com", image: "5413438310036140380.jpg" }
    ];

    for (const t of trainers) {
      const newTrainer = new User({
        username: t.username,
        email: t.email,
        password: bcrypt.hashSync("trainer123", 8),
        image: t.image,
        roles: [trainerRole._id]
      });
      await newTrainer.save();
    }

    await Class.insertMany(initialClasses);
    
    console.log("Database seeded successfully!");
    process.exit();
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit();
  });