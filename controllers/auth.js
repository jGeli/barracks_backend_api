import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/asyncHandler.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

import {
    validateLoginData,
    validateSignupData
} from '../utils/validators.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    })
};

export const createUser = asyncHandler(async (req, res, next) => {
  const { email, password, phone, firstName, lastName } = req.body;
  const { errors, valid } = validateSignupData(req.body);

  // Validate required fields
  if (!valid) {
    return res.status(400).json({
      m: "Required Fields",
      c: 400,
      d: errors,
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Creation of user
  const newUser = await User.create({
    // username: String(username).toLowerCase(),
    email: String(email).toLowerCase(),
    password: hashedPassword,
    firstName: String(firstName),
    lastName: String(lastName),
    phone,
    role: "user",
  }).catch((err) => {
    console.log(err);
  });

  if (newUser) {
    res.status(201).json({
      ...newUser._doc,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400).send("Invalid user data");
  }
});

export const signin = asyncHandler(async (req, res, next) => {
  const { errors, valid } = validateLoginData(req.body);
  try {
    if (!valid) {
      return res.status(400).json({
        message: "Invalid Data",
        c: 400,
        d: errors,
      });
    }

    let email = req.body.email;

    let user = await User.findOne({ email });
    console.log(user);
    if (!user)
      return res
        .status(400)
        .send({ status: 400, message: "Invalid Credentials" });
    // if (!user.isActivated)
    //   return res
    //     .status(400)
    //     .send({
    //       status: 400,
    //       message: "Pending Agent Approval!",
    //       data: user._id,
    //     });
    if (user.isSuspended)
      return res
        .status(400)
        .send({
          status: 400,
          message: "Your account has been Suspended!",
          username: String(user.email).toUpperCase(),
        });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res
        .status(400)
        .send({ status: 400, message: "Invalid Credentials" });

    const token = generateToken(user._id);
    res.status(200).send({ ...user._doc, token });
  } catch (err) {
    return res.status(400).json({
      message: "Invalid Data",
      c: 400,
      d: { message: "Invalid Credentials" },
    });
  }
});