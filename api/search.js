const express = require("express");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();
const User = require("../models/User");

// search user
router.get("/:query", authenticate, async (req, res) => {
	const { query } = req.params;
	const { userId } = req;
	if (query.length === 0) return;
	try {
		const results = await User.find({
			name: { $regex: query, $options: "i" },
		});
		res.json(results.filter((result) => result._id.toString() !== userId));
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
