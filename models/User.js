const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		profilePicUrl: {
			type: String,
		},
		cloudinaryId: {
			type: String,
		},
		role: {
			type: String,
			default: "user",
			enum: ["user", "root"],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
