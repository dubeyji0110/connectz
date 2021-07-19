import { useEffect } from "react";

function ErrorPage() {
	useEffect(() => {
		document.title = "404 | Page Not Found";
	}, []);

	return <div>404</div>;
}

export default ErrorPage;
