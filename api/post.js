const express = require("express");
const { v4 } = require("uuid");
const authenticate = require("../middlewares/authenticate");
const User = require("../models/User");
const Post = require("../models/Post");
const Follower = require("../models/Follower");
const cloudinary = require("../utils/cloudinaryInstance");
const router = express.Router();

// to create a post
router.post("/", authenticate, async (req, res) => {
	const { text, location, picUrl, cloudinaryId } = req.body;
	if (text.trim().length < 1)
		return res.status(401).send("Comment can't be empty");
	try {
		const newPost = {
			user: req.userId,
			text,
		};
		if (location) newPost.location = location;
		if (picUrl) newPost.picUrl = picUrl;
		if (cloudinaryId) newPost.cloudinaryId = cloudinaryId;
		const post = await new Post(newPost).save();
		const postCreated = await Post.findById(post._id).populate("user");
		return res.json(postCreated);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to get all posts
router.get("/", authenticate, async (req, res) => {
	const pageNumber = Number(req.query.pageNumber);
	const size = 5;
	try {
		let posts;
		if (pageNumber === 1) {
			posts = await Post.find()
				.limit(size)
				.sort({ createdAt: -1 })
				.populate("user")
				.populate("comments.user");
		} else {
			const skips = size * (pageNumber - 1);
			posts = await Post.find()
				.skip(skips)
				.limit(size)
				.sort({ createdAt: -1 })
				.populate("user")
				.populate("comments.user");
		}
		return res.json(posts);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to get a post by id
router.get("/:postId", authenticate, async (req, res) => {
	try {
		const post = await Post.findById(req.params.postId);
		if (!post) return res.status(404).send("Post not Found");
		return res.json(post);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to delete a post
const deletePost = async (post) => {
	if (post.cloudinaryId) await cloudinary.uploader.destroy(post.cloudinaryId);
	await post.remove();
};

router.delete("/:postId", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const { postId } = req.params;
		const post = await Post.findById(postId);
		if (!post) return res.status(404).send("Post not Found");
		const user = await User.findById(userId);
		if (post.user.toString() !== userId) {
			if (user.role === "role") await deletePost(post);
			else return res.status(401).send("Unauthorized");
		} else await deletePost(post);
		return res.status(200).send("Post Deleted Successfully!");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to like a post
router.post("/like/:postId", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const { postId } = req.params;
		const post = await Post.findById(postId);
		if (!post) return res.status(404).send("Post not Found");
		if (
			post.likes.filter((like) => like.user._id.toString() === userId)
				.length > 0
		)
			return res.status(401).send("Post Already Liked");
		await post.likes.unshift({ user: userId });
		await post.save();
		return res.status(200).send("Post Liked");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to unlike a post
router.put("/unlike/:postId", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const { postId } = req.params;
		const post = await Post.findById(postId);
		if (!post) return res.status(404).send("Post not Found");
		if (
			post.likes.filter((like) => like.user._id.toString() === userId)
				.length === 0
		)
			return res.status(401).send("Post not Liked Before");
		const idx = post.likes
			.map((like) => like.user.toString())
			.indexOf(userId);
		await post.likes.splice(idx, 1);
		await post.save();
		return res.status(200).send("Post Unliked");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to get all likes on a post
router.get("/likes/:postId", authenticate, async (req, res) => {
	try {
		const { postId } = req.params;
		const post = await Post.findById(postId).populate("likes.user");
		if (!post) return res.status(404).send("Post not Found");
		res.status(200).json(post.likes);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to create a comment
router.post("/comment/:postId", authenticate, async (req, res) => {
	try {
		const { userId } = req;
		const { postId } = req.params;
		const { text } = req.body;
		if (text.length < 1)
			return res.status(401).send("Comment can't be empty");
		const post = await Post.findById(postId);
		if (!post) return res.status(404).send("Post Not Found");
		const newComment = {
			_id: v4(),
			text,
			user: userId,
			date: Date.now(),
		};
		await post.comments.unshift(newComment);
		await post.save();
		return res.status(200).json(newComment._id);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

// to delete a comment
const deleteComment = async (post, commentId) => {
	const idx = post.comments.map((comment) => comment._id).indexOf(commentId);
	await post.comments.splice(idx, 1);
	await post.save();
};

router.delete("/:postId/:commentId", authenticate, async (req, res) => {
	try {
		const { postId, commentId } = req.params;
		const { userId } = req;
		const post = await Post.findById(postId);
		if (!post) return res.status(404).send("Post Not Found");
		const comment = post.comments.find(
			(comment) => comment._id === commentId
		);
		if (!comment) return res.status(404).send("Comment Not Found");
		const user = await User.findById(userId);
		if (comment.user.toString() !== userId) {
			if (user.role === "root") await deleteComment(post, commentId);
			else return res.status(401).send("Unauthorized");
		} else await deleteComment(post, commentId);
		return res.status(200).send("Comment Deleted!");
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
