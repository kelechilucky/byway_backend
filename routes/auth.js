const express = require("express");
const router = express.Router();

// bring in the variety of endpoints that has ben created in the controllers path
const { signup, signin } = require("../controllers/authcontroller");

// this shows that after the endpoint has been reached, the second signup triggers the signup functionality you already created
router.post("/signup", signup); // "www.dagcoin.com/users/API/signup"
router.post("/signin", signin); // "www.dagcoin.com/users/API/signin"

module.exports = router;
