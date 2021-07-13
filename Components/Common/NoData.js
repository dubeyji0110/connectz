import { Image } from "semantic-ui-react";
import { PersonAddDisabledRounded } from "@material-ui/icons";

export const NoFeed = () => (
	<div
		style={{
			textAlign: "center",
			display: "flex",
			justifyContent: "center",
			flexDirection: "column",
			height: "50%",
		}}>
		<Image src='/noFeed.jpeg' style={{ filter: "contrast(1.5)" }} />
		<div style={{ marginTop: "1rem" }}>
			<h4 style={{ fontWeight: "400" }}>Make Sure you follow someone.</h4>
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