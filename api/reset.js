const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sgt = require("nodemailer-sendgrid-transport");
const isEmail = require("validator/lib/isEmail");
const baseUrl = require("../utils/baseUrl");
const User = require("../models/User");
const router = express.Router();

const opts = {
	auth: {
		api_key: process.env.SENDGRID_API_KEY,
	},
};
const transporter = nodemailer.createTransport(sgt(opts));

// verifying user email
router.post("/", async (req, res) => {
	try {
		const { email } = req.body;
		if (!isEmail(email)) return res.status(401).send("Invalid Email");
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) return res.status(404).send("User Not Found");
		const token = crypto.randomBytes(32).toString("hex");
		user.resetToken = token;
		user.expireToken = Date.now() + 360000;
		await user.save();
		const href = `${baseUrl}/reset/${token}`;
		const mail = {
			to: [user.email],
			from: "devanshdubey2001@gmail.com",
			subject: "Password Reset Request",
			html: `<h5>Hey ${user.name
				.split(" ")[0]
				.toString()}</h5><br /><p>We receive a password reset request for CONNECTZ.</p><p><a href=${href}>Click Here</a><br /> This token is valid for 1 hour only.</p>`,
		};
		transporter.sendMail(mail, (err, info) => err && console.error(error));
		return res.status(200).send("Email Send");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to verify user token and reset password
router.post("/token", async (req, res) => {
	try {
		const { token, password } = req.body;
		if (!token) return res.status(401).send("Unauthorized");
		if (password.length < 6)
			return res
				.status(401)
				.send("Password must be between 6 to 20 charecters");
		const user = await User.findOne({ resetToken: token });
		if (!user) return res.status(404).send("User Not Found");
		if (Date.now() > user.expireToken) {
			user.resetToken = "";
			user.expireToken = undefined;
			await user.save();
			return res.status(401).send("Token Expired. Generate a new Token");
		}
		user.password = await bcrypt.hash(password, 10);
		user.resetToken = "";
		user.expireToken = undefined;
		await user.save();
		return res.status(200).send("Password Updated");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
