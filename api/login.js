const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isEmail = require("validator/lib/isEmail");
const authenticateUser = require("../middlewares/authenticate");
const User = require("../models/User");
const Follower = require("../models/Follower");
const Notification = require("../models/Notification");
const Chat = require("../models/Chat");

const router = express.Router();

// send logged in user details
router.get("/", authenticateUser, async (req, res) => {
	const { userId } = req;
	try {
		const user = await User.findById(userId);
		const userFollowStats = await Follower.findOne({ user: userId });
		const user1 = await Notification.findOne({ user: userId });
		const len = user1.notifications.filter(
			(notification) => notification.unread === true
		).length;
		const user2 = await Chat.findOne({ user: userId });
		const unread = user2.chats.filter(
			(chat) => chat.unread === true
		).length;
		return res.status(200).json({ user, userFollowStats, len, unread });
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
