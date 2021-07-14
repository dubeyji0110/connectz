import { useState, useRef } from "react";
import { LocationOn } from "@material-ui/icons";
import { Form, Image, Segment, Icon } from "semantic-ui-react";
import nProgress from "nprogress";
import uploadPic from "../../utils/uploadPicToCloudinary";
import CustomInput from "../Custom/CustomInput";
import { submitNewPost } from "../../utils/postActions";
import CropModal from "../Common/CropModal";

function CreatePost({ user, setPosts, setErrorMsg }) {
	const [newPost, setNewPost] = useState({ text: "", location: "" });
	const [media, setMedia] = useState(null);
	const [imgPreview, setImgPreview] = useState(null);
	const [highlighted, setHighlighted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const inpRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		nProgress.start();
		let picUrl, cloudinaryId;
		if (media !== null) {
			const uploadData = await uploadPic(media);
			picUrl = uploadData.picUrl;
			cloudinaryId = uploadData.cloudinaryId;
			if (!picUrl) {
				setLoading(false);
				nProgress.done();
				return setErrorMsg("Error Uploading Image");
			}
		}
		await submitNewPost(
			newPost.text,
			newPost.location,
			picUrl,
			cloudinaryId,
			setPosts,
			setNewPost,
			setErrorMsg
		);
		setMedia(null);
		URL.revokeObjectURL(imgPreview);
		setHighlighted(false);
		setImgPreview(null);
		setLoading(false);
		nProgress.done();
	};

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "media") {
			setMedia(files[0]);
			setImgPreview(URL.createObjectURL(files[0]));
		}
		setNewPost((prev) => ({ ...prev, [name]: value }));
	};

	const addStyles = () => {
		return {
			marginRight: "10px",
			flex: "3",
			padding: "5px",
			aspectRatio: "1",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			border: "dotted",
			cursor: "pointer",
			borderColor: highlighted ? "green" : "black",
		};
	};

	return (
		<>
			{showModal && (
				<CropModal
					imgPreview={imgPreview}
					setMedia={setMedia}
					setImgPreview={setImgPreview}
					showModal={showModal}
					setShowModal={setShowModal}
					post={true}
				/>
			)}
			<Form
				onSubmit={handleSubmit}
				autoComplete='off'
				style={{ padding: "0 0.5rem" }}>
				<Segment
					style={{
						borderRadius: "15px",
						boxShadow: "1px 1px 2px -1px rgba(0, 0, 0, 0.25)",
					}}>
					<div className='upper_'>
						<Image
							src={user.profilePicUrl}
							avatar
							circular
							inline
							style={{
								marginRight: "10px",
								height: "2.8rem",
								width: "3rem",
							}}
						/>
						<textarea
							style={{
								marginBottom: "10px",
							}}
							placeholder={`What's on your mind, ${
								user.name.split(" ")[0]
							}?`}
							rows={3}
							name='text'
							value={newPost.text}
							onChange={handleChange}
							required
						/>
					</div>
					<div className='lower_'>
						<input
							ref={inpRef}
							onChange={handleChange}
							name='media'
							type='file'
							accept='image/*'
							style={{ display: "none" }}
						/>
						<div
							style={addStyles()}
							onDragOver={(e) => {
								e.preventDefault();
								setHighlighted(true);
							}}
							onDragLeave={(e) => {
								e.preventDefault();
								setHighlighted(false);
							}}
							onDrop={(e) => {
								e.preventDefault();
								setHighlighted(true);
								const droppedFile = Array.from(
									e.dataTransfer.files
								);
								setMedia(droppedFile[0]);
								setImgPreview(
									URL.createObjectURL(droppedFile[0])
								);
							}}>
							{media === null ? (
								<Icon
									name='plus'
									onClick={() => inpRef.current.click()}
									size='big'
									style={{ margin: "0" }}
								/>
							) : (
								<Image
									style={{ height: "100%", width: "100%" }}
									src={imgPreview}
									alt='PostImage'
									centered
									size='medium'
									onClick={() => inpRef.current.click()}
								/>
							)}
						</div>
						<div className='lower_ryt'>
							<CustomInput
								label='Add Location'
								placeholder='Want you add your location?'
								name='location'
								value={newPost.location}
								onChange={handleChange}
								Icon={
									<LocationOn style={{ color: "#4a4a4a" }} />
								}
							/>
							{imgPreview === null && (
								<button
									style={{ marginLeft: "auto" }}
									type='submit'
									className='btnPostSubmit'
									disabled={
										newPost.text.trim() === "" || loading
									}>
									POST
								</button>
							)}
							{imgPreview !== null && (
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}>
									<button
										onClick={() => setShowModal(true)}
										type='button'
										className='btnPostSubmit sp'>
										Crop Image
									</button>
									<button
										type='submit'
										className='btnPostSubmit sp_'
										disabled={
											newPost.text.trim() === "" ||
											loading
										}>
										POST
									</button>
								</div>
							)}
						</div>
					</div>
				</Segment>
			</Form>
		</>
	);
}

export default CreatePost;
