import { useState } from "react";
import { Form, Button, Divider } from "semantic-ui-react";
import { profileUpdate } from "../../utils/profileActions";
import uploadPic from "../../utils/uploadPicToCloudinary";
import CropModal from "../Common/CropModal";
import SocialInputs from "../Common/SocialInputs";
import ImageDrop from "../Custom/ImageDrop";

function UpdateProfile({ Profile, setErrorMsg, setShowToaster }) {
	const [profile, setProfile] = useState({
		profilePicUrl: Profile.user.profilePicUrl,
		bio: Profile.bio,
		github: (Profile.social && Profile.social.github) || "",
		instagram: (Profile.social && Profile.social.instagram) || "",
		twitter: (Profile.social && Profile.social.twitter) || "",
		website: (Profile.social && Profile.social.website) || "",
	});
	const [media, setMedia] = useState(null);
	const [imgPreview, setImgPreview] = useState(profile.profilePicUrl);
	const [loading, setLoading] = useState(false);
	const [showSocialLinks, setShowSocialLinks] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleChange = (e) => {
		e.preventDefault();
		const { name, value, files } = e.target;
		if (name === "media") {
			setMedia(files[0]);
			URL.revokeObjectURL(imgPreview);
			setImgPreview(URL.createObjectURL(files[0]));
		}
		setProfile((prev) => ({ ...prev, [name]: value }));
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
					post={false}
				/>
			)}
			<Form
				loading={loading}
				onSubmit={async (e) => {
					e.preventDefault();
					setLoading(true);
					let profilePicUrl, cloudinaryId;
					if (media !== null) {
						const uploadData = await uploadPic(media);
						profilePicUrl = uploadData.picUrl;
						cloudinaryId = uploadData.cloudinaryId;
					}
					if (media !== null && !profilePicUrl) {
						setLoading(false);
						return setErrorMsg("Error Uploading Image");
					}
					await profileUpdate(
						profile,
						setLoading,
						setErrorMsg,
						profilePicUrl,
						cloudinaryId
					);
					setShowToaster({ show: true, msg: "Profile Updated!" });
				}}>
				<ImageDrop
					imgPreview={imgPreview}
					setImgPreview={setImgPreview}
					setMedia={setMedia}
					handleChange={handleChange}
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
						value={profile.bio}
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
						onClick={() => setShowSocialLinks(!showSocialLinks)}
						className='btn-social'
					/>
					<Button
						size='small'
						color='green'
						disabled={profile.bio === "" || loading}
						icon='pencil alternate'
						content='Save Changes'
						type='submit'
					/>
				</div>
				{showSocialLinks && (
					<SocialInputs user={profile} handleChange={handleChange} />
				)}
				<Divider hidden />
			</Form>
		</>
	);
}

export default UpdateProfile;
