const Chat = require("../models/Chat");
const User = require("../models/User");

const loadMessages = async (userId, messagesWith) => {
	try {
		const user = await Chat.findOne({ user: userId }).populate(
			"chats.messagesWith"
		);
		const chat = user.chats.find(
			(chat) => chat.messagesWith._id.toString() === messagesWith
		);
		if (!chat) return { error: "No Chat Found" };
		return { chat };
	} catch (error) {
		console.error(error);
		return { error };
	}
};

const sendMsg = async (userId, msgSendToUserId, msg) => {
	try {
		const user = await Chat.findOne({ user: userId });
		const msgSendToUser = await Chat.findOne({ user: msgSendToUserId });
		const newMsg = {
			sender: userId,
			receiver: msgSendToUserId,
			msg,
			date: Date.now(),
		};
		const chats = user.chats.find(
			(chat) => chat.messagesWith.toString() === msgSendToUserId
		);
		if (chats) {
			chats.messages.push(newMsg);
			await user.save();
		} else {
			const newChat = {
				messagesWith: msgSendToUserId,
				messages: [newMsg],
			};
			user.chats.unshift(newChat);
			await user.save();
		}
		const receiverChats = msgSendToUser.chats.find(
			(chat) => chat.messagesWith.toString() === userId
		);
		if (receiverChats) {
			receiverChats.messages.push(newMsg);
			receiverChats.unread = true;
			await msgSendToUser.save();
		} else {
			const newChat = {
				messagesWith: userId,
				messages: [newMsg],
			};
			msgSendToUser.chats.unshift(newChat);
			await msgSendToUser.save();
		}
		return { newMsg };
	} catch (error) {
		console.error(error);
		return { error };
	}
};

const setMessageToUnread = async (userId) => {
	try {
		const user = await User.findById(userId);
		if (!user.unreadMessage) user.unreadMessage = true;
		await user.save();
		return;
	} catch (error) {
		console.error(error);
	}
};

const deleteMsg = async (userId, messagesWith, msgId) => {
	try {
		const user = await Chat.findOne({ user: userId });
		const chat = user.chats.find(
			(chat) => chat.messagesWith.toString() === messagesWith
		);
		if (!chat) return;
		const msg = chat.messages.find(
			(message) => message._id.toString() === msgId
		);
		if (!msg) return;
		if (msg.sender.toString() !== userId) return;
		const idx = chat.messages
			.map((mesg) => mesg._id.toString())
			.indexOf(msg._id.toString());
		await chat.messages.splice(idx, 1);
		await user.save();
		return { success: true, error: null };
	} catch (error) {
		return { error, success: false };
	}
};

module.exports = { loadMessages, sendMsg, setMessageToUnread, deleteMsg };
