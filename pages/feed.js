import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import CreatePost from "../Components/Post/CreatePost";
import baseUrl from "../utils/baseUrl";
import CardPost from "../Components/Post/CardPost";
import { ErrorToastr, SuccessToastr } from "../Components/Common/Toaster";
import { NoFeed } from "../Components/Common/NoData";
import {
	EndMessage,
	PlaceholderPosts,
} from "../Components/Layouts/PlaceholderGroup";

function Feed({ user, postsData, errorLoading }) {
	const [posts, setPosts] = useState(postsData || []);
	const [errorMsg, setErrorMsg] = useState(null);
	const [showToaster, setShowToaster] = useState({ show: false, msg: "" });
	const [pgNo, setPgNo] = useState(2);
	const [hasMore, setHasMore] = useState(true);

	const fetchDataOnScroll = async () => {
		try {
			const res = await axios.get(`${baseUrl}/api/posts`, {
				headers: { Authorization: cookie.get("token") },
				params: { pageNumber: pgNo },
			});
			if (res.data.length === 0) setHasMore(false);
			setPosts((prev) => [...prev, ...res.data]);
			setPgNo((prev) => prev + 1);
		} catch (error) {
			console.error(error);
			setErrorMsg("Error fetching Posts");
		}
	};

	useEffect(() => {
		document.title = `Welcome!, ${user.name.split(" ")[0]}`;
	}, []);

	useEffect(() => {
		errorMsg !== null && setTimeout(() => setErrorMsg(null), 4000);
	}, [errorMsg]);

	useEffect(() => {
		showToaster.show &&
			setTimeout(() => setShowToaster({ show: false, msg: "" }), 4000);
	}, [showToaster]);

	return (
		<>
			{errorMsg && <ErrorToastr error={errorMsg} />}
			{showToaster.show && <SuccessToastr msg={showToaster.msg} />}
			<CreatePost
				user={user}
				setPosts={setPosts}
				setErrorMsg={setErrorMsg}
			/>
			{errorLoading || posts.length === 0 ? (
				<NoFeed />
			) : (
				<InfiniteScroll
					style={{ padding: "0.5rem", margin: "1rem 0" }}
					hasMore={hasMore}
					scrollableTarget='scrollableDiv'
					next={fetchDataOnScroll}
					loader={<PlaceholderPosts />}
					endMessage={<EndMessage />}
					dataLength={posts.length}>
					{posts.map((post) => (
						<CardPost
							key={post._id}
							user={user}
							post={post}
							setPosts={setPosts}
							setErrorMsg={setErrorMsg}
							setShowToaster={setShowToaster}
						/>
					))}
				</InfiniteScroll>
			)}
		</>
	);
}

Feed.getInitialProps = async (ctx) => {
	try {
		const { token } = parseCookies(ctx);
		const res = await axios.get(`${baseUrl}/api/posts`, {
			headers: { Authorization: token },
			params: { pageNumber: 1 },
		});
		return { postsData: res.data };
	} catch (error) {
		return { errorLoading: true };
	}
};

export default Feed;
