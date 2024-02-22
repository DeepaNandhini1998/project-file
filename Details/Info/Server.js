const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const model = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const URL = process.ENV.MONGODB;
mongoose.connect(URL);

app.post("/api/register", async (req, res) => {
  const newPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = await model.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });

    res.json({ status: "okay" });
  } catch (err) {
    res.json({ status: "Email is Duplicate" });
  }
});

app.post("/api/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await model.findOne({ email: email });

  const PasswordValid = await bcrypt.compare(password, user.password);
  console.log(PasswordValid);
  if (PasswordValid) {
    const token = await jwt.sign(
      { email: user.email, name: user.name },
      "secret321"
    );

    res.json({ status: "okay", token: token });
  } else {
    res.json({ status: "Entered Wrong Email or Password" });
  }
});

app.post("/api/dashboard", async (req, res) => {
  const token = req.headers["x-access-token"];
  const goal = req.body.tempGoal;

  const TokenValid = await jwt.verify(token, "secret321");
  const email = TokenValid.email;

  if (TokenValid) {
    await model.updateOne({ email: email }, { $set: { goal: goal } });

    res.json({ status: "okay" });
  } else {
    res.json({ status: "Token is invalid" });
  }
});

app.get("/api/dashboard", async (req, res) => {
  const token = req.headers["x-access-token"];
  const ValidToken = await jwt.verify(token, "secret321");

  if (ValidToken) {
    const email = ValidToken.email;
    const user = await model.findOne({ email: email });
    res.json({ status: "okay", goal: user.goal });
  } else {
    res.json("Token is invalid");
  }
});

app.listen("3007", () => console.log("Server started on port 3007"));