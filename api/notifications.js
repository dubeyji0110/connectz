const express = require("express");
const authenticate = require("../middlewares/authenticate");
const Notification = require("../models/Notification");
const User = require("../models/User");
const router = express.Router();

// to get all notifications of a user
router.get("/", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const user = await Notification.findOne({ user: userId })
			.populate("notifications.user")
			.populate("notifications.post");
		return res.json(user.notifications);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

router.get("/unreadNo", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const user = await Notification.findOne({ user: userId });
		const len = user.notifications.filter(
			(notification) => notification.unread === true
		).length;
		return res.status(200).json(len);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

router.post("/:notifyId", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const { notifyId } = req.params;
		const user = await Notification.findOne({ user: userId });
		user.notifications.map((notification) => {
			if (notification._id.toString() === notifyId) {
				notification.unread = false;
			}
		});
		await user.save();
		return res.status(200).send("Updated!");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to set unread notifications of a user
router.post("/", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const user = await User.findById(userId);
		if (user.unreadNotification) {
			user.unreadNotification = false;
			await user.save();
		}
		return res.status(200).send("Updated");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
