const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isEmail = require("validator/lib/isEmail");
const authenticateUser = require("../middlewares/authenticate");
const User = require("../models/User");
const Follower = require("../models/Follower");
const Notification = require("../models/Notification");

const router = express.Router();

// send logged in user details
router.get("/", authenticateUser, async (req, res) => {
	const { userId } = req;
	try {
		const user = await User.findById(userId);
		const userFollowStats = await Follower.findOne({ user: userId });
		return res.status(200).json({ user, userFollowStats });
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// login a user
router.post("/", async (req, res) => {
	const { email, password } = req.body.user;

	if (!isEmail(email)) return res.status(401).send("Invalid Email");
	if (password.length < 6)
		return res.status(401).send("Password must be atleast 6 characters");

	try {
		// verifying user
		const user = await User.findOne({ email: email.toLowerCase() }).select(
			"+password"
		);
		if (!user) return res.status(401).send("Invalid Credentials");
		const isPassword = await bcrypt.compare(password, user.password);
		if (!isPassword) return res.status(401).send("Invalid Credentials");

		// creating notification model for users
		const notification = await Notification.findOne({ user: user._id });
		if (!notification)
			await new Notification({
				user: user._id,
				notifications: [],
			}).save();

		// setting token of user
		const payload = { userId: user._id };
		jwt.sign(
			payload,
			process.env.jwtSecret,
			{ expiresIn: "2d" },
			(err, token) => {
				if (err) throw err;
				res.status(200).json(token);
			}
		);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
