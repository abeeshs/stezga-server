import asyncHandler from 'express-async-handler';
import User from '../model/userModel.js';
import Company from '../model/companyModel.js';
import mongoose from 'mongoose';
import * as authService from '../services/authService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import * as commonController from '../controller/commonController.js';
import Invite from '../model/inviteUserModel.js';

//Email and mobile validation
export const checkUserExist = asyncHandler(async (req, res) => {
  const { username, email, mobile, password, confirmPassword } = req.body;

  if (!username || !email || !mobile || !password || !confirmPassword) {
    res.status(400);
    throw new Error('All fields required');
  }
  //check email or user already exist

  const emailExist = await User.findOne({ email: email });
  const mobileExist = await User.findOne({ mobile: mobile });

  if (emailExist) {
    res.status(404);
    throw new Error('Email already exists');
  } else if (mobileExist) {
    res.status(404);
    throw new Error('Mobile already exists');
  } else {
    res.status(200).json({ status: 'Success' });
  }
});

//------------- Send email otp for login ------------

export const sendEmailOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Please enter Email');
  } else {
    const response = await commonController.emailOtpSender(email);
    const { OTP, result } = response;
    //storing the otp details
    const otpDetails = {
      email: email,
      otp: OTP,
    };

    //inserting otp details to the database
    const insertedData = await authService.emailOtpLogin(otpDetails);
    if (insertedData) {
      res.status(200).json({
        status: 'Success',
        message: 'Mail send successfully',
        info: result.messageId,
        preview: nodemailer.getTestMessageUrl(result),
      });
    } else {
      res.status(404);
      throw new Error('Failed to sent otp');
    }
  }
});

export const varifySignUpOtp = asyncHandler(async (req, res) => {
  const { otp, email, password, username, mobile, companyName, role } =
    req.body;
  //find the user with email
  const otpDetails = await authService.varifyEmailOtp(email);
  const existOtp = otpDetails?.otp;
  //if the otp matches
  if (existOtp == otp) {
    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userDetails = {
      username,
      email,
      mobile,
      password: hashedPassword,
      role: role,
    };
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      //inserting user data to database
      const user = await User.create([userDetails], { session });
      console.log({ user });

      const companyDetails = {
        name: companyName,
        company_owner: user[0]._id,
      };
      console.log(companyDetails);
      //After inserting userdata inserting company details
      const company = await Company.create([companyDetails], { session });
      //After inserting company details updating the usercolletion with company id
      const createdUser = await User.findByIdAndUpdate(
        user[0]._id,
        { company_id: company[0]._id },
        { session, new: true }
      );
      console.log(createdUser);
      if (!createdUser) {
        throw new Error('error');
      }
      await session.commitTransaction();
      res.status(201).json({
        status: 'Success',
        user: {
          username: createdUser.username,
          company_id: createdUser.company_id,
          mobile: createdUser.mobile,
          user_type: createdUser.user_type,
          email: createdUser.email,
          _id: createdUser._id,
        },
        email: user.email,
        token: generateToken(user[0]._id),
      });
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
    }
    session.endSession();
  } else {
    throw new Error('Incorrect otp');
  }
});

//------------- userSignup---------
//Method - POST
export const userRegister = asyncHandler(async (req, res) => {
  const { username, email, mobile, password, confirmPassword } = req.body;

  if (!username || !email || !mobile || !password || !confirmPassword) {
    res.status(400);
    throw new Error('All fields required');
  }
  //check email or user already exist

  const emailExist = await User.findOne({ email: email });

  if (emailExist) {
    res.status(404);
    throw new Error('Email already exists');
  } else {
    //password bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userDetails = {
      username,
      email,
      mobile,
      password: hashedPassword,
    };
    //inserting user data to database
    const user = await User.create(userDetails);
    if (user) {
      res.status(201).json({
        user: user,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid userdata');
    }
  }
});

//---------------userLogin----------
//method-POST

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  console.log('1');
  if (!email || !password) {
    res.status(400);
    throw new Error('All fields required');
  } else {
    const userExist = await User.findOne({ email: email }).select('+password');
    console.log(userExist);
    if (
      userExist &&
      (await bcrypt.compare(req.body.password, userExist.password))
    ) {
      if (userExist.is_block) {
        console.log('2');
        res.status(401);
        throw new Error('Temporarly blocked by admin');
      } else {
        console.log('3');
        res.status(200).json({
          status: 'Success',
          token: generateToken(userExist._id),
          user: userExist,
        });
      }
    } else {
      console.log('4');
      res.status(401);
      throw new Error('Incorrect email or password');
    }
  }
});

//--------------- otp Login ----------------
//method-POST
//NODE MAILER SETUP

