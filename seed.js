require("dotenv").config();
const mongoose = require("mongoose");
const db = require("./app/models");
const Class = db.class;

const initialClasses = [
  {
    title: "Morning Yoga",
    trainer: "Anna",
    date: new Date(new Date().setHours(new Date().getHours() + 24)),
    description: "Start your day with energy.",
    capacity: 15,
    enrolled: 5
  },
  {
    title: "HIIT Training",
    trainer: "Alina",
    date: new Date(new Date().setHours(new Date().getHours() + 26)),
    description: "Intense cardio workout.",
    capacity: 10,
    enrolled: 0
  },
  {
    title: "Pilates",
    trainer: "Sarah",
    date: new Date(new Date().setHours(new Date().getHours() + 48)),
    description: "Core strength and flexibility.",
    capacity: 12,
    enrolled: 12
  },
  {
    title: "Strength Training",
    trainer: "Maria",
    date: new Date(new Date().setHours(new Date().getHours() + 50)),
    description: "Basic strength training techniques.",
    capacity: 20,
    enrolled: 3
  }
];

mongoose
  .connect(db.url)
  .then(async () => {
    console.log("Connected to MongoDB...");

    await Class.deleteMany({});
    console.log("Old classes removed.");

    await Class.insertMany(initialClasses);
    console.log(`✅ Successfully added ${initialClasses.length} classes into database!`);
    
    process.exit();
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit();
  });