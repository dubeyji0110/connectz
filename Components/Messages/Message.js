import { useState } from "react";
import { Image } from "semantic-ui-react";
import { DeleteRounded } from "@material-ui/icons";
import formatTime from "../../utils/formatTime";

function Message({ message, user, divRef, deleteMsg, bannerProfilePic }) {
	const [deleteIcon, showDeleteIcon] = useState(false);
	const ownMsg = message.sender === user._id;
	const mag = ownMsg ? "0 2rem 0 0" : "0 0 0 2rem";

	return (
		<div
			className={"msgContainer " + (ownMsg && "own")}
			ref={divRef}
			onDoubleClick={() => ownMsg && showDeleteIcon(true)}>
			<div className={"contxd " + (ownMsg && "own")}>
				<Image
					avatar
					alt='Profile Pic'
					style={{ height: "2rem", width: "2rem", marginRight: "0" }}
					src={ownMsg ? user.profilePicUrl : bannerProfilePic}
				/>
				<p className={"message " + (ownMsg && "own")}>{message.msg}</p>
				{deleteIcon && (
					<div onClick={() => deleteMsg(message._id)}>
						<DeleteRounded
							style={{
								color: "red",
								cursor: "pointer",
								fontSize: "1rem",
							}}
						/>
					</div>
				)}
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
