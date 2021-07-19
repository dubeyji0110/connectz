import moment from "moment";
import Moment from "react-moment";

const formatTime = (createdAt) => {
	const today = moment(Date.now());
	const postDate = moment(createdAt);
	const diffInHrs = today.diff(postDate, "hours");
	const diffInMins = today.diff(postDate, "minutes");
	if (diffInMins < 1) {
		return <>Just now</>;
	} else if (diffInMins === 1) {
		return <>a min ago</>;
	} else if (diffInMins < 60) {
		return <>{diffInMins} mins ago</>;
	} else if (diffInMins > 60 && diffInHrs < 2) {
		return <>an hour ago</>;
	} else if (diffInMins > 60 && diffInHrs < 24) {
		return <>{diffInHrs} hours ago</>;
	} else if (diffInHrs >= 24 && diffInHrs < 36) {
		return (
			<>
				Yesterday <Moment format='hh:mm A'>{createdAt}</Moment>
			</>
		);
	} else {
		return (
			<>
				<Moment format='DD/MM/YYYY hh:mm A'>{createdAt}</Moment>
			</>
		);
	}
};

export default formatTime;
