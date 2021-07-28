import { useState, useEffect, useRef } from "react";
import axios from "axios";
import cookie from "js-cookie";
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
import Message from "../../Components/Messages/Message";
import MessageText from "../../Components/Messages/MessageText";

const scrollDivToBottom = (divRef) => {
	divRef.current !== null &&
		divRef.current.scrollIntoView({ behaviour: "smooth" });
};

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
	const divRef = useRef();
	const chatId = useRef("");

	const sendMessage = (msg) => {
		if (socket.current) {
			socket.current.emit("sendNewMsg", {
				userId: user._id,
				msgSendToUserId: chatId.current,
				msg,
			});
		}
	};

	const deleteMessage = (msgId) => {
		if (socket.current) {
			socket.current.emit("deleteMsg", {
				userId: user._id,
				messagesWith: chatId.current,
				msgId,
			});
			socket.current.on("msgDeleted", () => {
				!showToaster.show &&
					setShowToaster({ show: true, msg: "Message Deleted" });
				setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
			});
			socket.current.on(
				"ErrorDeleteMsg",
				() => !errorMsg && setErrorMsg("Error Deleting Message")
			);
		}
	};

	const deleteChat = async (messagesWith) => {
		try {
			await axios.delete(`${baseUrl}/api/chats/${messagesWith}`, {
				headers: { Authorization: cookie.get("token") },
			});
			setChats((prev) =>
				prev.filter((chat) => chat.messagesWith !== messagesWith)
			);
			router.push("/messages");
		} catch (error) {
			console.error(error);
			setErrorMsg("Error Deleting Chat");
		}
	};

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
		const markRead = async () => {
			if (chatId) {
				await axios.post(
					`${baseUrl}/api/chats/readchat/${chatId.current}`,
					{},
					{ headers: { Authorization: cookie.get("token") } }
				);
			}
		};
		return () => markRead();
	}, [chatId]);

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
				chatId.current = chat.messagesWith._id;
				divRef.current && scrollDivToBottom(divRef);
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
				chatId.current = router.query.chatId;
			});
		};
		if (socket.current) loadMessages();
	}, [router.query.chatId]);

	useEffect(() => {
		if (socket.current) {
			socket.current.on("msgNotSent", () =>
				setErrorMsg("Error Send Message")
			);
			socket.current.on("msgSent", ({ newMsg }) => {
				if (newMsg.receiver === chatId.current) {
					setMessages((prev) => [...prev, newMsg]);
					setChats((prev) => {
						const prevChat = prev.find(
							(chat) => chat.messagesWith === newMsg.receiver
						);
						prevChat.lastMessage = newMsg.msg;
						prevChat.date = newMsg.date;
						return [...prev];
					});
				}
			});
			socket.current.on("newMsgReceived", async ({ newMsg }) => {
				let sender;
				if (newMsg.sender === chatId.current) {
					setMessages((prev) => [...prev, newMsg]);
					setChats((prev) => {
						const prevChat = prev.find(
							(chat) => chat.messagesWith === newMsg.sender
						);
						prevChat.lastMessage = newMsg.msg;
						prevChat.date = newMsg.date;
						sender = prevChat.name;
						return [...prev];
					});
				} else {
					const ifPrevMsg =
						chats.filter(
							(chat) => chat.messagesWith === newMsg.sender
						).length > 0;
					if (ifPrevMsg) {
						setChats((prev) => {
							const prevChat = prev.find(
								(chat) => chat.messagesWith === newMsg.sender
							);
							prevChat.lastMessage = newMsg.msg;
							prevChat.date = newMsg.date;
							sender = prevChat.name;
							return [...prev];
						});
					} else {
						const { name, profilePicUrl } = await getUserInfo(
							newMsg.sender
						);
						sender = name;
						const newChat = {
							messagesWith: newMsg.sender,
							name,
							profilePicUrl,
							lastMessage: newMsg.msg,
							date: newMsg.date,
						};
						setChats((prev) => [newChat, ...prev]);
					}
				}
			});
		}
	}, []);

	useEffect(() => {
		if (messages.length > 0) scrollDivToBottom(divRef);
	}, [messages]);

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
							<Divider className='spt' hidden />
							{errorLoading || chats.length > 0 ? (
								chats.map((chat, i) => (
									<>
										<Chat
											connectedUsers={connectedUsers}
											chat={chat}
											key={i}
											active={
												router.query.chatId ===
												chat.messagesWith
											}
										/>
										<Divider
											className='spt'
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
								display: "flex",
								flex: "1",
								flexDirection: "column",
								backgroundColor: "whitesmoke",
							}}>
							<>
								<div
									style={{
										position: "sticky",
										top: "0",
										background: "var(--secondary-blue)",
									}}>
									<Banner
										deleteChat={deleteChat}
										connectedUsers={connectedUsers}
										bannerData={bannerData}
									/>
								</div>
								<div className='chat-container'>
									{messages.length > 0 &&
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
										))}
								</div>
								<div
									style={{
										position: "sticky",
										bottom: "0",
									}}>
									<MessageText sendMsg={sendMessage} />
								</div>
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
