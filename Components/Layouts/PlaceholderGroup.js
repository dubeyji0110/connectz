import { Placeholder, Divider, Image } from "semantic-ui-react";
import { range } from "lodash";

export const PlaceholderPosts = () =>
	range(1, 3).map((item) => (
		<>
			<Placeholder key={item} fluid>
				<Placeholder.Header image>
					<Placeholder.Line />
					<Placeholder.Line />
				</Placeholder.Header>
				<Placeholder.Paragraph>
					<Placeholder.Line />
					<Placeholder.Line />
					<Placeholder.Line />
					<Placeholder.Line />
				</Placeholder.Paragraph>
			</Placeholder>
			<Divider hidden />
		</>
	));

export const EndMessage = () => (
	<div
		onClick={() => {
			document.querySelector(".main_container").scrollTop = 0;
		}}
		style={{ margin: "1rem 0", cursor: "pointer" }}>
		<Image
			style={{ margin: "auto", width: "75%" }}
			src='https://res.cloudinary.com/dyekojods/image/upload/v1626336592/feedEnd_blsqlm.jpg'
		/>
	</div>
);

export const LikesPlaceholder = () =>
	range(1, 5).map((item) => (
		<Placeholder key={item} style={{ minWidth: "200px" }}>
			<Placeholder.Header image>
				<Placeholder.Line length='full' />
			</Placeholder.Header>
		</Placeholder>
	));

export const NameBanner = () => (
	<div
		className='placeholderGroup'>
		<div className='placeImg'></div>
		<div>
			<div className='placeLine'></div>
			<div className='placeLine'></div>
		</div>
	</div>
);
