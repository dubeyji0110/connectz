import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import { Divider, Image } from "semantic-ui-react";
import baseUrl from "../../../utils/baseUrl";
import { ErrorToastr, SuccessToastr } from "../../../Components/Common/Toaster";
import MenuTabs from "../../../Components/Profile/MenuTabs";
import Profile from "../../../Components/Profile/Profile";
import { PlaceholderPosts } from "../../../Components/Layouts/PlaceholderGroup";
import CardPost from "../../../Components/Post/CardPost";
import catchErrors from "../../../utils/catchError";
import Followers from "../../../Components/Profile/Followers";
import Following from "../../../Components/Profile/Following";
import Settings from "../../../Components/Profile/Settings";
import UpdateProfile from "../../../Components/Profile/UpdateProfile";
import { NoUser } from "../../../Components/Common/NoData";

function ProfilePage({
	user,
	userFollowStats,
	profile,
	followersLength,
	followingLength,
	errorLoading,
}) {
	if (errorLoading) return <NoUser />;

	const [posts, setPosts] = useState([]);
	const [loggedUserFollowStats, setLoggedUserFollowStats] =
		useState(userFollowStats);
	const [loading, setLoading] = useState(false);
	const [showToaster, setShowToaster] = useState({ show: false, msg: "" });
	const [errorMsg, setErrorMsg] = useState(null);
	const [activeTab, setActiveTab] = useState("profile");
	const owner = profile.user._id === user._id;
	const router = useRouter();

	useEffect(() => {
		document.title = `${profile.user.name} @${profile.user.username}`;
	}, []);

	useEffect(() => {
		errorMsg !== null && setTimeout(() => setErrorMsg(null), 4000);
	}, [errorMsg]);

	useEffect(() => {
		showToaster.show &&
			setTimeout(() => setShowToaster({ show: false, msg: "" }), 4000);
	}, [showToaster]);

	useEffect(() => {
		if (
			(!owner &&
				(router.query.tab === "settings" ||
					router.query.tab === "update_profile")) ||
			!router.query.tab
		)
			router.push("?tab=profile");
		router.query.tab && setActiveTab(router.query.tab);
	}, [router.query]);

	useEffect(() => {
		const getPosts = async () => {
			setLoading(true);
			try {
				const { username } = router.query;
				const res = await axios.get(
					`${baseUrl}/api/profile/posts/${username}`,
					{ headers: { Authorization: cookie.get("token") } }
				);
				setPosts(res.data);
			} catch (error) {
				setErrorMsg(catchErrors(error));
			}
			setLoading(false);
		};
		getPosts();
	}, [router.query.username]);

	return (
		<>
			{errorMsg && <ErrorToastr error={errorMsg} />}
			{showToaster.show && <SuccessToastr msg={showToaster.msg} />}
			<div className='profile_wrapper'>
				<MenuTabs active={activeTab} owner={owner} />
				{activeTab === "profile" && (
					<>
						<Profile
							setErrorMsg={setErrorMsg}
							profile={profile}
							owner={owner}
							loggedUserFollowStats={loggedUserFollowStats}
							setLoggedUserFollowStats={setLoggedUserFollowStats}
							followersLength={followersLength}
							followingLength={followingLength}
						/>
						<Divider hidden />
						{loading ? (
							<PlaceholderPosts />
						) : posts.length > 0 ? (
							posts.map((post) => (
								<CardPost
									key={post._id}
									user={user}
									post={post}
									setPosts={setPosts}
									setErrorMsg={setErrorMsg}
									setShowToaster={setShowToaster}
								/>
							))
						) : (
							<Image
								alt='No Post Yet'
								src='https://res.cloudinary.com/dyekojods/image/upload/v1626336593/noPost_vhvsrh.jpg'
								style={{
									filter: "contrast(1.5)",
									transform: "scale(0.7)",
								}}
							/>
						)}
						<Divider hidden />
					</>
				)}
				{activeTab === "followers" && (
					<Followers
						user={user}
						loggedUserFollowStats={loggedUserFollowStats}
						setLoggedUserFollowStats={setLoggedUserFollowStats}
						profile={profile}
						setErrorMsg={setErrorMsg}
					/>
				)}
				{activeTab === "following" && (
					<Following
						user={user}
						loggedUserFollowStats={loggedUserFollowStats}
						setLoggedUserFollowStats={setLoggedUserFollowStats}
						profile={profile}
						setErrorMsg={setErrorMsg}
					/>
				)}
				{owner && activeTab === "update_profile" && (
					<UpdateProfile
						Profile={profile}
						setErrorMsg={setErrorMsg}
						setShowToaster={setShowToaster}
					/>
				)}
				{owner && activeTab === "settings" && (
					<Settings
						newMessagePopup={user.newMessagePopup}
						setErrorMsg={setErrorMsg}
						setShowToaster={setShowToaster}
					/>
				)}
			</div>
		</>
	);
}

ProfilePage.getInitialProps = async (ctx) => {
	try {
		const { username } = ctx.query;
		const { token } = parseCookies(ctx);
		const res = await axios.get(`${baseUrl}/api/profile/${username}`, {
			headers: { Authorization: token },
		});
		const { profile, followersLength, followingLength } = res.data;
		return { profile, followersLength, followingLength };
	} catch (error) {
		return { errorLoading: true };
	}
};

export default ProfilePage;
