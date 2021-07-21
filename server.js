const express = require("express");
const app = express();
const server = require("http").Server(app);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
dev && require("dotenv").config();
const connectDB = require("./db/connectDB");
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const PORT = process.env.PORT || 3000;
app.use(express.json());

connectDB();

nextApp.prepare().then(() => {
	app.use("/api/signup", require("./api/signup"));
	app.use("/api/auth", require("./api/login"));
	app.use("/api/search", require("./api/search"));
	app.use("/api/posts", require("./api/post"));
	app.use("/api/profile", require("./api/profile"));
	app.use("/api/notifications", require("./api/notifications"));
	app.use("/api/chats", require("./api/chats"));

	app.all("*", (req, res) => handle(req, res));
	server.listen(PORT, (err) => {
		if (err) throw err;
		console.log("Server Started");
	});
});
