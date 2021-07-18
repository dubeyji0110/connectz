import { Image } from "semantic-ui-react";
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
