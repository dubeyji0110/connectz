import { Image } from "semantic-ui-react";
import formatTime from "../../utils/formatTime";

function Message({ message, user, divRef, deleteMsg, bannerProfilePic }) {
	const ownMsg = message.sender === user._id;
	const mag = ownMsg ? "0 2rem 0 0" : "0 0 0 2rem";

	return (
		<div className={"msgContainer " + (ownMsg && "own")}>
			<div className={"contxd " + (ownMsg && "own")}>
				<Image
					avatar
					alt='Profile Pic'
					style={{ height: "2rem", width: "2rem", marginRight: "0" }}
					src={ownMsg ? user.profilePicUrl : bannerProfilePic}
				/>
				<p className={"message " + (ownMsg && "own")}>{message.msg}</p>
			</div>
			<p
				style={{
					fontSize: "0.8rem",
					color: "var(--secondary-text-dark)",
					margin: mag,
				}}>
				{formatTime(message.date)}
			</p>
		</div>
	);
}

export default Message;
