import { useState } from "react";
import { Button, Image } from "semantic-ui-react";
import Link from "next/link";
import formatTime from "../../utils/formatTime";
import { unFollowUser, followUser } from "../../utils/profileActions";

function FollowerNotification({
	notification,
	id,
	loggedUserFollowStats,
	setLoggedUserFollowStats,
	setErrorMsg,
	readNotify,
}) {
	const [loading, setLoading] = useState(false);
	const isFollowing =
		loggedUserFollowStats.following.length > 0 &&
		loggedUserFollowStats.following.filter(
			(following) => following.user === notification.user._id
		).length > 0;

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
			<Link href={`/user/${notification.user.username}?tab=profile`}>
				<div style={{ flex: "1", cursor: "pointer" }}>
					<p style={{ color: "var(--primary-text-dark)" }}>
						<strong>{notification.user.name}</strong> started
						following you.
					</p>
					<p>{formatTime(notification.date)}</p>
				</div>
			</Link>
			<div>
				<Button
					size='small'
					compact
					icon={isFollowing ? "check circle" : "add user"}
					color={isFollowing ? "instagram" : "twitter"}
					disabled={loading}
					loading={loading}
					onClick={async () => {
						setLoading(true);
						isFollowing
							? await unFollowUser(
									notification.user._id,
									setLoggedUserFollowStats,
									setErrorMsg
							  )
							: await followUser(
									notification.user._id,
									setLoggedUserFollowStats,
									setErrorMsg
							  );
						setLoading(false);
					}}
				/>
			</div>
		</div>
	);
}

export default FollowerNotification;
