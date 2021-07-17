import {
	AccountCircleOutlined,
	ChatOutlined,
	ExitToAppRounded,
	HomeRounded,
	NotificationsOutlined,
} from "@material-ui/icons";
import { Dropdown, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";
import ListItem from "../Custom/ListItem";
import { logoutUser } from "../../utils/authUser";

function SideMenu({
	user: { unreadNotification, email, unreadMessage, username },
}) {
	const Router = useRouter();

	return (
		<div className='linkWrapper'>
			<ListItem
				name='Home'
				Icon={<HomeRounded />}
				link='/feed'
				active={Router.pathname === "/feed"}
			/>
			<ListItem
				name='Messages'
				Icon={<ChatOutlined />}
				link='/messages'
				newUpdate={unreadMessage}
				active={Router.pathname === "/messages"}
			/>
			<ListItem
				name='Notifications'
				Icon={<NotificationsOutlined />}
				link='/notifications'
				newUpdate={unreadNotification}
				active={Router.pathname === "/notifications"}
			/>
			<ListItem
				name='Account'
				Icon={<AccountCircleOutlined />}
				className='small-hidden'
				link={`/user/${username}?tab=profile`}
				active={
					"/user/" + Router.query.username === `/user/${username}`
				}
			/>
			<ListItem
				name='Logout'
				Icon={<ExitToAppRounded />}
				className='small-hidden'
				onClick={() => logoutUser(email)}
			/>
			<Dropdown item icon='bars' direction='left' className='hidden'>
				<Dropdown.Menu
					style={{ marginTop: "6px", padding: "0 0.4rem" }}>
					<Dropdown.Item
						style={{
							padding: "0.8rem 1rem",
							borderBottom: "1px solid rgba(0,0,0,0.09)",
						}}
						onClick={() =>
							document
								.getElementById("searchbar")
								.classList.add("visible")
						}>
						<Icon name='search' />
						<strong>Search</strong>
					</Dropdown.Item>
					<Dropdown.Item
						style={{
							padding: "0.8rem 0",
							borderBottom: "1px solid rgba(0,0,0,0.09)",
						}}
						onClick={() =>
							Router.push(`/user/${username}?tab=profile`)
						}>
						<Icon name='user circle outline' />
						<strong>Account</strong>
					</Dropdown.Item>
					<Dropdown.Item
						style={{
							padding: "0.8rem 0",
							borderBottom: "1px solid rgba(0,0,0,0.09)",
						}}
						onClick={() =>
							Router.push(`/user/${username}?tab=settings`)
						}>
						<Icon name='setting' />
						<strong>Settings</strong>
					</Dropdown.Item>
					<Dropdown.Item
						style={{ padding: "0.8rem 1rem" }}
						onClick={() => logoutUser(email)}>
						<Icon name='log out' />
						<strong>Logout</strong>
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</div>
	);
}

export default SideMenu;
