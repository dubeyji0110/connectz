import { useEffect, useState } from "react";
import {
	MailOutlineRounded,
	VisibilityOffRounded,
	VisibilityRounded,
} from "@material-ui/icons";
import { Form, Divider, Segment, Button, Message } from "semantic-ui-react";
import Link from "next/link";
import CustomInput from "../Components/Custom/CustomInput";
import cookie from "js-cookie";
import { loginUser } from "../utils/authUser";

function Login() {
	const [user, setUser] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const [errMsg, setErrMsg] = useState(null);

	const { email, password } = user;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUser((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormLoading(true);
		await loginUser(user, setFormLoading, setErrMsg);
	};

	useEffect(() => {
		document.title = "Login to CONNECTZ";
		const userEmail = cookie.get("userEmail");
		if (userEmail) setUser((prev) => ({ ...prev, email: userEmail }));
		if (errMsg !== null) setTimeout(() => setErrMsg(null), 5000);
	}, [errMsg]);

	return (
		<div className='signup_container'>
			<h2 className='heading_signup loginmargin'>
				Welcome Back! - Your friends might be waiting.
			</h2>
			<Form
				error={errMsg !== null}
				loading={formLoading}
				onSubmit={handleSubmit}
				style={{
					maxWidth: "650px",
					padding: "10px",
					width: "100%",
				}}>
				<Message
					error
					header='OOPS!'
					content={errMsg}
					onDismiss={() => setErrMsg(null)}
				/>
				<Segment>
					<CustomInput
						type='email'
						placeholder='Email'
						name='email'
						value={email}
						onChange={handleChange}
						id='email'
						label='Email'
						Icon={
							<MailOutlineRounded style={{ color: "#4a4a4a" }} />
						}
						required
					/>
					<CustomInput
						type={showPassword ? "text" : "password"}
						placeholder='Password'
						name='password'
						value={password}
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
					<Link style={{ paddingLeft: "5px" }} href='/reset'>
						Forgot Password?
					</Link>
					<Divider hidden />
					<Button
						icon='sign in'
						content='LogIn'
						disabled={user.email === "" || user.password === ""}
						type='submit'
						className='btn-submit'
						style={{ margin: "auto", display: "block" }}
					/>
				</Segment>
			</Form>
			<h4 className='footer_signup'>
				New Here? <Link href={"/signup"}>SignUp</Link> Instead.
			</h4>
		</div>
	);
}

export default Login;
