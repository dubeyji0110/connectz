const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isEmail = require("validator/lib/isEmail");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Follower = require("../models/Follower");
const Notification = require("../models/Notification");

const router = express.Router();
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
const userPng =
	"https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png";

// validating a username
router.get("/:username", async (req, res) => {
	const { username } = req.params;

	try {
		if (username.length < 1)
			return res.status(401).send("Invalid Username");
		if (!regexUserName.test(username))
			return res.status(401).send("Invalid Username");

		const user = await User.findOne({
			username: username.toLowerCase(),
		});
		if (user) return res.status(401).send("Username not Available");
		return res.status(200).send("Available");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// registering a user
router.post("/", async (req, res) => {
	const {
		username,
		email,
		name,
		password,
		bio,
		github,
		website,
		instagram,
		twitter,
	} = req.body.user;
	if (!isEmail(email)) return res.status(401).send("Invalid Email");
	if (password.length < 6)
		return res.status(401).send("Password must be atleast 6 characters");

	try {
		// creating a user
		let user = await User.findOne({ email: email.toLowerCase() });
		if (user)
			return res
				.status(401)
				.send("User already registered with this Email");
		user = new User({
			name,
			email: email.toLowerCase(),
			username: username.toLowerCase(),
			password,
			profilePicUrl: req.body.profilePicUrl || userPng,
			cloudinaryId: req.body.profilePicUrl ? req.body.cloudinaryId : "",
		});
		user.password = await bcrypt.hash(password, 10);
		await user.save();

		// creating user profile
		let profileFeilds = {};
		profileFeilds.user = user._id;
		profileFeilds.bio = bio;
		profileFeilds.social = {};
		if (twitter) profileFeilds.social.twitter = twitter;
		if (website) profileFeilds.social.website = website;
		if (instagram) profileFeilds.social.instagram = instagram;
		if (github) profileFeilds.social.github = github;
		await new Profile(profileFeilds).save();

		// creating followers for user
		await new Follower({
			user: user._id,
			follower: [],
			following: [],
		}).save();

		// creating notifications for user
		await new Notification({
			user: user._id,
			notifications: [],
		}).save();

		// creating token for user
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
