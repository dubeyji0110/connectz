import axios from "axios";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { parseCookies } from "nookies";
import { Divider, Image } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import ChatSearch from "../../Components/Chats/ChatSearch";
import { NoChats } from "../../Components/Common/NoData";
import Chat from "../../Components/Chats/Chats";
import { ErrorToastr, SuccessToastr } from "../../Components/Common/Toaster";

function Messages({ chatsData, user, errorLoading }) {
	const [chats, setChats] = useState(chatsData);
	const [connectedUsers, setConnectedUsers] = useState([]);
	const [showToaster, setShowToaster] = useState({ show: false, msg: "" });
	const [errorMsg, setErrorMsg] = useState(null);
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

	return (
		<>
			{errorMsg && <ErrorToastr error={errorMsg} />}
			{showToaster.show && <SuccessToastr msg={showToaster.msg} />}
			<div style={{ width: "100%" }}>
				<div className='messagePage'>
					<div className='messagePage-left'>
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
					<div
						className='messagePage-right sm-hidden'
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
						}}>
						<Image src='https://web.whatsapp.com/img/intro-connection-light_c98cc75f2aa905314d74375a975d2cf2.jpg' />
						<h3
							style={{
								marginTop: "2.5rem",
								fontWeight: "300",
								color: "grey",
							}}>
							Select or Search a User to message
						</h3>
					</div>
				</div>
			</div>
		</>
	);
}

Messages.getInitialProps = async (ctx) => {
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

export default Messages;
