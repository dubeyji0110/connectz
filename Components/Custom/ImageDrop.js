import { AddAPhotoRounded } from "@material-ui/icons";
import { useRef } from "react";
import { Form, Header, Image } from "semantic-ui-react";

function ImageDrop({ imgPreview, setImgPreview, setMedia, handleChange }) {
	const fileRef = useRef();

	return (
		<Form.Field
			style={{ flex: "1", display: "flex", alignItems: "center" }}
			className='imgDropResponsive'>
			<div
				className='_dropDiv'
				onDragOver={(e) => {
					e.preventDefault();
				}}
				onDragLeave={(e) => {
					e.preventDefault();
				}}
				onDrop={(e) => {
					e.preventDefault();
					const file = Array.from(e.dataTransfer.files);
					setImgPreview(URL.createObjectURL(file[0]));
					setMedia(file[0]);
				}}>
				<input
					type='file'
					name='media'
					id='media'
					style={{ display: "none" }}
					ref={fileRef}
					onChange={handleChange}
				/>
				{imgPreview === null ? (
					<div>
						<AddAPhotoRounded
							style={{
								fontSize: "2.5rem",
								cursor: "pointer",
								display: "block",
								margin: "auto",
							}}
							onClick={() => fileRef.current.click()}
						/>
						<Header icon>
							Drag and Drop or Click to Upload Image
						</Header>
					</div>
				) : (
					<Image
						src={imgPreview}
						size='medium'
						centered
						style={{
							cursor: "pointer",
							width: "90%",
							height: "90%",
						}}
						onClick={() => fileRef.current.click()}
					/>
				)}
			</div>
		</Form.Field>
	);
}

export default ImageDrop;
