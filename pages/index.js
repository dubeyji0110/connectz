import Link from "next/link";
import { Image } from "semantic-ui-react";

function Index() {
	return (
		<div className='homepage_container'>
			<div className='left'>
				<Image
					src='/vector.jpg'
					className='img'
				/>
			</div>
			<div className='right'>
				<h1>Happening Now</h1>
				<p>Join CONNECTZ and meet your fellow Introverts</p>
				<div className='link_signup'>
					<Link href='/signup'>SignUp</Link>
					<Link href='/login'>LogIn</Link>
				</div>
			</div>
		</div>
	);
}

export default Index;
