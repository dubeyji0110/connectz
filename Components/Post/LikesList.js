import axios from "axios";
import cookie from "js-cookie";
import { useState } from "react";
import Link from "next/link";
import { Popup, List, Image } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchError";
import { LikesPlaceholder } from "../Layouts/PlaceholderGroup";

function LikesList({ postId, trigger, setErrorMsg }) {
	const [likesList, setLikesList] = useState([]);
	const [loading, setLoading] = useState(false);

	const getLikes = async () => {
		setLoading(true);
		try {
			const res = await axios.get(
				`${baseUrl}/api/posts/likes/${postId}`,
				{ headers: { Authorization: cookie.get("token") } }
			);
			setLikesList(res.data);
		} catch (error) {
			setErrorMsg(catchErrors(error));
		}
		setLoading(false);
	};

	return (
		<Popup
			style={{ padding: "0.5rem" }}
			on='click'
			onClose={() => setLikesList([])}
			onOpen={getLikes}
			popperDependencies={[likesList]}
			trigger={trigger}>
			{loading ? (
				<LikesPlaceholder />
			) : (
				<>
					{likesList.length > 0 && (
						<div
							style={{
								overflow: "auto",
								maxHeight: "14rem",
								minWidth: "160px",
							}}>
							<List selection size='small'>
								{likesList.map((like) => (
									<List.Item
										key={like._id}
										style={{
											borderBottom:
												"0.5px solid rgba(0,0,0,0.05)",
										}}>
										<Image
											avatar
											src={like.user.profilePicUrl}
										/>
										<List.Content>
											<Link
												href={`/user/${like.user.username}?tab=profile`}>
												<List.Header
													as='a'
													content={like.user.name}
												/>
											</Link>
										</List.Content>
									</List.Item>
								))}
							</List>
						</div>
					)}
				</>
			)}
		</Popup>
	);
}

export default LikesList;
