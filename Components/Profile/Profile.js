import { Segment, Image, Button } from "semantic-ui-react";
import {
	AlternateEmailRounded,
	Instagram,
	Twitter,
	GitHub,
	LanguageRounded,
} from "@material-ui/icons";
import { useRouter } from "next/router";
import { useState } from "react";
import { unFollowUser, followUser } from "../../utils/profileActions";

function Profile({
	profile,
	owner,
	loggedUserFollowStats,
	setLoggedUserFollowStats,
	followersLength,
	followingLength,
	setErrorMsg,
}) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const isFollowing =
		loggedUserFollowStats.following.length > 0 &&
		loggedUserFollowStats.following.filter(
			(following) =>
				following.user.toString() === profile.user._id.toString()
		).length > 0;

	const followAction = async () => {
		setLoading(true);
		isFollowing
			? await unFollowUser(
					profile.user._id,
					setLoggedUserFollowStats,
					setErrorMsg
			  )
			: await followUser(
					profile.user._id,
					setLoggedUserFollowStats,
					setErrorMsg
			  );
		setLoading(false);
	};

	return (
		<Segment
			style={{
				padding: "0",
				borderRadius: "15px",
				boxShadow: "1px 1px 2px -1px rgba(0, 0, 0, 0.25)",
			}}>
			<div className='profile_header'>
				<div className='header_left small-hidden'>
					<Image
						src={profile.user.profilePicUrl}
						style={{
							width: "11rem",
							height: "11rem",
							borderRadius: "50%",
						}}
					/>
				</div>
				<div className='header_right'>
					<div style={{ display: "flex" }}>
						<div className='small-visible'>
							<Image
								src={profile.user.profilePicUrl}
								style={{
									width: "5rem",
									height: "5rem",
									borderRadius: "50%",
								}}
							/>
						</div>
						<div
							style={{
								margin: "0.7rem 0",
								flex: "1",
								display: "flex",
							}}>
							<div style={{ flex: "1" }}>
								<h3>{profile.user.name}</h3>
								<p
									style={{
										fontWeight: "300",
										display: "flex",
										alignItems: "center",
									}}>
									<AlternateEmailRounded
										style={{ width: "1rem" }}
									/>
									{" " + profile.user.username}
								</p>
							</div>
							{!owner && (
								<div>
									<Button
										size='mini'
										compact
										loading={loading}
										disabled={loading}
										content={
											isFollowing ? "Following" : "Follow"
										}
										icon={
											isFollowing
												? "check circle"
												: "add user"
										}
										color={
											isFollowing
												? "instagram"
												: "twitter"
										}
										onClick={followAction}
									/>
								</div>
							)}
						</div>
					</div>
					<div className='small-hidden' style={{ display: "flex" }}>
						<p
							onClick={() => router.push("?tab=followers")}
							style={{ cursor: "pointer" }}>
							<strong>{followersLength + " "}</strong>
							Followers
						</p>
						<p
							onClick={() => router.push("?tab=following")}
							style={{ marginLeft: "1rem", cursor: "pointer" }}>
							<strong>{followingLength + " "}</strong>
							Following
						</p>
					</div>
					<div style={{ marginTop: "0.7rem" }}>
						<p>{profile.bio}</p>
						{profile.social && (
							<div
								style={{
									marginTop: "0.7rem",
									display: "flex",
								}}>
								{(profile.social.instagram ||
									profile.social.twitter) && (
									<div
										style={{
											flex: "1",
											display: "flex",
											flexDirection: "column",
										}}>
										{profile.social.instagram && (
											<p
												style={{
													display: "flex",
													alignItems: "center",
												}}>
												<Instagram
													style={{
														fontSize:
															"1rem !important",
														marginRight: "2px",
														marginBottom: "0.2rem",
													}}
												/>
												<a
													target='_blank'
													className='social_link'
													href={`https://instagram.com/${profile.social.instagram}`}>
													{profile.social.instagram}
												</a>
											</p>
										)}
										{profile.social.twitter && (
											<p
												style={{
													display: "flex",
													alignItems: "center",
												}}>
												<Twitter
													style={{
														fontSize:
															"1rem !important",
														marginRight: "2px",
														marginBottom: "0.2rem",
													}}
												/>
												<a
													target='_blank'
													className='social_link'
													href={`https://twitter.com/${profile.social.twitter}`}>
													{profile.social.twitter}
												</a>
											</p>
										)}
									</div>
								)}
								{(profile.social.website ||
									profile.social.github) && (
									<div
										style={{
											flex: "1",
											display: "flex",
											flexDirection: "column",
										}}>
										{profile.social.github && (
											<p
												style={{
													display: "flex",
													alignItems: "center",
												}}>
												<GitHub
													style={{
														fontSize:
															"1rem !important",
														marginRight: "2px",
														marginBottom: "0.2rem",
													}}
												/>
												<a
													target='_blank'
													className='social_link'
													href={`https://github.com/${profile.social.github}`}>
													{profile.social.github}
												</a>
											</p>
										)}
										{profile.social.website && (
											<p
												style={{
													display: "flex",
													alignItems: "center",
												}}>
												<LanguageRounded
													style={{
														fontSize:
															"1rem !important",
														marginRight: "2px",
														marginBottom: "0.2rem",
													}}
												/>
												<a
													target='_blank'
													className='social_link'
													href={`${profile.social.website}`}>
													{profile.social.website}
												</a>
											</p>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
			<div className='small-visible correct'>
				<div
					onClick={() => router.push("?tab=followers")}
					style={{
						flex: "1",
						textAlign: "center",
						borderRight: "0.5px solid rgba(0,0,0,0.15)",
						cursor: "pointer",
					}}>
					<strong>{followersLength}</strong>
					<p>Followers</p>
				</div>
				<div
					onClick={() => router.push("?tab=following")}
					style={{
						flex: "1",
						textAlign: "center",
						borderLeft: "0.5px solid rgba(0,0,0,0.15)",
						cursor: "pointer",
					}}>
					<strong>{followingLength}</strong>
					<p>Following</p>
				</div>
			</div>
		</Segment>
	);
}

export default Profile;
