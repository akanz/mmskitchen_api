const express = require("express"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken");
router = express.Router();

const User = require("../models/user"),
  auth = require("../middleware/auth");

//   GET ALL USERS
router.get("/users", auth, async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET A USER
router.get("/users/:id", auth, getAUser, async (req, res) => {
  res.status(200).json(res.data);
});

//   EDIT A USER
router.patch("/users/:id", auth, getAUser, async (req, res) => {
  const { username, email, password } = req.body;
  if (username) {
    res.data.username = username;
  }
  if (email) {
    res.data.email = email;
  }
  if (password) {
    res.data.password = password;
  }
  try {
    const updatedUser = await res.data.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE A USER
router.delete("/users/:id", auth, getAUser, async (req, res) => {
  try {
    await res.data.remove();
    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REGISTER A USER
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
      return res.status(400).json({ message: "All inputs are required " });
    }
    const oldUser = await User.findOne({
      $or: [
        {
          email,
        },
        {
          username,
        },
      ],
    });
    if (oldUser) {
      return res
        .status(409)
        .json({ message: "User already exists! please try again" });
    }
    const hashPass = await bcrypt.hash(password, 10),
      newUser = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashPass,
      });
    const token = jwt.sign({ newUser }, process.env.token_key, {
      expiresIn: "2h",
    });
    newUser.token = token;
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!((username || email) && password)) {
      return res.status(400).json({ message: "All inputs are required" });
    }
    const user = await User.findOne({
        $or: [
          {
            email,
          },
          {
            username,
          },
        ],
      }),
      pass = await bcrypt.compare(password, user.password);
    if (user && pass) {
      const token = jwt.sign({ user }, process.env.token_key, {
        expiresIn: "2h",
      });
      user.token = token;
      res.status(200).json(user);
    } else {
      res
        .status(400)
        .json({ message: "Invalid credentials. please try again" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getAUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User does not exist" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.data = user;
  next();
}

module.exports = router;
