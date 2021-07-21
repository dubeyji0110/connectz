const express = require("express");
const authenticate = require("../middlewares/authenticate");
const Chat = require("../models/Chat");
const User = require("../models/User");
const router = express.Router();

// to get all chats of a user
router.get("/", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const user = await Chat.findOne({ user: userId }).populate(
			"chats.messagesWith"
		);
		let chats = [];
		if (user.chats.length > 0) {
			chats = await user.chats.map((chat) => ({
				messagesWith: chat.messagesWith._id,
				name: chat.messagesWith.name,
				profilePicUrl: chat.messagesWith.profilePicUrl,
				lastMessage: chat.messages[chat.messages.length - 1].msg,
				date: chat.messages[chats.messages.length - 1].date,
			}));
		}
		return res.json(chats);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to get user info
router.get("/user/:userId", authenticate, async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) return res.status(404).send("User Not Found");
		return res
			.status(200)
			.json({ name: user.name, profilePicUrl: user.profilePicUrl });
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to delete a chat
router.delete("/:messagesWith", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const { messagesWith } = req.params;
		const user = await Chat.findOne({ user: userId });
		const chatToDelete = user.chats.find(
			(chat) => chat.messsagesWith.toString() === messagesWith
		);
		if (!chatToDelete) return res.status(404).send("Chat Not Found");
		const idx = user.chats
			.map((chat) => chat.messagesWith.toString())
			.indexOf(messagesWith);
		user.chats.splice(idx, 1);
		await user.save();
		return res.status(200).send("Chat Deleted");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
