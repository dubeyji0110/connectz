import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Message, Segment } from "semantic-ui-react";
import { MailOutlineRounded } from "@material-ui/icons";
import Link from "next/link";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchError";
import { ErrorToastr, SuccessToastr } from "../../Components/Common/Toaster";
import CustomInput from "../../Components/Custom/CustomInput";

function ResetPage() {
	const [email, setEmail] = useState("");
	const [errorMsg, setErrorMsg] = useState(null);
	const [success, setSuccess] = useState(false);
	const [emailChecked, setEmailChecked] = useState(false);
	const [loading, setLoading] = useState(false);

	const resetPassword = async (e) => {
		setLoading(true);
		e.preventDefault();
		try {
			await axios.post(`${baseUrl}/api/reset`, { email });
			setEmailChecked(true);
			setSuccess(true);
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
			{success && <SuccessToastr msg='Mail Sent!' />}
			{errorMsg !== null && <ErrorToastr error={errorMsg} />}
			{emailChecked && (
				<Message
					attached
					icon='mail'
					header='Check your inbox'
					content='for furthur instructions'
					success
				/>
			)}
			<h4 style={{ marginBottom: "2.5rem", fontSize: "2rem" }}>
				Reset your Password
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
						type='email'
						placeholder='Email'
						name='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						id='email'
						label='Enter your email'
						Icon={
							<MailOutlineRounded style={{ color: "#4a4a4a" }} />
						}
						required
					/>
					<Button
						disabled={loading || email.trim().length === 0}
						icon='configure'
						type='submit'
						color='blue'
						content='Submit'
					/>
				</Segment>
			</Form>
			<h4 className='footer_signup'>
				Go back to <Link href={"/login"}>Login</Link>?
			</h4>
		</div>
	);
}

export default ResetPage;
