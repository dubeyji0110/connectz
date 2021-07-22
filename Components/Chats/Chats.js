import { Image } from "semantic-ui-react";
import { useRouter } from "next/router";
import formatTime from "../../utils/formatTime";

function Chat({ connectedUsers, chat }) {
	const router = useRouter();
	return (
		<div
			onClick={() =>
				router.push(`/messages/${chat.messagesWith}`, undefined, {
					shallow: true,
				})
			}
			className='chat-item'>
			<div style={{ marginRight: "1rem" }}>
				<Image
					style={{ width: "2.5rem", height: "2.5rem" }}
					avatar
					src={chat.profilePicUrl}
				/>
			</div>
			<div style={{ flex: "1" }}>
				<h4>{chat.name}</h4>
				<p style={{ color: "var(--secondary-text-dark)" }}>
					{chat.lastMessage.length > 20
						? `${chat.lastMessage.substring(0, 20)}...`
						: chat.lastMessage}
				</p>
			</div>
			<div>
				<p
					style={{
						color: "var(--secondary-text-dark)",
						fontSize: "0.8rem",
					}}>
					{formatTime(chat.date)}
				</p>
			</div>
		</div>
	);
}

export default Chat;
