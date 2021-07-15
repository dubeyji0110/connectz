const express = require("express");
const bcrypt = require("bcrypt");
const authenticate = require("../middlewares/authenticate");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Follower = require("../models/Follower");
const Post = require("../models/Post");
const cloudinary = require("../utils/cloudinaryInstance");
const router = express.Router();

// to get a user profile
router.get("/:username", authenticate, async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username: username.toLowerCase() });
		if (!user) return res.status(404).send("User not Found");
		const profile = await Profile.findOne({ user: user._id }).populate(
			"user"
		);
		const followStats = await Follower.findOne({ user: user._id });
		return res.status(200).json({
			profile,
			followersLength: followStats.followers.length,
			followingLength: followStats.following.length,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to get posts of a user
router.get("/posts/:username", authenticate, async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username: username.toLowerCase() });
		if (!user) return res.status(404).send("User not Found");
		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate("user")
			.populate("comments.user");
		return res.status(200).json(posts);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to follow a user
router.post("/follow/:userToFollowId", authenticate, async (req, res) => {
	const { userId } = req;
	const { userToFollowId } = req.params;
	if (userId === userToFollowId)
		return res.status(401).send("Cannot follow your own account");
	try {
		const user = await Follower.findOne({ user: userId });
		const userToFollow = await Follower.findOne({
			user: userToFollowId,
		}).populate("user");
		if (!user || !userToFollow)
			return res.status(404).send("User not Found");
		if (
			user.following.length > 0 &&
			user.following.filter(
				(following) => following.user.toString() === userToFollowId
			).length > 0
		)
			return res.status(401).send("User already Followed");
		await user.following.unshift({ user: userToFollowId });
		await userToFollow.followers.unshift({ user: userId });
		await user.save();
		await userToFollow.save();
		return res
			.status(200)
			.send(`You followed ${userToFollow.user.username}`);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to unfollow a user
router.put("/unfollow/:userToUnfollowId", authenticate, async (req, res) => {
	const { userId } = req;
	const { userToUnfollowId } = req.params;
	if (userId === userToUnfollowId)
		return res.status(401).send("Cannot unfollow your own account");
	try {
		const user = await Follower.findOne({ user: userId });
		const userToUnfollow = await Follower.findOne({
			user: userToUnfollowId,
		}).populate("user");
		if (!user || !userToUnfollow)
			return res.status(404).send("User not Found");
		if (
			user.following.length > 0 &&
			user.following.filter(
				(following) => following.user.toString() === userToUnfollowId
			).length === 0
		)
			return res.status(401).send("User not Followed");
		const idx1 = user.following
			.map((following) => following.user.toString())
			.indexOf(userToUnfollowId);
		const idx2 = userToUnfollow.followers
			.map((follower) => follower.user.toString())
			.indexOf(userId);
		await user.following.splice(idx1, 1);
		await userToUnfollow.followers.splice(idx2, 1);
		await user.save();
		await userToUnfollow.save();
		return res
			.status(200)
			.send(`You Unfollowed ${userToUnfollow.user.username}`);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to get followers of a user
router.get("/followers/:userId", authenticate, async (req, res) => {
	const { userId } = req.params;
	try {
		const user = await Follower.findOne({ user: userId }).populate(
			"followers.user"
		);
		return res.json(user.followers);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to get following of a user
router.get("/following/:userId", authenticate, async (req, res) => {
	const { userId } = req.params;
	try {
		const user = await Follower.findOne({ user: userId }).populate(
			"following.user"
		);
		return res.json(user.following);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to update user profile
router.post("/update", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const {
			bio,
			github,
			twitter,
			instagram,
			website,
			profilePicUrl,
			cloudinaryId,
		} = req.body;
		let profile = {};
		profile.user = userId;
		profile.bio = bio;
		profile.social = {};
		if (twitter) profile.social.twitter = twitter;
		if (instagram) profile.social.instagram = instagram;
		if (github) profile.social.github = github;
		if (website) profile.social.website = website;
		await Profile.findOneAndUpdate(
			{ user: userId },
			{ $set: profile },
			{ new: true }
		);
		if (profilePicUrl) {
			const user = await User.findById(userId);
			user.cloudinaryId &&
				(await cloudinary.uploader.destroy(user.cloudinaryId));
			user.profilePicUrl = profilePicUrl;
			user.cloudinaryId = cloudinaryId;
			await user.save();
		}
		return res.status(200).send("Profile Updated");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
