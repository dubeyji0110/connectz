import axios from "axios";
import { useEffect, useState } from "react";
import cookie from "js-cookie";
import { Button, Image } from "semantic-ui-react";
import Spinner from "../Custom/Spinner";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchError";
import { NoFollowData } from "../Common/NoData";
import { followUser, unFollowUser } from "../../utils/profileActions";
import Link from "next/link";

function Followers({
	user,
	loggedUserFollowStats,
	setLoggedUserFollowStats,
	profile,
	setErrorMsg,
}) {
	const [followers, setFollowers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [followLoading, setFollowLoading] = useState(false);

	useEffect(() => {
		const getFollowers = async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					`${baseUrl}/api/profile/followers/${profile.user._id}`,
					{ headers: { Authorization: cookie.get("token") } }
				);
				setFollowers(res.data);
			} catch (error) {
				setErrorMsg(catchErrors(error));
			}
			setLoading(false);
		};
		getFollowers();
	}, []);

	return (
		<>
			{loading ? (
				<Spinner />
			) : followers.length > 0 ? (
				followers.map((profileFollower) => {
					const isFollowing =
						loggedUserFollowStats.following.length > 0 &&
						loggedUserFollowStats.following.filter(
							(following) =>
								following.user === profileFollower.user._id
						).length > 0;
					return (
						<div
							key={profileFollower.user._id}
							style={{
								display: "flex",
								alignItems: "center",
								marginBottom: "1rem",
							}}>
							<div style={{ flex: "1" }}>
								<Image
									avatar
									src={profileFollower.user.profilePicUrl}
									style={{
										width: "2.5rem",
										height: "2.5rem",
										marginRight: "1rem",
									}}
								/>
								<Link
									href={`/user/${profileFollower.user.username}`}>
									<a>{profileFollower.user.name}</a>
								</Link>
							</div>
							<div>
								{profileFollower.user._id !== user._id && (
                                    <Button
                                        size="mini"
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
														profileFollower.user
															._id,
														setLoggedUserFollowStats,
														setErrorMsg
												  )
												: await followUser(
														profileFollower.user
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
				<NoFollowData profileName={profile.user.name} follower />
			)}
		</>
	);
}

export default Followers;
