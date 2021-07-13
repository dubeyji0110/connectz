const baseUrl =
	process.env.NODE_ENV !== "production"
		? "http://127.0.0.1:3000"
		: "https://connectz.vercel.com";

export default baseUrl;
