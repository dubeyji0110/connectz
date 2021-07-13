import Head from "next/head";

const HeadTag = () => (
	<Head>
		<meta name='viewport' content='initial-scale=1.0, width=device-width' />
		<meta charSet='UTF-8' />
		<link rel='icon' href='/favicon.png' sizes='16*16' type='image/png' />

		<link rel='stylesheet' type='text/css' href='/globals.css' />
		<link rel='stylesheet' type='text/css' href='/nProgress.css' />
		<title>Connect | Introvert App</title>
	</Head>
);

export default HeadTag;
