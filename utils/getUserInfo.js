import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "./baseUrl";

const getUserInfo = async (userId) => {
	try {
		const res = await axios.get(`${baseUrl}/api/chats/user/${userId}`, {
			headers: { Authorization: cookie.get("token") },
		});
		return { name: res.data.name, profilePicUrl: res.data.profilePicUrl };
	} catch (error) {
		console.error(error);
		return { name: null, profilePicUrl: null };
	}
};

export default getUserInfo;
