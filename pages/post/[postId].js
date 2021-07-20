import axios from "axios";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Divider, Dropdown, Image, Segment } from "semantic-ui-react";
import {
	ChatBubbleOutlineRounded,
	FavoriteBorderRounded,
	FavoriteRounded,
	MoreVertRounded,
} from "@material-ui/icons";
import baseUrl from "../../utils/baseUrl";
import { NoPost } from "../../Components/Common/NoData";
import LikesList from "../../Components/Post/LikesList";
import PostComment from "../../Components/Post/PostComment";
import CommentInput from "../../Components/Custom/CommentInput";
import formatTime from "../../utils/formatTime";
import { deletePost, likePost } from "../../utils/postActions";
import { ErrorToastr, SuccessToastr } from "../../Components/Common/Toaster";
import Router from "next/router";

function PostPage({ post, errorLoading, user }) {
	if (errorLoading) return <NoPost />;

	const [likes, setLikes] = useState(post.likes);
	const [comments, setComments] = useState(post.comments);
	const [liked, setLiked] = useState(false);
	const [showToaster, setShowToaster] = useState({ show: false, msg: "" });
	const [errorMsg, setErrorMsg] = useState(null);

	const isLiked =
		likes.length > 0 &&
		likes.filter((like) => like.user === user._id).length > 0;

	useEffect(() => {
		document.title = `Post By @${post.user.username}`;
		liked && setTimeout(() => setLiked(false), 800);
	}, [liked]);

	useEffect(() => {
		errorMsg !== null && setTimeout(() => setErrorMsg(null), 4000);
	}, [errorMsg]);

	useEffect(() => {
		showToaster.show &&
			setTimeout(() => setShowToaster({ show: false, msg: "" }), 4000);
	}, [showToaster]);

	return (
		<>
			{errorMsg && <ErrorToastr error={errorMsg} />}
			{showToaster.show && <SuccessToastr msg={showToaster.msg} />}
			<div style={{ paddingBottom: "2rem" }}>
				<Segment
					style={{
						borderRadius: "15px",
						boxShadow:
							"1px 1px 2px -1px rgb(0 0 0 / 25%), -1px -1px 2px -1px rgb(0 0 0 / 25%)",
						padding: "0",
						paddingTop: "1rem",
						border: "0",
						zIndex: "0",
					}}>
					<div className='post_header'>
						<Image
							src={post.user.profilePicUrl}
							avatar
							circular
							style={{ width: "2.7rem", height: "2.7rem" }}
						/>
						<div className='post_details'>
							<h3 style={{ fontSize: "1.2rem" }}>
								<Link
									href={`/user/${post.user.username}?tab=profile`}>
									<a>{post.user.name}</a>
								</Link>
							</h3>
							<p className='textlight'>
								{formatTime(post.createdAt)}
							</p>
							{post.location && (
								<p className='textlight'>{post.location}</p>
							)}
						</div>
						{user.role === "root" ||
							(post.user._id === user._id && (
								<Dropdown
									trigger={<MoreVertRounded />}
									item
									icon={false}
									pointing={false}
									direction='left'>
									<Dropdown.Menu
										style={{
											marginTop: "6px",
											padding: "0 0.4rem",
										}}>
										<Dropdown.Item
											style={{
												padding: "0.8rem 1rem",
												borderBottom:
													"1px solid rgba(0,0,0,0.09)",
											}}>
											<div
												onClick={async () => {
													await deletePost(
														post._id,
														null,
														setErrorMsg,
														setShowToaster
													);
													Router.push("/feed");
												}}
												style={{
													display: "flex",
													justifyContent:
														"space-between",
													alignItems: "center",
												}}>
												<Image
													src='/deleteIcon.svg'
													style={{
														width: "1.7rem",
														height: "1.7rem",
														cursor: "pointer",
														filter: "saturate(0)",
													}}
												/>
												Delete Post
											</div>
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							))}
					</div>
					<p style={{ paddingLeft: "2.1rem" }}>{post.text}</p>
					{post.picUrl && (
						<div
							className='post_img'
							style={{ cursor: "pointer", position: "relative" }}>
							<div
								onDoubleClick={async () => {
									if (!isLiked) {
										setLiked(true);
										await likePost(
											post._id,
											user._id,
											setLikes,
											setErrorMsg,
											!isLiked
										);
									}
								}}
								style={{
									position: "absolute",
									width: "100%",
									height: "100%",
									zIndex: "1",
								}}></div>
							{liked && (
								<FavoriteRounded
									style={{
										color: "#efe1e1bc",
										animation:
											"popup 200ms linear forwards",
										position: "absolute",
										top: "0",
										left: "0",
										bottom: "0",
										right: "0",
										margin: "auto",
										width: "6rem",
										height: "6rem",
										zIndex: "2",
									}}
								/>
							)}
							<Image src={post.picUrl} />
						</div>
					)}
					{post.picUrl ? (
						<Divider
							style={{ marginBottom: "0.5rem", marginTop: "0" }}
						/>
					) : (
						<Divider style={{ margin: "0.5rem 0" }} />
					)}
					<div className='post_footer'>
						<div style={{ display: "flex", alignItems: "center" }}>
							{isLiked ? (
								<FavoriteRounded
									onClick={() =>
										likePost(
											post._id,
											user._id,
											setLikes,
											setErrorMsg,
											!isLiked
										)
									}
									style={{
										color: "#ce0c0c",
										animation:
											"popup 200ms linear forwards",
									}}
								/>
							) : (
								<FavoriteBorderRounded
									onClick={() =>
										likePost(
											post._id,
											user._id,
											setLikes,
											setErrorMsg,
											!isLiked
										)
									}
								/>
							)}
							<LikesList
								postId={post._id}
								setErrorMsg={setErrorMsg}
								trigger={
									likes.length > 0 && (
										<span className='spanLike'>{`${
											likes.length
										} ${
											likes.length === 1
												? "like"
												: "likes"
										}`}</span>
									)
								}
							/>
						</div>
						<div
							style={{
								transform: "scale(0.9)",
								marginLeft: "10px",
								display: "flex",
							}}>
							<label
								htmlFor={post._id}
								style={{ display: "inherit" }}>
								<ChatBubbleOutlineRounded />
							</label>
						</div>
					</div>
					<CommentInput
						user={user}
						postId={post._id}
						setComments={setComments}
						setErrorMsg={setErrorMsg}
					/>
					{comments.length > 0 && (
						<div
							className='post_comments'
							style={{ marginTop: "1rem" }}>
							{comments.map((comment) => (
								<PostComment
									key={comment._id}
									comment={comment}
									postId={post._id}
									user={user}
									setComments={setComments}
									setErrorMsg={setErrorMsg}
									setShowToaster={setShowToaster}
								/>
							))}
						</div>
					)}
				</Segment>
			</div>
		</>
	);
}

PostPage.getInitialProps = async (ctx) => {
	try {
		const { postId } = ctx.query;
		const { token } = parseCookies(ctx);
		const res = await axios.get(`${baseUrl}/api/posts/${postId}`, {
			headers: { Authorization: token },
		});
		return { post: res.data };
	} catch (error) {
		return { errorLoading: true };
	}
};

export default PostPage;
