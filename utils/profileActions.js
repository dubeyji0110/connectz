import axios from "axios";
import cookie from "js-cookie";
import Router from "next/router";
import baseUrl from "./baseUrl";
import catchErrors from "./catchError";

const Axios = axios.create({
	baseURL: `${baseUrl}/api/profile`,
	headers: { Authorization: cookie.get("token") },
});

// to follow a user
export const followUser = async (
	userToFollowId,
	setUserFollowStats,
	setErrorMsg
) => {
	try {
		await Axios.post(`/follow/${userToFollowId}`);
		setUserFollowStats((prev) => ({
			...prev,
			following: [...prev.following, { user: userToFollowId }],
		}));
	} catch (error) {
		setErrorMsg(catchErrors(error));
	}
};

// to unfollow a user
export const unFollowUser = async (
	userToUnfollowId,
	setUserFollowStats,
	setErrorMsg
) => {
	try {
		await Axios.put(`/unfollow/${userToUnfollowId}`);
		setUserFollowStats((prev) => ({
			...prev,
			following: prev.following.filter(
				(following) => following.user !== userToUnfollowId
			),
		}));
	} catch (error) {
		setErrorMsg(catchErrors(error));
	}
};
