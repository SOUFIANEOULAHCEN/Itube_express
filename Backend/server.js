const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/User");
const cors = require("cors");
const app = express();
const port = 3000;
// 
app.use(express.json());
app.use(cors());
// 
app.use(
  cors({
    origin: "http://localhost:5173", // Remplacez par l'URL de votre frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // En-têtes autorisés
  })
);
// 
mongoose
  .connect("mongodb://localhost:27017/auth")
  .then(() => {
    console.log("connected successfully");
  })
  .catch((error) => {
    console.log("error with connecting with the DB ", error);
  });

// endpoints

app.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/register", async (req, res) => {
  const newUser = new User();
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.password = req.body.password;
  try {
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.json({ message: err });
  }
});
app.get("/login/:email/:password", async (req, res) => {
  const email = req.params.email;
  const pswd = req.params.password;
  const user = await User.findOne({
    email: email,
    password: pswd,
  });
  if (user) {
    res.json(user);
  } else {
    res.json({ message: "User not found" });
  }
});

app.listen(port, () => {
  console.log("I am listening in port 3000");
});
