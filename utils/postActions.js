import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchError";
import cookie from "js-cookie";

const Axios = axios.create({
	baseURL: `${baseUrl}/api/posts`,
	headers: { Authorization: cookie.get("token") },
});

// to create new post
export const submitNewPost = async (
	text,
	location,
	picUrl,
	cloudinaryId,
	setPosts,
	setNewPost,
	setErrorMsg
) => {
	try {
		const res = await Axios.post("/", {
			text,
			location,
			picUrl,
			cloudinaryId,
		});
		setPosts((prev) => [res.data, ...prev]);
		setNewPost({ text: "", location: "" });
	} catch (error) {
		setErrorMsg(catchErrors(error));
	}
};

// to delete a post
export const deletePost = async (
	postId,
	setPosts,
	setErrorMsg,
	setShowToaster
) => {
	try {
		await Axios.delete(`/${postId}`);
		setPosts((prev) => prev.filter((post) => post._id !== postId));
		setShowToaster({ show: true, msg: "Post Deleted!" });
	} catch (error) {
		setErrorMsg(catchErrors(error));
	}
};

// to like/unlike a post
export const likePost = async (
	postId,
	userId,
	setLikes,
	setErrorMsg,
	like = true
) => {
	try {
		if (like) {
			await Axios.post(`/like/${postId}`);
			setLikes((prev) => [...prev, { user: userId }]);
		} else {
			await Axios.put(`/unlike/${postId}`);
			setLikes((prev) => prev.filter((like) => like.user !== userId));
		}
	} catch (error) {
		setErrorMsg(catchErrors(error));
	}
};

// to post a comment
export const postComment = async (
	postId,
	user,
	text,
	setComments,
	setText,
	setErrorMsg
) => {
	try {
		const res = await Axios.post(`/comment/${postId}`, { text });
		const newComment = {
			_id: res.data,
			user,
			text,
			date: Date.now(),
		};
		setComments((prev) => [newComment, ...prev]);
		setText("");
	} catch (error) {
		setErrorMsg(catchErrors(error));
	}
};

// to delete a comment
export const deleteComment = async (
	postId,
	commentId,
	setComments,
	setErrorMsg,
	setShowToaster
) => {
	try {
		await Axios.delete(`/${postId}/${commentId}`);
		setComments((prev) =>
			prev.filter((comment) => comment._id !== commentId)
		);
		setShowToaster({ show: true, msg: "Comment Deleted!" });
	} catch (error) {
		setErrorMsg(catchErrors(error));
	}
};
