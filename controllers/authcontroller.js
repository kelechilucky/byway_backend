const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { Firstname, Lastname, Username, Password, Phone, Email } = req.body;
    const existingUser = await User.findOne({
      $or: [{ Username }, { phone }, { email }],
    });

    // check for existing user
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username, Phone or email already exists" });
    }

    const newUser = new User({ Username, password, email, phone });
    await newUser.save();
    const token = jwt.sign({ UserId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // send a response back to the frontend
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        Username: newUser.Username,
        phone: newUser.phone,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("Signup error", error);
    res.status(500).json({ message: "Error signing up users " });
  }
};

const signin = async (req, res) => {
    try {
      // get the data from request.body coming from frontend
      const { Username, password } = req.body;
  
      //get token from authorisation header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(400).json({ message: "Authentication token is required" });
      }
      const token = authHeader.split(" ")[1];
  
      // verify token after extracting from authheader
  
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      // validate that user token's user id matches the user trying to log in
  
      const user = await User.findById(decodedToken.userId);
      if (!user || user.Username !== Username) {
        return res.status(401).json({ message: "Invalid token or username" });
      }
  
      // check if password match
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid inputs" });
      }
  
      // if success
      res.status(201).json({
        message: "Login successfull",
        user: {
          id: user._id,
          Username: user.Username,
          phone: user.phone,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.log("Signup error", error);
      res.status(500).json({ message: "Error signing in users" });
    }
  };
  module.exports = { signup, signin };