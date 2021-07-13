import axios from "axios";

const uploadPic = async (media) => {
	try {
		const form = new FormData();
		form.append("file", media);
		form.append("upload_preset", "social_app");
		form.append("cloud_name", "dyekojods");
		form.append("folder", "Social");

		const res = await axios.post(process.env.CLOUDINARY_URL, form);
		return { picUrl: res.data.url, cloudinaryId: res.data.public_id };
	} catch (error) {
		console.error(error);
		return;
	}
};

export default uploadPic;
