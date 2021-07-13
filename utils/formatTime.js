import moment from "moment";
import Moment from "react-moment";

const formatTime = (createdAt) => {
	const today = moment(Date.now());
	const postDate = moment(createdAt);
	const diffInHrs = today.diff(postDate, "hours");
	if (diffInHrs < 24) {
		return (
			<>
				Today <Moment format='hh:mm A'>{createdAt}</Moment>
			</>
		);
	} else if (diffInHrs > 24 && diffInHrs < 36) {
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
