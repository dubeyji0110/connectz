import { Image } from "semantic-ui-react";
import { useRouter } from "next/router";
import formatTime from "../../utils/formatTime";

function Chat({ connectedUsers, chat, active }) {
	const router = useRouter();
	const isOnline =
		connectedUsers.length > 0 &&
		connectedUsers.filter((user) => user.userId === chat.messagesWith)
			.length > 0;

	return (
		<div
			onClick={() => router.push(`/messages/${chat.messagesWith}`)}
			className={"chat-item " + (active && "active")}>
			<div style={{ marginRight: "1rem" }}>
				<Image
					style={{ width: "2.5rem", height: "2.5rem" }}
					avatar
					src={chat.profilePicUrl}
				/>
			</div>
			<div style={{ flex: "1" }}>
				<h4 style={{ color: "var(--primary-text-dark)" }}>
					{chat.name}
					{isOnline && <div id='online'></div>}
				</h4>
				<p style={{ color: "var(--secondary-text-dark)" }}>
					{chat.lastMessage.length > 20 && chat.lastMessage.length < 0
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
