import { useEffect, useRef, useState } from "react";
import { Checkbox, Form, Button } from "semantic-ui-react";
import {
	KeyboardArrowDownRounded,
	KeyboardArrowUpRounded,
	VisibilityOffRounded,
	VisibilityRounded,
	Loop,
} from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import CustomInput from "../Custom/CustomInput";
import { passwordUpdate, toggleMessagePopup } from "../../utils/profileActions";

function Settings({ newMessagePopup, setShowToaster, setErrorMsg }) {
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [popup, setPopup] = useState(newMessagePopup);
	const [loading, setLoading] = useState(false);

	const isFirstRun = useRef(true);

	useEffect(() => {
		if (isFirstRun.current) isFirstRun.current = false;
		return;
	}, [popup]);

	const parentStyles = {
		padding: "10px",
	};

	const listStyle = {
		display: "flex",
		alignItems: "center",
	};

	const toggleChange = () => {
		setLoading(true);
		toggleMessagePopup(popup, setPopup, setShowToaster, setErrorMsg);
		setLoading(false);
	};

	return (
		<div style={parentStyles}>
			<div style={{ borderBottom: "1px solid rgba(0,0,0,0.15)" }}>
				<div style={{ ...listStyle, paddingRight: "12px" }}>
					<p style={{ flex: "1" }}>Show Message Popup</p>
					{loading ? (
						<Loop
							style={{
								padding: "12px",
								animation: "spin 0.8s linear infinite",
							}}
						/>
					) : (
						<Checkbox
							checked={popup}
							style={{ padding: "12px", cursor: "pointer" }}
							toggle
							onChange={toggleChange}
						/>
					)}
				</div>
			</div>
			<div style={{ ...listStyle }}>
				<p style={{ flex: "1" }}>Change Password</p>
				<IconButton
					onClick={() => setShowChangePassword(!showChangePassword)}>
					{showChangePassword ? (
						<KeyboardArrowUpRounded />
					) : (
						<KeyboardArrowDownRounded />
					)}
				</IconButton>
			</div>
			{showChangePassword && (
				<UpdatePassword
					setErrorMsg={setErrorMsg}
					setShowChangePassword={setShowChangePassword}
					setShowToaster={setShowToaster}
				/>
			)}
		</div>
	);
}

const UpdatePassword = ({
	setErrorMsg,
	setShowToaster,
	setShowChangePassword,
}) => {
	const [passwords, setPasswords] = useState({
		currentPassword: "",
		newPassword: "",
		repeatNewPassword: "",
	});
	const [showPassword, setShowPassword] = useState({
		p1: false,
		p2: false,
		p3: false,
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPasswords((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<Form
			style={{ marginBottom: "1rem" }}
			loading={loading}
			onSubmit={async (e) => {
				e.preventDefault();
				setLoading(true);
				if (passwords.newPassword !== passwords.repeatNewPassword) {
					setLoading(false);
					return setErrorMsg("Passwords do not Match");
				}
				await passwordUpdate(setShowToaster, passwords, setErrorMsg);
				setShowChangePassword(false);
				setLoading(false);
			}}>
			<CustomInput
				type={showPassword.p1 ? "text" : "password"}
				placeholder='Current Password'
				name='currentPassword'
				value={passwords.currentPassword}
				onChange={handleChange}
				id='currentPassword'
				label='Current Password'
				Icon={
					showPassword.p1 ? (
						<VisibilityOffRounded
							style={{
								color: "#4a4a4a",
								cursor: "pointer",
							}}
							onClick={() =>
								setShowPassword((prev) => ({
									...prev,
									p1: !showPassword.p1,
								}))
							}
						/>
					) : (
						<VisibilityRounded
							style={{
								color: "#4a4a4a",
								cursor: "pointer",
							}}
							onClick={() =>
								setShowPassword((prev) => ({
									...prev,
									p1: !showPassword.p1,
								}))
							}
						/>
					)
				}
				required
			/>
			<CustomInput
				type={showPassword.p2 ? "text" : "password"}
				placeholder='New Password'
				name='newPassword'
				value={passwords.newPassword}
				onChange={handleChange}
				id='newPassword'
				label='New Password'
				Icon={
					showPassword.p2 ? (
						<VisibilityOffRounded
							style={{
								color: "#4a4a4a",
								cursor: "pointer",
							}}
							onClick={() =>
								setShowPassword((prev) => ({
									...prev,
									p2: !showPassword.p2,
								}))
							}
						/>
					) : (
						<VisibilityRounded
							style={{
								color: "#4a4a4a",
								cursor: "pointer",
							}}
							onClick={() =>
								setShowPassword((prev) => ({
									...prev,
									p2: !showPassword.p2,
								}))
							}
						/>
					)
				}
				required
			/>
			<CustomInput
				type={showPassword.p3 ? "text" : "password"}
				placeholder='Repeat New Password'
				name='repeatNewPassword'
				value={passwords.repeatNewPassword}
				onChange={handleChange}
				id='repeatNewPassword'
				label='Repeat New Password'
				Icon={
					showPassword.p3 ? (
						<VisibilityOffRounded
							style={{
								color: "#4a4a4a",
								cursor: "pointer",
							}}
							onClick={() =>
								setShowPassword((prev) => ({
									...prev,
									p3: !showPassword.p3,
								}))
							}
						/>
					) : (
						<VisibilityRounded
							style={{
								color: "#4a4a4a",
								cursor: "pointer",
							}}
							onClick={() =>
								setShowPassword((prev) => ({
									...prev,
									p3: !showPassword.p3,
								}))
							}
						/>
					)
				}
				required
			/>
			<Button
				disabled={
					loading ||
					passwords.newPassword === "" ||
					passwords.currentPassword === "" ||
					passwords.repeatNewPassword === ""
				}
				size='small'
				compact
				icon='configure'
				type='submit'
				color='green'
				content='Confirm'
			/>
			<Button
				disabled={loading}
				type='button'
				compact
				size='small'
				icon='cancel'
				content='Cancel'
				onClick={() => setShowChangePassword(false)}
			/>
		</Form>
	);
};

export default Settings;
