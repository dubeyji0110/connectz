const User = require("../models/User");
const Notification = require("../models/Notification");

// to set notifications to unread
const setNotificationToUnread = async (userId) => {
	try {
		const user = await User.findById(userId);
		if (!user.unreadNotification) {
			user.unreadNotification = true;
			await user.save();
		}
		return;
	} catch (error) {
		console.error(error);
	}
};

// to create new Like Notification
const notifyNewLike = async (userId, postId, userToNotifyId) => {
	try {
		const userToNotify = await Notification.findOne({
			user: userToNotifyId,
		});
		const newNotification = {
			type: "newLike",
			user: userId,
			post: postId,
			date: Date.now(),
		};
		await userToNotify.notifications.unshift(newNotification);
		await userToNotify.save();
		await setNotificationToUnread(userToNotifyId);
		return;
	} catch (error) {
		console.error(error);
	}
};

// to remove like notification
const removeNewLike = async (userId, postId, userToNotifyId) => {
	try {
		await Notification.findOneAndUpdate(
			{ user: userToNotifyId },
			{
				$pull: {
					notifications: {
						type: "newLike",
						user: userId,
						post: postId,
					},
				},
			}
		);
		return;
	} catch (error) {
		console.error(error);
	}
};

// to create new Comment Notification
const notifyNewComment = async (
	postId,
	commentId,
	userId,
	userToNotifyId,
	text
) => {
	try {
		const userToNotify = await Notification.findOne({
			user: userToNotifyId,
		});
		const newNotification = {
			type: "newComment",
			user: userId,
			post: postId,
			commentId,
			text,
			date: Date.now(),
		};
		await userToNotify.notifications.unshift(newNotification);
		await userToNotify.save();
		await setNotificationToUnread(userToNotifyId);
		return;
	} catch (error) {
		console.error(error);
	}
};

// to remove comment notification
const removeNewComment = async (postId, commentId, userId, userToNotifyId) => {
	try {
		await Notification.findOneAndUpdate(
			{ user: userToNotifyId },
			{
				$pull: {
					notifications: {
						type: "newComment",
						user: userId,
						post: postId,
						commentId: commentId,
					},
				},
			}
		);
		return;
	} catch (error) {
		console.error(error);
	}
};

// to create new Follower Notification
const notifyNewFollower = async (userId, userToNotifyId) => {
	try {
		const user = await Notification.findOne({ user: userToNotifyId });
		const newNotification = {
			type: "newFollower",
			user: userId,
			date: Date.now(),
		};
		await user.notifications.unshift(newNotification);
		await user.save();
		await setNotificationToUnread(userToNotifyId);
	} catch (error) {
		console.error(error);
	}
};

// to remove follower notification
const removeNewFollower = async (userId, userToNotifyId) => {
	try {
		await Notification.findOneAndUpdate(
			{ user: userToNotifyId },
			{
				$pull: {
					notifications: {
						type: "newFollower",
						user: userId,
					},
				},
			}
		);
	} catch (error) {
		console.error(error);
	}
};

module.exports = {
	notifyNewLike,
	notifyNewComment,
	notifyNewFollower,
	removeNewLike,
	removeNewComment,
	removeNewFollower,
};
