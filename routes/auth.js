const express = require("express");
const router = express.Router();

const { signup, signin } = require("../controllers/authcontroller");
const {
  signupValidationRules,
  validate,
  signinValidationRules,
} = require("../validators/authValidators");

router.post("/signup", signupValidationRules, validate, signup);
router.post("/signin", signinValidationRules, validate, signin);

module.exports = router;