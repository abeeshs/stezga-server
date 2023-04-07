import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Admin from '../model/adminModel.js';
import User from '../model/userModel.js';

export const adminProtect = asyncHandler(async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			//get the token
			token = req.headers.authorization.split(' ')[1];
			console.log(token);

			//varify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			// console.log(decoded)

			//get admin from the token
			req.user = await Admin.findById(decoded.id).select('-password');
			next();
		} catch (err) {
			console.log(err);
			res.status(401);
			throw new Error('Not authorized');
		}
	}
	if (!token) {
		res.status(401);
		throw new Error('Not authorized ,no token');
	}
});

export const userProtect = asyncHandler(async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			//get the token
			token = req.headers.authorization.split(' ')[1];
			console.log(token)

			//varify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			// console.log(decoded)

			//get USER from the token
			const user = await User.findById(decoded.id).select('-password');

			if (user) {
				if (user.is_block === true) {
					res.status(400).json({ message: 'User Blocked' });
				} else {
					req.user = user;
					next();
				}
			} else {
				throw new Error('Not authorized');
			}
		} catch (err) {
			console.log(err);
			res.status(401);
			throw new Error('Not authorized');
		}
	}
	if (!token) {
		res.status(401);
		throw new Error('Not authorized ,no token');
	}
});
