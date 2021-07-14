import { useEffect, useState } from "react";
import axios from "axios";
import {
	AlternateEmailRounded,
	MailOutlineRounded,
	PersonRounded,
	VisibilityRounded,
	VisibilityOffRounded,
	Done,
	Close,
} from "@material-ui/icons";
import { Form, Divider, Segment, Button, Message } from "semantic-ui-react";
import Link from "next/link";
import SocialInputs from "../Components/Common/SocialInputs";
import CustomInput from "../Components/Custom/CustomInput";
import ImageDrop from "../Components/Custom/ImageDrop";
import baseUrl from "../utils/baseUrl";
import uploadPic from "../utils/uploadPicToCloudinary";
import { registerUser } from "../utils/authUser";
import CropModal from "../Components/Common/CropModal";

function SignUp() {
	const [user, setUser] = useState({
		name: "",
		email: "",
		password: "",
		bio: "",
		github: "",
		twitter: "",
		instagram: "",
		website: "",
	});
	const [username, setUsername] = useState("");
	const [media, setMedia] = useState(null);
	const [usernameAvailable, setUsernameAvailable] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const [showSocialInput, setShowSocialInput] = useState(false);
	const [imgPreview, setImgPreview] = useState(null);
	const [formLoading, setFormLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [errMsg, setErrMsg] = useState(null);

	const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
	let cancel;

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "media") {
			setMedia(files[0]);
			setImgPreview(URL.createObjectURL(files[0]));
		}
		setUser((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormLoading(true);
		let profilePicUrl, cloudinaryId;
		if (media !== null) {
			const uploadData = await uploadPic(media);
			profilePicUrl = uploadData.picUrl;
			cloudinaryId = uploadData.cloudinaryId;
		}
		if (media !== null && !profilePicUrl) {
			setFormLoading(false);
			return setErrMsg("Error Uploading Image");
		}
		await registerUser(user, profilePicUrl, cloudinaryId, setErrMsg);
		setFormLoading(false);
	};

	const checkUsername = async () => {
		try {
			cancel && cancel();
			const CancelToken = axios.CancelToken;
			const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
				cancelToken: new CancelToken((canceler) => {
					cancel = canceler;
				}),
			});
			if (res.data === "Available") {
				setUsernameAvailable(true);
				setUser((prev) => ({ ...prev, username }));
			}
		} catch (error) {
			setUsernameAvailable(false);
			setErrMsg("Username not Available");
		}
	};

	useEffect(() => {
		document.title = "SignUp for Connectz";
		if (errMsg !== null) setTimeout(() => setErrMsg(null), 5000);
	}, [errMsg]);

	useEffect(() => {
		username === "" ? setUsernameAvailable(false) : checkUsername();
	}, [username]);

	useEffect(() => {
		const isUser =
			user.name === "" ||
			user.email === "" ||
			user.password === "" ||
			user.bio === "";
		setSubmitDisabled(isUser);
	}, [user]);

	return (
		<>
			{showModal && (
				<CropModal
					imgPreview={imgPreview}
					setMedia={setMedia}
					setImgPreview={setImgPreview}
					showModal={showModal}
					setShowModal={setShowModal}
					post={false}
				/>
			)}
			<div className='signup_container'>
				<h2 className='heading_signup'>
					CONNECTZ - Online Platform for Introverts
				</h2>
				<Form
					error={errMsg !== null}
					style={{
						maxWidth: "1000px",
						padding: "10px",
						width: "100%",
					}}
					loading={formLoading}
					onSubmit={handleSubmit}>
					<Message
						error
						header='OOPS!'
						content={errMsg}
						onDismiss={() => setErrMsg(null)}
					/>
					<Segment className='responsive_signup'>
						<ImageDrop
							imgPreview={imgPreview}
							setImgPreview={setImgPreview}
							setMedia={setMedia}
							handleChange={handleChange}
						/>
						<div style={{ flex: "1" }}>
							<h4 style={{ textDecoration: "underline" }}>
								Add your Details
							</h4>
							<CustomInput
								type='text'
								placeholder='Name'
								name='name'
								value={user.name}
								onChange={handleChange}
								id='Name'
								label='Name'
								Icon={
									<PersonRounded
										style={{ color: "#4a4a4a" }}
									/>
								}
								required
							/>
							<CustomInput
								type='email'
								placeholder='Email'
								name='email'
								value={user.email}
								onChange={handleChange}
								id='email'
								label='Email'
								Icon={
									<MailOutlineRounded
										style={{ color: "#4a4a4a" }}
									/>
								}
								required
							/>
							<CustomInput
								type={showPassword ? "text" : "password"}
								placeholder='Password'
								name='password'
								value={user.password}
								onChange={handleChange}
								id='password'
								label='Password'
								Icon={
									showPassword ? (
										<VisibilityOffRounded
											style={{
												color: "#4a4a4a",
												cursor: "pointer",
											}}
											onClick={() =>
												setShowPassword(!showPassword)
											}
										/>
									) : (
										<VisibilityRounded
											style={{
												color: "#4a4a4a",
												cursor: "pointer",
											}}
											onClick={() =>
												setShowPassword(!showPassword)
											}
										/>
									)
								}
								required
							/>
							<CustomInput
								type='text'
								placeholder='Username'
								name='username'
								value={username}
								onChange={(e) => {
									setUsername(e.target.value);
									if (regexUserName.test(e.target.value))
										setUsernameAvailable(true);
									else setUsernameAvailable(false);
								}}
								id='username'
								label='Username'
								Icon={
									username === "" ? (
										<AlternateEmailRounded
											style={{ color: "#4a4a4a" }}
										/>
									) : usernameAvailable ? (
										<Done style={{ color: "green" }} />
									) : (
										<Close style={{ color: "red" }} />
									)
								}
								required
							/>
							<div
								style={{
									marginTop: "10px",
									marginBottom: "10px",
								}}>
								<label
									htmlFor='bio'
									style={{
										paddingLeft: "4px",
										fontWeight: "700",
										fontSize: "0.925rem",
									}}>
									Bio:
								</label>
								<textarea
									value={user.bio}
									onChange={handleChange}
									rows={2}
									placeholder='Bio'
									id='bio'
									name='bio'
									required
								/>
							</div>
							<Divider hidden />
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-evenly",
								}}>
								{imgPreview !== null && (
									<Button
										size='small'
										type='button'
										color='green'
										content='Crop Image'
										icon='crop'
										onClick={() => setShowModal(true)}
									/>
								)}
								<Button
									size='small'
									type='button'
									content='Add Social Links'
									icon='at'
									onClick={() =>
										setShowSocialInput(!showSocialInput)
									}
									className='btn-social'
								/>
								<Button
									size='small'
									type='submit'
									content='SignUp'
									icon='signup'
									disabled={
										!usernameAvailable || submitDisabled
									}
									className='btn-submit'
								/>
							</div>
							{showSocialInput && (
								<SocialInputs
									user={user}
									handleChange={handleChange}
								/>
							)}
						</div>
					</Segment>
				</Form>
				<h4 className='footer_signup'>
					Already have Account? <Link href={"/login"}>Login</Link>{" "}
					Instead.
				</h4>
			</div>
		</>
	);
}

export default SignUp;
