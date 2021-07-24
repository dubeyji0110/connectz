import { IconButton } from "@material-ui/core";
import { ArrowBackRounded, MoreVertRounded } from "@material-ui/icons";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Dropdown, Image } from "semantic-ui-react";

function Banner({
	bannerData: { name, profilePicUrl },
	connectedUsers,
	deleteChat,
}) {
	const router = useRouter();
	const isOnline =
		connectedUsers.length > 0 &&
		connectedUsers.filter((user) => user.userId === router.query.chatId)
			.length > 0;

	useEffect(() => {
		document.title = `Messages with ${name}`;
	}, []);

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				padding: "0.5rem 1rem",
				zIndex: "2",
			}}>
			<div className='lg-hidden' onClick={() => router.push("/messages")}>
				<IconButton>
					<ArrowBackRounded
						style={{ color: "var(--primary-text-light)" }}
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
				{isOnline && (
					<p
						style={{
							color: "var(--primary-text-light)",
							fontWeight: "300",
							fontSize: "0.8rem",
							letterSpacing: "0.8px",
						}}>
						online
					</p>
				)}
			</div>
			<Dropdown
				trigger={
					<IconButton>
						<MoreVertRounded
							style={{ color: "var(--primary-text-light)" }}
						/>
					</IconButton>
				}
				item
				icon={false}
				pointing={false}
				direction='left'>
				<Dropdown.Menu
					style={{
						marginTop: "6px",
						padding: "0 0.4rem",
						zIndex: "10",
					}}>
					<Dropdown.Item
						style={{
							padding: "0.8rem 1rem",
							borderBottom: "1px solid rgba(0,0,0,0.09)",
						}}>
						<div
							onClick={() => deleteChat(router.query.chatId)}
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							Clear Conversation
						</div>
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</div>
	);
}

export default Banner;
