import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Message, Segment } from "semantic-ui-react";
import { VisibilityOffRounded, VisibilityRounded } from "@material-ui/icons";
import { ErrorToastr, SuccessToastr } from "../../Components/Common/Toaster";
import catchErrors from "../../utils/catchError";
import baseUrl from "../../utils/baseUrl";
import CustomInput from "../../Components/Custom/CustomInput";

function TokenPage() {
	const [errorMsg, setErrorMsg] = useState(null);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [passwords, setPasswords] = useState({
		newPassword: "",
		repeatNewPassword: "",
	});
	const [showPassword, setShowPassword] = useState({
		p1: false,
		p2: false,
	});
	const router = useRouter();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPasswords((prev) => ({ ...prev, [name]: value }));
	};

	const resetPassword = async (e) => {
		setLoading(true);
		e.preventDefault();
		try {
			if (passwords.newPassword !== passwords.repeatNewPassword) {
				setErrorMsg("Passwords do not match");
				setLoading(false);
				return;
			}
			await axios.post(`${baseUrl}/api/reset/token`, {
				password: passwords.newPassword,
				token: router.query.token,
			});
			setSuccess(true);
			router.push("/login");
		} catch (error) {
			setErrorMsg(catchErrors(error));
		}
		setLoading(false);
	};

	useEffect(() => {
		document.title = "Reset Password";
		errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000);
	}, [errorMsg]);

	useEffect(() => {
		success !== null && setTimeout(() => setSuccess(null), 5000);
	}, [success]);

	return (
		<div
			style={{
				padding: "1rem",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				height: "85vh",
			}}>
			{success && <SuccessToastr msg='Password Updated!' />}
			{errorMsg !== null && <ErrorToastr error={errorMsg} />}
			<h4 style={{ marginBottom: "2.5rem", fontSize: "2rem" }}>
				Set a new Password
			</h4>
			<Form
				loading={loading}
				onSubmit={resetPassword}
				style={{
					width: "650px",
					maxWidth: "100%",
					textAlign: "right",
				}}>
				<Segment
					style={{
						borderRadius: "15px",
						boxShadow: "1px 1px 2px -1px rgba(0, 0, 0, 0.25)",
					}}>
					<CustomInput
						type={showPassword.p1 ? "text" : "password"}
						placeholder='New Password'
						name='newPassword'
						value={passwords.newPassword}
						onChange={handleChange}
						id='newPassword'
						label='New Password'
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
						placeholder='Repeat Password'
						name='repeatNewPassword'
						value={passwords.repeatNewPassword}
						onChange={handleChange}
						id='repeatNewPassword'
						label='Repeat Password'
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
					<Button
						disabled={
							loading ||
							passwords.newPassword.trim().length === 0 ||
							passwords.repeatNewPassword.trim().length === 0
						}
						icon='configure'
						type='submit'
						color='blue'
						content='Reset'
					/>
				</Segment>
			</Form>
			<h4 className='footer_signup'>
				Go back to <Link href={"/login"}>Login</Link>?
			</h4>
		</div>
	);
}

export default TokenPage;
