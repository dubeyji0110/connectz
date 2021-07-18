import { useEffect, useState } from "react";
import {
	FavoriteRounded,
	FavoriteBorderRounded,
	ChatBubbleOutlineRounded,
} from "@material-ui/icons";
import {
	Segment,
	Image,
	Popup,
	Button,
	Divider,
	Modal,
} from "semantic-ui-react";
import Link from "next/link";
import formatTime from "../../utils/formatTime";
import CommentInput from "../Custom/CommentInput";
import PostComment from "./PostComment";
import ImgModal from "./ImgModal";
import NoImgModal from "./NoImgModal";
import { deletePost, likePost } from "../../utils/postActions";
import LikesList from "./LikesList";

function CardPost({ user, post, setPosts, setShowToaster, setErrorMsg }) {
	const [likes, setLikes] = useState(post.likes);
	const [liked, setLiked] = useState(false);
	const [comments, setComments] = useState(post.comments);
	const [modal, showModal] = useState(false);

	const isLiked =
		likes.length > 0 &&
		likes.filter((like) => like.user === user._id).length > 0;

	const modalProps = {
		post,
		user,
		setLikes,
		setComments,
		likes,
		comments,
		isLiked,
		setErrorMsg,
		setShowToaster,
	};

	useEffect(() => {
		liked && setTimeout(() => setLiked(false), 800);
	}, [liked]);

	return (
		<>
			{modal && (
				<Modal
					open={modal}
					closeIcon
					closeOnDimmerClick
					onClose={() => showModal(false)}>
					<Modal.Content>
						{post.picUrl ? (
							<ImgModal {...modalProps} />
						) : (
							<NoImgModal {...modalProps} />
						)}
					</Modal.Content>
				</Modal>
			)}
			<Segment
				style={{
					borderRadius: "15px",
					boxShadow:
						"1px 1px 2px -1px rgb(0 0 0 / 25%), -1px -1px 2px -1px rgb(0 0 0 / 25%)",
					padding: "0",
					marginBottom: "1.7rem",
					paddingTop: "1rem",
					border: "0",
					overflow: "hidden",
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
							<Link href={`/user/${post.user.username}`}>
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
					{(user.role === "root" || post.user._id === user._id) && (
						<Popup
							on='click'
							position='top right'
							trigger={
								<Image
									src='/deleteIcon.svg'
									style={{
										width: "1.7rem",
										height: "1.7rem",
										cursor: "pointer",
									}}
								/>
							}>
							<h4 style={{ fontSize: "1.2rem" }}>
								Are you sure to delete?
							</h4>
							<p
								style={{
									fontSize: "1rem",
									fontWeight: "500",
									textShadow: "none",
									marginBottom: "5px",
								}}>
								This action is irreversible!
							</p>
							<Button
								size='mini'
								color='red'
								icon='trash'
								content='Delete'
								onClick={() => {
									deletePost(
										post._id,
										setPosts,
										setErrorMsg,
										setShowToaster
									);
								}}
							/>
						</Popup>
					)}
				</div>
				<p style={{ paddingLeft: "2.1rem" }}>{post.text}</p>
				{post.picUrl && (
					<div
						className='post_img'
						style={{ cursor: "pointer", position: "relative" }}
						// ! review if you want a single click modal (remove double click)
						// onClick={() => showModal(true)}
					>
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
									animation: "popup 200ms linear forwards",
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
									animation: "popup 200ms linear forwards",
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
										likes.length === 1 ? "like" : "likes"
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
				{comments.length > 0 && (
					<div className='post_comments'>
						{comments.map(
							(comment, i) =>
								i < 2 && (
									<PostComment
										key={comment._id}
										comment={comment}
										postId={post._id}
										user={user}
										setComments={setComments}
										setErrorMsg={setErrorMsg}
										setShowToaster={setShowToaster}
									/>
								)
						)}
						{comments.length > 2 && (
							<button
								className='viewmore'
								onClick={() => showModal(true)}>
								View More Comments
							</button>
						)}
					</div>
				)}
				<CommentInput
					user={user}
					postId={post._id}
					setComments={setComments}
					setErrorMsg={setErrorMsg}
				/>
			</Segment>
		</>
	);
}

export default CardPost;
