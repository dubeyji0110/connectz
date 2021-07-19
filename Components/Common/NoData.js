import { Image, Segment, Button } from "semantic-ui-react";
import { PersonAddDisabledRounded } from "@material-ui/icons";

export const NoFeed = () => (
	<div
		style={{
			textAlign: "center",
			display: "flex",
			justifyContent: "center",
			flexDirection: "column",
			height: "18.5rem",
		}}>
		<Image
			src='https://res.cloudinary.com/dyekojods/image/upload/v1626336592/noFeed_oo9n6b.jpg'
			style={{
				filter: "contrast(1.5)",
				width: "50%",
				margin: "auto",
				zIndex: "-1",
			}}
		/>
		<div style={{ marginTop: "0.5rem" }}>
			<h4 style={{ fontWeight: "500" }}>Make Sure you follow someone.</h4>
		</div>
	</div>
);

export const NoFollowData = ({ profileName, follower, following }) => (
	<>
		{follower && (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					marginTop: "5rem",
				}}>
				<PersonAddDisabledRounded />
				<p style={{ marginTop: "1.5rem" }}>
					{profileName.split(" ")[0] + " "} does not have followers
				</p>
			</div>
		)}
		{following && (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					marginTop: "5rem",
				}}>
				<PersonAddDisabledRounded />
				<p style={{ marginTop: "1.5rem" }}>
					{profileName.split(" ")[0] + " "} does not follow anyone
				</p>
			</div>
		)}
	</>
);

export const NoUser = () => (
	<Segment
		style={{
			padding: "0",
			borderRadius: "15px",
			boxShadow: "1px 1px 2px -1px rgba(0, 0, 0, 0.25)",
		}}>
		<div className='profile_header'>
			<div className='header_left small-hidden'>
				<Image
					src='https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png'
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
							src='https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png'
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
							<h3>Connectz User</h3>
						</div>
						<div>
							<Button
								size='mini'
								compact
								content='User Not Found'
								icon='dont'
								color='grey'
							/>
						</div>
					</div>
				</div>
				<div className='small-hidden' style={{ display: "flex" }}>
					<p style={{ cursor: "pointer" }}>
						<strong>0</strong>
						Followers
					</p>
					<p style={{ marginLeft: "1rem", cursor: "pointer" }}>
						<strong>0</strong>
						Following
					</p>
				</div>
				<div style={{ marginTop: "0.7rem" }}>
					<p>User doesn't exists</p>
				</div>
			</div>
		</div>
		<div className='small-visible correct'>
			<div
				style={{
					flex: "1",
					textAlign: "center",
					borderRight: "0.5px solid rgba(0,0,0,0.15)",
					cursor: "pointer",
				}}>
				<strong>0</strong>
				<p>Followers</p>
			</div>
			<div
				style={{
					flex: "1",
					textAlign: "center",
					borderLeft: "0.5px solid rgba(0,0,0,0.15)",
					cursor: "pointer",
				}}>
				<strong>0</strong>
				<p>Following</p>
			</div>
		</div>
	</Segment>
);

export const NoNotifications = () => (
	<div
		style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "60vh",
		}}>
		<Image
			style={{ width: "65%", filter: "brightness(0.65) contrast(3.4)" }}
			src='https://res.cloudinary.com/dyekojods/image/upload/v1626684556/noNotifications_tluvjx.jpg'
		/>
	</div>
);
