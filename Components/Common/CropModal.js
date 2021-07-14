import { Modal, Button } from "semantic-ui-react";
import Cropper from "react-cropper";
import { useState } from "react";
import { IconButton } from "@material-ui/core";
import { RotateLeftRounded } from "@material-ui/icons";

function CropModal({
	imgPreview,
	setImgPreview,
	setMedia,
	showModal,
	setShowModal,
	post,
}) {
	const [cropper, setCropper] = useState();

	const getCropData = () => {
		if (cropper) {
			setMedia(cropper.getCroppedCanvas().toDataURL());
			setImgPreview(cropper.getCroppedCanvas().toDataURL());
			cropper.destroy();
		}
		setShowModal(false);
	};

	return (
		<Modal
			open={showModal}
			closeOnDimmerClick={false}
			size='small'
			onClose={() => setShowModal(false)}>
			<Modal.Header as='h3' content='Crop Image Before Uploading' />
			<Modal.Content>
				<div className='_cropModal'>
					<div style={{ flex: "1" }}>
						{post ? (
							<Cropper
								style={{ height: "400px", width: "100%" }}
								cropBoxResizable
								zoomable
								highlight
								responsive
								guides
								dragMode='move'
								initialAspectRatio={1}
								// preview='._img-preview'
								src={imgPreview}
								viewMode={1}
								minCropBoxHeight={10}
								minCropBoxWidth={10}
								background={false}
								autoCropArea={1}
								checkOrientation={false}
								onInitialized={(cropper) => setCropper(cropper)}
							/>
						) : (
							<Cropper
								style={{ height: "400px", width: "100%" }}
								cropBoxResizable
								zoomable
								highlight
								responsive
								guides
								dragMode='move'
								initialAspectRatio={1}
								aspectRatio={1}
								// preview='._img-preview'
								src={imgPreview}
								viewMode={1}
								minCropBoxHeight={10}
								minCropBoxWidth={10}
								background={false}
								autoCropArea={1}
								checkOrientation={false}
								onInitialized={(cropper) => setCropper(cropper)}
							/>
						)}
					</div>
					{/* for crop preview  */}
					{/* <div
						style={{
							flex: "1",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<div
							style={{
								width: "100%",
								height: "300px",
								overflow: "hidden",
							}}
							className='_img-preview'
						/>
					</div> */}
				</div>
			</Modal.Content>
			<Modal.Actions style={{ padding: "0.3rem 1rem" }}>
				<IconButton
					style={{
						border: "1px solid rgba(0,0,0,0.25)",
						boxShadow: "1px 1px 4px rgba(0,0,0,0.15)",
						transform: "scale(0.8)",
					}}
					title='Reset'
					onClick={() => cropper && cropper.reset()}>
					<RotateLeftRounded />
				</IconButton>
				<Button
					negative
					content='Cancel'
					icon='cancel'
					onClick={() => setShowModal(false)}
				/>
				<Button
					content='Crop Image'
					icon='checkmark'
					positive
					onClick={getCropData}
				/>
			</Modal.Actions>
		</Modal>
	);
}

export default CropModal;
