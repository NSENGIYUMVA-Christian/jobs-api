const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
// register controller
const register = async (req, res) => {
  //create a new user
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  // send token
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

// login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  //verifying if login fields are provided
  if (!email || !password) {
    throw new BadRequestError("PLease provide email and password");
  }
  // get user from db
  const user = await User.findOne({ email });
  // if a user doesn't exist in our db throw unauthanticated error
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  // if a user exists
  //compare password
  const isPasswordCorrect = await user.comparePassword(password);
  //if the password is false
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  //if password is true
  // create a token
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
