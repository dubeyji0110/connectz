import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";
import "cropperjs/dist/cropper.css";
import { parseCookies, destroyCookie } from "nookies";
import nProgress from "nprogress";
import Router from "next/router";
import HeadTag from "../Components/Layouts/HeadTag";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { redirectUser } from "../utils/authUser";
import Wrapper from "../Components/Layouts/Wrapper";

function MyApp({ Component, pageProps }) {
	Router.onRouteChangeStart = () => nProgress.start();
	Router.onRouteChangeComplete = () => nProgress.done();
	Router.onRouteChangeError = () => nProgress.done();

	return (
		<>
			<HeadTag />
			{pageProps.user ? (
				<Wrapper user={pageProps.user} notiLen={pageProps.notiLen}>
					<Component {...pageProps} />
				</Wrapper>
			) : (
				<Component {...pageProps} />
			)}
		</>
	);
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
	const { token } = parseCookies(ctx);
	let pageProps = {};
	const protectedRoutes =
		ctx.pathname === "/feed" ||
		ctx.pathname === "/user/[username]" ||
		ctx.pathname === "/notifications";
	if (!token) protectedRoutes && redirectUser(ctx, "/login");
	else {
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}
		try {
			const res = await axios.get(`${baseUrl}/api/auth`, {
				headers: { Authorization: token },
			});
			const res1 = await axios.get(
				`${baseUrl}/api/notifications/unreadNo`,
				{
					headers: { Authorization: token },
				}
			);
			const { user, userFollowStats } = res.data;
			if (user) !protectedRoutes && redirectUser(ctx, "/feed");
			pageProps.user = user;
			pageProps.userFollowStats = userFollowStats;
			pageProps.notiLen = res1.data;
		} catch (error) {
			destroyCookie(ctx, "token");
			redirectUser(ctx, "/login");
		}
	}
	return { pageProps };
};

export default MyApp;
