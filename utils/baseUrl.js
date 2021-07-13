const baseUrl =
	process.env.NODE_ENV !== "production"
		? "http://127.0.0.1:3000"
		: "https://connectz-app.herokuapp.com";

export default baseUrl;
