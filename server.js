const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const connectDB = require("./db/connectDB");
const {
	addUser,
	removeUser,
	findConnectedUser,
} = require("./server/userActions");
const {
	loadMessages,
	sendMsg,
	setMessageToUnread,
	deleteMsg,
} = require("./server/messageActions");

const dev = process.env.NODE_ENV !== "production";
dev && require("dotenv").config();
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const PORT = process.env.PORT || 3000;
app.use(express.json());

connectDB();

io.on("connection", (socket) => {
	socket.on("join", async ({ userId }) => {
		const users = await addUser(userId, socket.id);
		setInterval(() => {
			socket.emit("connectedUsers", {
				users: users.filter((user) => user.userId !== userId),
			});
		}, 5000);
	});

	socket.on("loadMessages", async ({ userId, messagesWith }) => {
		const { chat, error } = await loadMessages(userId, messagesWith);
		if (!error) socket.emit("messagesLoaded", { chat });
		else socket.emit("noChatFound");
	});

	socket.on("sendNewMsg", async ({ userId, msgSendToUserId, msg }) => {
		const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
		if (error) {
			const sender = findConnectedUser(userId);
			sender && io.to(sender.socketId).emit("msgNotSent");
			return;
		}
		const receiver = findConnectedUser(msgSendToUserId);
		if (receiver)
			io.to(receiver.socketId).emit("newMsgReceived", { newMsg });
		await setMessageToUnread(msgSendToUserId);
		socket.emit("msgSent", { newMsg });
	});

	socket.on("deleteMsg", async ({ userId, messagesWith, msgId }) => {
		const { success, error } = await deleteMsg(userId, messagesWith, msgId);
		if (error) {
			const user = findConnectedUser(userId);
			user && io.to(user.socketId).emit("ErrorDeleteMsg");
			return;
		}
		if (success) socket.emit("msgDeleted");
	});

	socket.on("disconnect", () => removeUser(socket.id));
});

nextApp.prepare().then(() => {
	app.use("/api/signup", require("./api/signup"));
	app.use("/api/auth", require("./api/login"));
	app.use("/api/search", require("./api/search"));
	app.use("/api/posts", require("./api/post"));
	app.use("/api/profile", require("./api/profile"));
	app.use("/api/notifications", require("./api/notifications"));
	app.use("/api/chats", require("./api/chats"));
	app.use("/api/reset", require("./api/reset"));

	app.all("*", (req, res) => handle(req, res));
	server.listen(PORT, (err) => {
		if (err) throw err;
		console.log("Server Started");
	});
});
