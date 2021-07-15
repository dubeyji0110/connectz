import { useEffect, useState } from "react";
import { Search, Image } from "semantic-ui-react";
import { CloseRounded } from "@material-ui/icons";
import axios from "axios";
import cookie from "js-cookie";
import Router from "next/router";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchError";
let cancel;

function SearchComponent() {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState([]);

	const handleChange = async (e) => {
		setLoading(true);
		const { value } = e.target;
		setText(value);
		if (value.trim().length === 0) return setLoading(false);
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
				results.length && setResults([]);
				return setLoading(false);
			}
			setResults(res.data);
		} catch (error) {
			console.error(catchErrors(error));
		}
		setLoading(false);
	};

	useEffect(() => {
		if (text.length === 0 && loading) setLoading(false);
		text.trim().length === 0 && setResults([]);
	}, [text]);

	return (
		<>
			<CloseRounded
				id='cross'
				onClick={() => {
					document
						.getElementById("searchbar")
						.classList.remove("visible");
				}}
			/>
			<Search
				onBlur={() => {
					results.length && setResults([]);
					loading && setLoading(false);
					setText("");
				}}
				loading={loading}
				value={text}
				results={results}
				onSearchChange={handleChange}
				resultRenderer={ResultRenderer}
				onResultSelect={(e, data) =>
					Router.push(`/user/${data.result.username}`)
				}
			/>
		</>
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

export default SearchComponent;
