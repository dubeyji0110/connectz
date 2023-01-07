const baseUrl =
	process.env.NODE_ENV !== "production"
		? "http://127.0.0.1:8080"
		: "https://connectz.onrender.com";

module.exports = baseUrl;
