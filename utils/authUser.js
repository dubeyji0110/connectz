import axios from "axios";
import cookie from "js-cookie";
import Router from "next/router";
import baseUrl from "./baseUrl";
import catchErrors from "./catchError";

export const registerUser = async (
	user,
	profilePicUrl,
	cloudinaryId,
	setErrMsg
) => {
	try {
		const res = await axios.post(`${baseUrl}/api/signup`, {
			user,
			profilePicUrl,
			cloudinaryId,
		});
		setToken(res.data);
	} catch (error) {
		setErrMsg(catchErrors(error));
	}
};

export const loginUser = async (user, setFormLoading, setErrMsg) => {
	try {
		const res = await axios.post(`${baseUrl}/api/auth`, { user });
		setToken(res.data);
	} catch (error) {
		setErrMsg(catchErrors(error));
	}
	setFormLoading(false);
};

export const logoutUser = (email) => {
	cookie.set("userEmail", email);
	cookie.remove("token");
	Router.push("/login");
	Router.reload();
};

export const redirectUser = (ctx, location) => {
	if (ctx.req) {
		ctx.res.writeHead(302, { Location: location });
		ctx.res.end();
	} else {
		Router.push(location);
	}
};

const setToken = (token) => {
	cookie.set("token", token);
	Router.push("/");
};
