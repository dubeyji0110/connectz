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
				unread: chat.unread,
				profilePicUrl: chat.messagesWith.profilePicUrl,
				lastMessage:
					chat.messages.length > 0
						? chat.messages[chat.messages.length - 1].msg
						: "",
				date:
					chat.messages.length > 0
						? chat.messages[chat.messages.length - 1].date
						: Date.now(),
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
		return res.status(200).json({
			name: user.name,
			profilePicUrl: user.profilePicUrl,
			username: user.username,
		});
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
			(chat) => chat.messagesWith.toString() === messagesWith
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

// to add new Chat
router.post("/addchat", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const { messagesWith } = req.body;
		const user = await Chat.findOne({ user: userId });
		const newChat = {
			messagesWith,
			messages: [],
		};
		user.chats.unshift(newChat);
		user.save();
		return res.status(200).send("Chat Added");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to find number of unread messages
router.get("/unread", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const user = await Chat.findOne({ user: userId });
		const unread = user.chats.filter((chat) => chat.unread === true).length;
		res.status(200).json(unread);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// set chat as read
router.post("/readchat/:messagesWith", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const { messagesWith } = req.params;
		const user = await Chat.findOne({ user: userId });
		const chat = user.chats.filter(
			(chat) => chat.messagesWith.toString() === messagesWith
		);
		if (chat[0].unread) chat[0].unread = false;
		user.chats.map((chat) => {
			if (chat.messagesWith.toString() === messagesWith)
				chat.unread = false;
		});
		user.save();
		res.status(200).send("updated");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
