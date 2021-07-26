import { useRouter } from "next/router";
import SearchComponent from "../Common/Search";
import SideMenu from "./SideMenu";

function Wrapper({ children, user, notiLen, unreadMsg }) {
	const router = useRouter();

	return (
		<main className='main_container' id='scrollableDiv'>
			{router.pathname === "/messages" ||
			router.pathname === "/messages/[chatId]" ? (
				<>{children}</>
			) : (
				<>
					<aside className='main_options'>
						<SideMenu
							user={user}
							notiLen={notiLen}
							unreadMsg={unreadMsg}
						/>
					</aside>
					<section className='main'>{children}</section>
					<aside className='main_more' id='searchbar'>
						<SearchComponent />
					</aside>
				</>
			)}
		</main>
	);
}

export default Wrapper;
