import axios from "axios";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import { Divider } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { NoNotifications } from "../Components/Common/NoData";
import { ErrorToastr } from "../Components/Common/Toaster";
import CommentNotification from "../Components/Notification/CommentNotification";
import FollowerNotification from "../Components/Notification/FollowerNotification";
import LikeNotification from "../Components/Notification/LikeNotification";
import baseUrl from "../utils/baseUrl";

function Notifications({ notifications, errorLoading, user, userFollowStats }) {
	if (errorLoading || notifications.length < 1) return <NoNotifications />;

	const [loggedUserFollowStats, setLoggedUserFollowStats] =
		useState(userFollowStats);
	const [errorMsg, setErrorMsg] = useState(null);

	const readNotify = async (notifyId) => {
		try {
			await axios.post(
				`${baseUrl}/api/notifications/${notifyId}`,
				{},
				{ headers: { Authorization: cookie.get("token") } }
			);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		document.title = "Notifications";
		const readNotifications = async () => {
			try {
				await axios.post(
					`${baseUrl}/api/notifications`,
					{},
					{ headers: { Authorization: cookie.get("token") } }
				);
			} catch (error) {
				console.error(error);
			}
		};
		readNotifications();
	}, []);

	useEffect(() => {
		errorMsg !== null && setTimeout(() => setErrorMsg(null), 4000);
	}, [errorMsg]);

	return (
		<>
			{errorMsg && <ErrorToastr error={errorMsg} />}
			<div className='notifications_container'>
				{notifications.length > 0 && (
					<div className='notifications'>
						{notifications.map((notification) => (
							<>
								{notification.type === "newLike" &&
									notification.post !== null && (
										<LikeNotification
											readNotify={readNotify}
											id={notification._id}
											notification={notification}
										/>
									)}
								{notification.type === "newComment" &&
									notification.post !== null && (
										<CommentNotification
											readNotify={readNotify}
											id={notification._id}
											notification={notification}
										/>
									)}
								{notification.type === "newFollower" && (
									<FollowerNotification
										readNotify={readNotify}
										id={notification._id}
										notification={notification}
										loggedUserFollowStats={
											loggedUserFollowStats
										}
										setLoggedUserFollowStats={
											setLoggedUserFollowStats
										}
										setErrorMsg={setErrorMsg}
									/>
								)}
								<Divider
									style={{
										borderWidth: "0.5px",
										borderColor: "rgba(0,0,0,0.05)",
										margin: "0 !important",
									}}
								/>
							</>
						))}
					</div>
				)}
			</div>
		</>
	);
}

Notifications.getInitialProps = async (ctx) => {
	try {
		const { token } = parseCookies(ctx);
		const res = await axios.get(`${baseUrl}/api/notifications`, {
			headers: { Authorization: token },
		});
		return { notifications: res.data };
	} catch (error) {
		return { errorLoading: true };
	}
};

export default Notifications;
