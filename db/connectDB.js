const mongoose = require("mongoose");

async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useCreateIndex: true,
			useFindAndModify: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Database Connected!");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

module.exports = connectDB;
