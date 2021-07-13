const baseUrl =
	process.env.NODE_ENV === "production"
		? "https://connectz-app.herokuapp.com"
		: "http://127.0.0.1:3000";

export default baseUrl;
