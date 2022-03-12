const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserMessage = require('../models/user');
const sendEmail = require('./sendMail');
const { google } = require('googleapis');
const fetch = require('node-fetch');
const { OAuth2 } = google.auth;
const CLIENT_ID =
	'659231216635-i0ajisc3rghfia0sf8d6drp28er4iqup.apps.googleusercontent.com';
const client = new OAuth2(CLIENT_ID);

const Register = async (req, res) => {
	try {
		const { email, password, name, confirmPassword } = req.body;
		if (!validateEmail(email)) {
			return res.status(400).json({ msg: 'Invalid emails.' });
		}
		const user = await UserMessage.findOne({ email });
		if (user) {
			return res.status(400).json({ msg: 'This email already exists.' });
		}
		if (password !== confirmPassword) {
			res.status(400).json({ message: "Password don't match." });
		}
		if (password.length < 6) {
			return res
				.status(400)
				.json({ msg: 'Password must be at least 6 characters.' });
		}
		const hashPassword = await bcrypt.hash(password, 12);
		const newUser = {
			name,
			email,
			password: hashPassword
		};
		const activation = jwt.sign(newUser, process.env.ACTIVATION, {
			expiresIn: '1h'
		});
		const url = `${process.env.CLIENT_URL}/user/activate/${activation}`;
		sendEmail(email, url, 'Verify your email address');
		res.json({ msg: 'Register Success! Please activate your email to start.' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const activateEmail = async (req, res) => {
	try {
		const { activation } = req.body;
		console.log(activation);
		const user = jwt.verify(activation, process.env.ACTIVATION);
		const { name, email, password } = user;
		const check = await UserMessage.findOne({ email });
		if (check) {
			return res.status(400).json({ message: 'This email already exists' });
		}
		const newUser = new UserMessage({
			name,
			email,
			password
		});
		await newUser.save();
		res.status(200).json({ message: 'Account has been activated!' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await UserMessage.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'This email does not exist.' });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Password is incorrect.' });
		}
		const refresh = jwt.sign({ id: user._id }, process.env.REFRESH, {
			expiresIn: '30m'
		});
		res.cookie('refreshToken', refresh, {
			httpOnly: true,
			path: '/user/refresh_token',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});
		res.status(200).json({ message: 'Login success', refresh });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const RefreshAccessToken = (req, res) => {
	try {
		const rf_token = req.cookies.refreshToken;
		if (!rf_token) {
			return res.status(400).json({ message: 'Please login now!' });
		}
		jwt.verify(rf_token, process.env.REFRESH, (err, user) => {
			if (err) {
				return res.status(400).json({ msg: err.message });
			}
			const access_token = jwt.sign({ id: user.id }, process.env.ACCESS, {
				expiresIn: '30m'
			});
			res.status(200).json({ access_token, user });
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await UserMessage.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'This email does not exist.' });
		}
		const access = jwt.sign({ id: user._id }, process.env.ACCESS, {
			expiresIn: '1h'
		});
		const url = `${process.env.CLIENT_URL}/user/password/reset/${access}`;
		sendEmail(email, url, 'Reset your password');
		res
			.status(200)
			.json({ message: 'Re-send the password, please check your email.' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const resetPassword = async (req, res) => {
	try {
		console.log(req.user);
		const { password, confirmPassword } = req.body;
		if (password !== confirmPassword) {
			res.status(400).json({ message: "Password don't match." });
		}
		const hashPassword = await bcrypt.hash(password, 12);
		await UserMessage.findByIdAndUpdate(
			{ _id: req.user.id },
			{ password: hashPassword }
		);
		res.status(200).json({ message: 'Password successfully changed!' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const getUserInfo = async (req, res) => {
	try {
		const user = await UserMessage.findById(req.user.id);
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const getUserAllInfo = async (req, res) => {
	try {
		const users = await UserMessage.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const logout = async (req, res) => {
	try {
		res.clearCookie('refreshToken', { path: '/user/refresh_token' });
		return res.status(200).json({ message: 'Logout out' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const GoogleLogin = async (req, res) => {
	try {
		const { tokenId } = req.body;
		const verify = await client.verifyIdToken({
			idToken: tokenId,
			audience: CLIENT_ID
		});
		const { email, email_verified, name, picture } = verify.payload;
		const password = email + process.env.GOOGLE_SECRET;
		const passwordHash = await bcrypt.hash(password, 12);
		if (!email_verified) {
			return res.status(400).json({ message: 'Email verification failed' });
		}

		const user = await UserMessage.findOne({ email });
		if (user) {
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ message: 'Password is incorrect' });
			}
			const refresh = jwt.sign({ id: user._id }, process.env.REFRESH, {
				expiresIn: '30m'
			});
			res.cookie('refreshToken', refresh, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000
			});
			res.status(200).json({ message: 'Login success' });
		} else {
			const newUser = new UserMessage({
				name,
				email,
				password: passwordHash,
				avatar: picture
			});
			await newUser.save();
			const refresh = jwt.sign({ id: newUser._id }, process.env.REFRESH, {
				expiresIn: '30m'
			});
			res.cookie('refreshToken', refresh, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000
			});
			res.status(200).json({ message: 'Login success' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const FaceLogin = async (req, res) => {
	try {
		const { accessToken, userID } = req.body;
		const url = `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`;
		const data = await fetch(url)
			.then(res => res.json())
			.then(res => {
				return res;
			});
		const { email, name, picture } = data;
		const password = email + process.env.FACEBOOK_SECRET;
		const passwordHash = await bcrypt.hash(password, 12);
		const user = await UserMessage.findOne({ email });
		if (user) {
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ message: 'Email verification failed' });
			}
			const refresh = jwt.sign({ id: user._id }, process.env.REFRESH, {
				expiresIn: '30m'
			});
			res.cookie('refreshToken', refresh, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000
			});
			res.status(200).json({ message: 'Login success' });
		} else {
			const newUser = new UserMessage({
				name,
				email,
				password: passwordHash,
				avatar: picture.data.url
			});
			await newUser.save();
			const refresh = jwt.sign({ id: newUser._id }, process.env.REFRESH, {
				expiresIn: '30m'
			});
			res.cookie('refreshToken', refresh, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000
			});
			res.status(200).json({ message: 'Login success' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const validateEmail = email => {
	const re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};
module.exports = {
	Register,
	activateEmail,
	login,
	RefreshAccessToken,
	resetPassword,
	forgotPassword,
	getUserInfo,
	getUserAllInfo,
	logout,
	GoogleLogin,
	FaceLogin
};
