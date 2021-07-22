import { IconButton } from "@material-ui/core";
import { ArrowBackRounded, MoreVertRounded } from "@material-ui/icons";
import { useRouter } from "next/router";
import { Image } from "semantic-ui-react";

function Banner({ bannerData: { name, profilePicUrl } }) {
	const router = useRouter();

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				padding: "0.5rem 1rem",
			}}>
			<div className='lg-hidden'>
				<IconButton>
					<ArrowBackRounded
						style={{ color: "var(--primary-text-light)" }}
						onClick={() => router.push("/messages")}
					/>
				</IconButton>
			</div>
			<div style={{ marginRight: "1rem" }}>
				<Image
					avatar
					style={{ width: "2.5rem", height: "2.5rem" }}
					src={profilePicUrl}
				/>
			</div>
			<div style={{ flex: "1" }}>
				<h4
					style={{
						color: "var(--primary-text-light)",
						fontWeight: "500",
					}}>
					{name}
				</h4>
			</div>
			<IconButton>
				<MoreVertRounded
					style={{ color: "var(--primary-text-light)" }}
				/>
			</IconButton>
		</div>
	);
}

export default Banner;
