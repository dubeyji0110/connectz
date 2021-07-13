import { useState } from "react";
import { Form } from "semantic-ui-react";
import { postComment } from "../../utils/postActions";

function CommentInput({ user, postId, setComments, style, setErrorMsg }) {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);

	return (
		<Form
			style={{ marginTop: "10px", ...style }}
			reply
			autoComplete='off'
			onSubmit={async (e) => {
				e.preventDefault();
				setLoading(true);
				await postComment(
					postId,
					user,
					text,
					setComments,
					setText,
					setErrorMsg
				);
				setLoading(false);
			}}>
			<Form.Input
				autoComplete='off'
				id={postId}
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder='Add Comment'
				action={{
					color: "blue",
					icon: "edit",
					loading,
					disabled: text.trim() === "" || loading,
				}}
			/>
		</Form>
	);
}

export default CommentInput;
