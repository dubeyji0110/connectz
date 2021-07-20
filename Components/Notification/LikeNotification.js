import { Image } from "semantic-ui-react";
import Link from "next/link";
import formatTime from "../../utils/formatTime";

function LikeNotification({ notification, id, readNotify }) {
	return (
		<div
			key={id}
			onClick={() => readNotify(notification._id)}
			style={{
				display: "flex",
				backgroundColor: notification.unread ? "#def2ffb8" : "initial",
				alignItems: "center",
				borderRadius: "5px",
				padding: "0.5rem",
				margin: "0.15rem 0",
			}}>
			<div>
				<Image
					style={{
						width: "2.5rem",
						height: "2.5rem",
						marginRight: "1rem",
					}}
					avatar
					src={notification.user.profilePicUrl}
				/>
			</div>
			<Link href={`/post/${notification.post._id}`}>
				<div style={{ flex: "1", cursor: "pointer" }}>
					<Link
						href={`/user/${notification.user.username}?tab=profile`}>
						<a style={{ color: "var(--primary-text-dark)" }}>
							<strong>{notification.user.name}</strong>
						</a>
					</Link>{" "}
					liked your post.
					<p>{formatTime(notification.date)}</p>
				</div>
			</Link>
			<div>
				{notification.post.picUrl && (
					<Image
						style={{ width: "3rem" }}
						src={notification.post.picUrl}
					/>
				)}
			</div>
		</div>
	);
}

export default LikeNotification;
