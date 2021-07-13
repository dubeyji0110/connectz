import { Image } from "semantic-ui-react";
import { DeleteRounded } from "@material-ui/icons";
import Link from "next/link";
import formatTime from "../../utils/formatTime";
import { deleteComment } from "../../utils/postActions";

function PostComment({
	comment,
	postId,
	user,
	setComments,
	setErrorMsg,
	setShowToaster,
}) {
	return (
		<div className='post_comment'>
			<div>
				<Image
					src={comment.user.profilePicUrl}
					style={{
						width: "2rem",
						height: "2rem",
						borderRadius: "999rem",
					}}
				/>
			</div>
			<div className='comment-container'>
				<div className='comment_details'>
					<Link href={`/user/${comment.user.username}`}>
						<a>{comment.user.name}</a>
					</Link>
					<p className='textlight' style={{ marginLeft: "5px" }}>
						{formatTime(comment.date)}
					</p>
				</div>
				<p className='commentText'>{comment.text}</p>
			</div>
			{(user.role === "root" || comment.user._id === user._id) && (
				<DeleteRounded
					onClick={async () =>
						await deleteComment(
							postId,
							comment._id,
							setComments,
							setErrorMsg,
							setShowToaster
						)
					}
				/>
			)}
		</div>
	);
}

export default PostComment;
