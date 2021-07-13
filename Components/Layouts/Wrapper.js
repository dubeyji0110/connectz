import SearchComponent from "../Common/Search";
import SideMenu from "./SideMenu";

function Wrapper({ children, user }) {
	return (
		<main className='main_container' id='scrollableDiv'>
			<aside className='main_options'>
				<SideMenu user={user} />
			</aside>
			<section className='main'>{children}</section>
			<aside className='main_more' id='searchbar'>
				<SearchComponent />
			</aside>
		</main>
	);
}

export default Wrapper;
