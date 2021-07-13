import { toast, ToastContainer } from "react-toastify";

export const SuccessToastr = ({ msg }) => {
	return (
		<ToastContainer
			position='bottom-center'
			autoClose={3000}
			hideProgressBar={false}
			newestOnTop={true}
			closeButton={true}
			closeOnClick={true}
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover={false}>
			{toast.success(msg, {
				position: "bottom-center",
				autoClose: 3000,
				hideProgressBar: false,
				closeButton: true,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
			})}
		</ToastContainer>
	);
};

export const ErrorToastr = ({ error }) => {
	return (
		<ToastContainer
			position='bottom-center'
			autoClose={3000}
			hideProgressBar={false}
			newestOnTop={true}
			closeButton={true}
			closeOnClick={true}
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover={false}>
			{toast.error(error, {
				position: "bottom-center",
				autoClose: 3000,
				hideProgressBar: false,
				closeButton: true,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
			})}
		</ToastContainer>
	);
};
