import {
	Instagram,
	Twitter,
	GitHub,
	LanguageRounded,
} from "@material-ui/icons";
import CustomInput from "../Custom/CustomInput";

function SocialInputs({ user, handleChange }) {
	return (
		<>
			<h4 style={{ textDecoration: "underline", marginTop: "10px" }}>
				Link Social Profiles (Optional)
			</h4>
			<CustomInput
				value={user.instagram}
				onChange={handleChange}
				type='text'
				placeholder='Instagram Profile'
				name='instagram'
				id='instagram'
				label='Instagram'
				Icon={<Instagram style={{ color: "#4a4a4a" }} />}
			/>
			<CustomInput
				type='text'
				value={user.twitter}
				onChange={handleChange}
				placeholder='Twitter Profile'
				name='twitter'
				id='twitter'
				label='Twitter'
				Icon={<Twitter style={{ color: "#4a4a4a" }} />}
			/>
			<CustomInput
				type='text'
				value={user.github}
				onChange={handleChange}
				placeholder='Github'
				name='github'
				id='github'
				label='Github'
				Icon={<GitHub style={{ color: "#4a4a4a" }} />}
			/>
			<CustomInput
				type='url'
				value={user.website}
				onChange={handleChange}
				placeholder='Website'
				name='website'
				id='website'
				label='Website'
				Icon={<LanguageRounded style={{ color: "#4a4a4a" }} />}
			/>
		</>
	);
}

export default SocialInputs;
