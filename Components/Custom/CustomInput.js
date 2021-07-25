function CustomInput(props) {
	const { type, placeholder, name, id, required, value } = props;
	const inputProps = { type, placeholder, name, id, required, value };

	const parentStyles = {
		marginTop: "10px",
		marginBottom: "10px",
		display: "block",
		width: "100%",
		textAlign: "left",
	};

	const labelStyles = {
		paddingLeft: "4px",
		fontWeight: "700",
		fontSize: "0.925rem",
	};

	const inputStyles = {
		display: "flex",
		alignItems: "center",
		border: "1px solid rgba(34,36,38,.15)",
		paddingLeft: "10px",
		borderRadius: "5px",
	};

	return (
		<div style={parentStyles}>
			{props.label && (
				<label htmlFor={props.name} style={labelStyles}>
					{props.label}:{" "}
					<span style={{ color: "red" }}>
						{props.required ? "*" : ""}
					</span>{" "}
				</label>
			)}
			<div style={inputStyles} className='inputdiv'>
				{props.Icon && props.Icon}
				<input
					autoComplete='off'
					onChange={props.onChange}
					{...inputProps}
					style={{ border: "none" }}
				/>
			</div>
		</div>
	);
}

export default CustomInput;
