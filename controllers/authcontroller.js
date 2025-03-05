const jwt = require("jsonwebtoken"); // for authenticating users
const User = require("../models/User")


// Operations to : Signup A User
const signup = async (req, res) => {
  try {

    const { firstname, lastname, username, email, password } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });


    // so now we check, if the user exists, we return a response dynamic enough to tell us if it's user name or password
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username
          ? "Username already exists"
          : "Email already exists",
      });
    }

    // create new user
    const newUser = new User({
      firstname,
      lastname,
      username,
      password,
      email,
    });
    await newUser.save(); // the user's information is saved to the database "_id"

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ message: "Error signing up users" });
  }
};



const signin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Ensure username or email is provided
    if (!username && !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide a username or email.",
      });
    }

    // Find the user by email OR username
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    // If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or email.",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Success response with token
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
};



module.exports = { signup, signin };