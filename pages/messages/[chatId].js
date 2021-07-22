import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import baseUrl from "../../utils/baseUrl";
import getUserInfo from "../../utils/getUserInfo";
import ChatSearch from "../../Components/Chats/ChatSearch";
import { ErrorToastr, SuccessToastr } from "../../Components/Common/Toaster";
import Chat from "../../Components/Chats/Chats";
import { NoChats } from "../../Components/Common/NoData";
import Banner from "../../Components/Messages/Banner";
import { Divider } from "semantic-ui-react";

function ChatPage({ chatsData, user, errorLoading }) {
	const [chats, setChats] = useState(chatsData);
	const [connectedUsers, setConnectedUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [bannerData, setBannerData] = useState({
		name: "",
		profilePicUrl: "",
	});
	const [showToaster, setShowToaster] = useState({ show: false, msg: "" });
	const [errorMsg, setErrorMsg] = useState(null);
	const router = useRouter();
	const socket = useRef();

	useEffect(() => {
		errorMsg !== null && setTimeout(() => setErrorMsg(null), 4000);
	}, [errorMsg]);

	useEffect(() => {
		showToaster.show &&
			setTimeout(() => setShowToaster({ show: false, msg: "" }), 4000);
	}, [showToaster]);

	useEffect(() => {
		if (!socket.current) socket.current = io(baseUrl);
		if (socket.current) {
			socket.current.emit("join", { userId: user._id });
			socket.current.on("connectedUsers", ({ users }) => {
				users.length > 0 && setConnectedUsers(users);
			});
		}
	}, []);

	useEffect(() => {
		const loadMessages = () => {
			socket.current.emit("loadMessages", {
				userId: user._id,
				messagesWith: router.query.chatId,
			});
			socket.current.on("messagesLoaded", ({ chat }) => {
				setMessages(chat.messages);
				setBannerData({
					name: chat.messagesWith.name,
					profilePicUrl: chat.messagesWith.profilePicUrl,
				});
			});
			socket.current.on("noChatFound", async () => {
				const { name, profilePicUrl } = await getUserInfo(
					router.query.chatId
				);
				if (!name || !profilePicUrl) {
					setErrorMsg("Chat Not found");
					router.push("/messages");
					return;
				}
				setBannerData({ name, profilePicUrl });
				setMessages([]);
			});
		};
		if (socket.current) loadMessages();
	}, [router.query.chatId]);

	return (
		<>
			{errorMsg && <ErrorToastr error={errorMsg} />}
			{showToaster.show && <SuccessToastr msg={showToaster.msg} />}
			<div className='messageContainer'>
				<div className='messagePage'>
					<div className='messagePage-left sm-hidden'>
						<ChatSearch
							setErrorMsg={setErrorMsg}
							chats={chats}
							setChats={setChats}
						/>
						<div className='chat-item-wrapper'>
							{errorLoading || chats.length > 0 ? (
								chats.map((chat, i) => (
									<>
										<Chat
											connectedUsers={connectedUsers}
											chat={chat}
											key={i}
										/>
										<Divider
											className='spi'
											style={{
												borderWidth: "0.5px",
												borderColor: "rgba(0,0,0,0.05)",
											}}
										/>
									</>
								))
							) : (
								<NoChats />
							)}
						</div>
					</div>
					<div className='messagePage-right'>
						<div
							style={{
								overflow: "auto",
								overflowX: "hidden",
								maxHeight: "35rem",
								height: "35rem",
								backgroundColor: "whitesmoke",
							}}>
							<>
								<div
									style={{
										position: "sticky",
										top: "0",
										background: "var(--secondary-blue)",
									}}>
									<Banner bannerData={bannerData} />
								</div>
								{/* {messages.length > 0 &&
									messages.map((msg, i) => (
										<Message
											divRef={divRef}
											key={i}
											message={msg}
											user={user}
											bannerProfilePic={
												bannerData.profilePicUrl
											}
											deleteMsg={deleteMessage}
										/>
									))} */}
							</>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

ChatPage.getInitialProps = async (ctx) => {
	try {
		const { token } = parseCookies(ctx);
		const res = await axios.get(`${baseUrl}/api/chats`, {
			headers: { Authorization: token },
		});
		return { chatsData: res.data };
	} catch (error) {
		return { errorLoading: true };
	}
};

export default ChatPage;
