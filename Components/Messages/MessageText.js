import { useState } from "react";
import { Form, Segment } from "semantic-ui-react";

function MessageText() {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);

	return (
		<Form
			reply
			onSubmit={(e) => {
				e.preventDefault();
			}}>
			<Form.Input
				className='ok'
				autoComplete='off'
				placeholder='Type a message'
				value={text}
				onChange={(e) => setText(e.target.value)}
				action={{
					color: "blue",
					icon: "telegram plane",
					disabled: text.trim() === "" || loading,
					loading,
				}}
			/>
		</Form>
	);
}

export default MessageText;
