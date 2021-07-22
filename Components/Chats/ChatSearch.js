import { useEffect, useState } from "react";
import { ArrowBackRounded } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { Search, Image } from "semantic-ui-react";
import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "../../utils/baseUrl";
let cancel;

function ChatSearch({ setErrorMsg, chats, setChats }) {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState([]);
	const router = useRouter();

	const handleChange = async (e) => {
		setLoading(true);
		const { value } = e.target;
		setText(value);
		if (value.trim().length === 0) return;
		try {
			cancel && cancel();
			const CancelToken = axios.CancelToken;
			const token = cookie.get("token");
			const res = await axios.get(`${baseUrl}/api/search/${value}`, {
				headers: { Authorization: token },
				cancelToken: new CancelToken((canceler) => {
					cancel = canceler;
				}),
			});
			if (res.data.length === 0) {
				results.length > 0 && setResults([]);
				return setLoading(false);
			}
			setResults(res.data);
		} catch (error) {
			console.error(error);
			// setErrorMsg("Error Searching");
		}
		setLoading(false);
	};

	const addChat = (result) => {
		const inChat =
			chats.length > 0 &&
			chats.filter((chat) => chat.messagesWith === result._id).length > 0;
		if (!inChat) {
			const newChat = {
				messagesWith: result._id,
				name: result.name,
				profilePicUrl: result.profilePicUrl,
				lastMessage: "",
				date: Date.now(),
			};
			setChats((prev) => [newChat, ...prev]);
		}
		router.push(`/messages/${result._id}`);
	};

	useEffect(() => {
		if (text.length === 0 && loading) setLoading(false);
	}, [text]);

	return (
		<div className='search__'>
			<IconButton>
				<ArrowBackRounded
					style={{ color: "var(--primary-text-light)" }}
					onClick={() => router.push("/feed")}
				/>
			</IconButton>
			<Search
				style={{ flex: "1" }}
				onBlur={() => {
					results.length && setResults([]);
					loading && setLoading(false);
					setText("");
				}}
				loading={loading}
				value={text}
				resultRenderer={ResultRenderer}
				results={results}
				onSearchChange={handleChange}
				minCharacters={1}
				onResultSelect={(e, data) => addChat(data.result)}
			/>
		</div>
	);
}

const ResultRenderer = ({ _id, name, profilePicUrl }) => {
	return (
		<div
			key={_id}
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
			}}>
			<h2 style={{ fontSize: "1rem" }}>{name}</h2>
			<Image
				src={profilePicUrl}
				avatar
				alt='ProfilePic'
				style={{ width: "2rem", height: "2rem" }}
			/>
		</div>
	);
};

export default ChatSearch;
