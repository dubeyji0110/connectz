import { Image, Divider } from "semantic-ui-react";
import Link from "next/link";
import {
	ChatBubbleOutlineRounded,
	FavoriteBorderRounded,
	FavoriteRounded,
} from "@material-ui/icons";
import PostComment from "./PostComment";
import CommentInput from "../Custom/CommentInput";
import formatTime from "../../utils/formatTime";
import { likePost } from "../../utils/postActions";
import LikesList from "./LikesList";

function ImgModal({
	post,
	user,
	setLikes,
	setComments,
	likes,
	comments,
	isLiked,
	setErrorMsg,
	setShowToaster,
}) {
	return (
		<div className='post_modal'>
			<div className='postImg'>
				<Image src={post.picUrl} />
			</div>
			<div className='post_content'>
				<div style={{ flex: "1" }}>
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
					</div>

					<p style={{ paddingLeft: "2.1rem" }}>{post.text}</p>
					<Divider style={{ margin: "0.5rem 0" }} />
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
											false
										)
									}
									style={{ color: "#ce0c0c" }}
								/>
							) : (
								<FavoriteBorderRounded
									onClick={() =>
										likePost(
											post._id,
											user._id,
											setLikes,
											setErrorMsg,
											true
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
							<ChatBubbleOutlineRounded />
						</div>
					</div>
					{comments.length > 0 && (
						<div className='post_comments'>
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
				</div>
				<CommentInput
					style={{
						position: "sticky",
						width: "100%",
						bottom: "0",
					}}
					user={user}
					postId={post._id}
					setComments={setComments}
					setErrorMsg={setErrorMsg}
				/>
			</div>
		</div>
	);
}

export default ImgModal;