export const otpLogin = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Please enter Email');
  } else {
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      res.status(400).json({ message: 'email not exist' });
      //throw new Error('user not exist');
    } else {
      const result = commonController.emailOtpSender(email);
      // //Creating random otp number
      // const OTP = Math.floor(1000 + Math.random() * 9000).toString();

      // //configuring nodemailer sender data
      // const config = {
      // 	service: 'gmail',
      // 	auth: {
      // 		user: process.env.EMAIL,
      // 		pass: process.env.PASSWORD
      // 	}
      // };

      // // create reusable transporter object using the default SMTP transport
      // let transporter = nodemailer.createTransport(config);

      // // Using mailgen creating a better mail format
      // const MailGenerator = new Mailgen({
      // 	theme: 'default',
      // 	product: {
      // 		name: 'Stezga',
      // 		link: 'https://mailgen.js/'
      // 	}
      // });

      // const response = {
      // 	body: {
      // 		intro: `Enter ${OTP} to varify your email address and sign in to your account`
      // 	}
      // };

      // const mail = MailGenerator.generate(response);

      // const message = {
      // 	from: process.env.EMAIL, // sender address
      // 	to: email, // list of receivers
      // 	subject: 'OTP for login', // Subject line
      // 	html: mail
      // };

      // // sending mail
      // const result = await transporter.sendMail(message);

      //storing the otp details
      const otpDetails = {
        email: email,
        otp: result.OTP,
      };

      //inserting otp details to the database
      const insertedData = await authService.emailOtpLogin(otpDetails);
      if (insertedData) {
        res.status(200).json({
          status: 'Success',
          message: 'Mail send successfully',
          info: result.messageId,
          preview: nodemailer.getTestMessageUrl(result),
        });
      } else {
        res.status(404);
        throw new Error('Failed to sent otp');
      }
    }
  }
});

//---------------- varify otp and do singin ----------------

export const varifyOtp = asyncHandler(async (req, res) => {
  const { otp, email } = req.body;
  const otpDetails = await authService.varifyEmailOtp(email);
  const existOtp = otpDetails?.otp;
  if (existOtp == otp) {
    const userExist = await User.findOne({ email: email });
    if (userExist?.is_block) {
      res.status(401);
      throw new Error('Temporarly blocked by admin');
    } else {
      res.status(200).json({
        message: 'Loggin Success',
        token: generateToken(userExist._id),
        username: userExist.username,
      });
    }
  } else {
    throw new Error('Incorrect otp');
  }
});

//--------------User Logout-------------
//Method - GET

export const userLogOut = async () => {
  try {
  } catch (err) {
    console.log(err);
  }
};

//--------- Generate jwt Token ----------------
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

//---------------- view all users ----------------

export const viewAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({
    company_id: req.user.company_id,
    user_type: { $ne: 'owner' },
  });
  console.log({ users });
  if (users) {
    res.status(200).json({ status: 'Success', users });
  } else {
    res.status(400);
    throw new Error('Users not found');
  }
});

//---------------- Get Profile ----------------

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).populate('company_id');
  console.log({ user });
  if (user) {
    res.status(200).json({ status: 'Success', user });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

export const editProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const data = req.body;
  const user = await User.findByIdAndUpdate(userId, data);
  console.log({ user });
  if (user) {
    res.status(200).json({ status: 'Success', user });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

export const inviteUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  console.log(req.body);
  if (!email) {
    res.status(400);
    throw new Error('Please enter email');
  } else {
    const user = await User.findOne({ email: email });

    if (user) {
      res.status(401);
      throw new Error('Email already exist');
    } else {
      const response = await commonController.emailInviteSender(email);
      const inviteDetails = {
        email: email,
        referenceId: response.refId,
        created_by: req.user._id,
        company_id: req.user.company_id,
      };
      const newUser = await Invite.create(inviteDetails);
      if (newUser) {
        res.status(200).json({ status: 'Success' });
      } else {
        throw new Error('Invitation failed');
      }
    }
  }
});

//----------  DELETE USER--------------
//Method -POST
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const users = await User.findByIdAndDelete(userId);
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(400);
    throw new Error('Users not found');
  }
});

//------------GET ALL USER----------------
//Method -GET

export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({
    company_id: req.user.company_id,
    user_type: { $ne: 'owner' },
  });

  if (users) {
    res.status(200).json({ status: 'Success', users });
  } else {
    res.status(400);
    throw new Error('Users not found');
  }
});

//------------BLOCK AND UNBLOCK USER----------------
//Method -GET

export const preventUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const updatedUser = await User.findByIdAndUpdate(userId, {
    is_block: req.body.status,
  });

  if (updatedUser) {
    res.status(200).json({ message: 'User blocked' });
  } else {
    res.status(400);
    throw new Error('Users not found');
  }
});

export const allowNewUser = asyncHandler(async (req, res) => {
  const { companyId, username, email, mobile, password, confirmPassword } =
    req.body;

  if (
    !companyId ||
    !username ||
    !email ||
    !mobile ||
    !password ||
    !confirmPassword
  ) {
    res.status(400);
    throw new Error('All fields required');
  }
  //Varifying user with company id

  const isValidUser = await Invite.findOne({
    email: email,
    referenceId: companyId,
  });

  if (!isValidUser) {
    res.status(404);
    throw new Error('Ivalid mail id or Company ID');
  } else {
    //password bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userDetails = {
      username,
      email,
      mobile,
      password: hashedPassword,
      user_type: 'user',
      company_id: isValidUser.company_id,
    };
    //inserting user data to database
    const user = await User.create(userDetails);
    if (user) {
      res.status(201).json({
        status: 'Success',
        user: {
          username: user.username,
          company_id: user.company_id,
          mobile: user.mobile,
          user_type: user.user_type,
          email: user.email,
          _id: user._id,
        },
        email: user.email,
        token: generateToken(user._id),
      });
      await Invite.deleteOne({
        email: email,
        referenceId: companyId,
      });
    } else {
      res.status(400);
      throw new Error('Invalid userdata');
    }
  }
});
