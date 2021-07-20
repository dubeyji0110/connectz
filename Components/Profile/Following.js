import axios from "axios";
import { useEffect, useState } from "react";
import cookie from "js-cookie";
import { Button, Image } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchError";
import { NoFollowData } from "../Common/NoData";
import Spinner from "../Custom/Spinner";
import { followUser, unFollowUser } from "../../utils/profileActions";
import Link from "next/link";

function Following({
	user,
	loggedUserFollowStats,
	setLoggedUserFollowStats,
	profile,
	setErrorMsg,
}) {
	const [following, setFollowing] = useState([]);
	const [loading, setLoading] = useState(false);
	const [followLoading, setFollowLoading] = useState(false);

	useEffect(() => {
		const getFollowing = async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					`${baseUrl}/api/profile/following/${profile.user._id}`,
					{ headers: { Authorization: cookie.get("token") } }
				);
				setFollowing(res.data);
			} catch (error) {
				setErrorMsg(catchErrors(error));
			}
			setLoading(false);
		};
		getFollowing();
	}, []);

	return (
		<>
			{loading ? (
				<Spinner />
			) : following.length > 0 ? (
				following.map((profileFollowing) => {
					const isFollowing =
						loggedUserFollowStats.following.length > 0 &&
						loggedUserFollowStats.following.filter(
							(following) =>
								following.user === profileFollowing.user._id
						).length > 0;
					return (
						<div
							key={profileFollowing.user._id}
							style={{
								display: "flex",
								alignItems: "center",
								marginBottom: "1rem",
							}}>
							<div style={{ flex: "1" }}>
								<Image
									avatar
									src={profileFollowing.user.profilePicUrl}
									style={{
										width: "2.5rem",
										height: "2.5rem",
										marginRight: "1rem",
									}}
								/>
								<Link
									href={`/user/${profileFollowing.user.username}?tab=profile`}>
									<a>{profileFollowing.user.name}</a>
								</Link>
							</div>
							<div>
								{profileFollowing.user._id !== user._id && (
									<Button
										size='mini'
										color={
											isFollowing
												? "instagram"
												: "twitter"
										}
										content={
											isFollowing ? "Following" : "Follow"
										}
										icon={
											isFollowing ? "check" : "add user"
										}
										disabled={followLoading}
										onClick={async () => {
											setFollowLoading(true);
											isFollowing
												? await unFollowUser(
														profileFollowing.user
															._id,
														setLoggedUserFollowStats,
														setErrorMsg
												  )
												: await followUser(
														profileFollowing.user
															._id,
														setLoggedUserFollowStats,
														setErrorMsg
												  );
											setFollowLoading(false);
										}}
									/>
								)}
							</div>
						</div>
					);
				})
			) : (
				<NoFollowData profileName={profile.user.name} following />
			)}
		</>
	);
}

export default Following;
