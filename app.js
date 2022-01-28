require("dotenv").config();
require("./repo/database").connect();

const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./model/user");
const jwt = require("jsonwebtoken");
const app = express();
const auth = require("./middleware/auth");

app.use(express.json());
const router = express.Router();

//would normally break out into controller/services and keep app.js clean
app.post("/register", async (req, res) => {

  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password )) {

      res.status(400).send("uname and pass required");

    }

    // check if user already exist
    // Validate if user exist in our database
    const isExisting = await User.findOne({ username });

    if (isExisting) {

      return res.status(409).send("Cannot register: User Already Exists. Please Login");
    }

    //Encrypt user password - salt = 10
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({

      username: username.toLowerCase(), 

      password: encryptedPassword,

    });

    // Create token
    const token = jwt.sign(

      { user_id: user._id, username },

      process.env.TOKEN_KEY,

      {
        expiresIn: "1h",
      }
    );

    // save token
    user.token = token;

    // return new user
    res.status(201).json(user);

  } catch (err) {

    console.log(err);
  }
});


app.post("/login", async (req, res) => {

  try {

    // Get input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {

      res.status(400).send("All input is required");

    }

    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {

      // Create token
      const token = jwt.sign(

        { user_id: user._id, username },

        process.env.TOKEN_KEY,

        {
          expiresIn: "1h",
        }

      );

      user.token = token;

      res.status(200).json(user);

    }
    else {

    	res.status(400).send("Invalid Credentials");

    }
    
  } catch (err) {
    console.log(err);
  }
});

app.post("/welcome", auth, (req, res) => {

  res.status(200).send("Welcome - login successful ");

});

module.exports = app;