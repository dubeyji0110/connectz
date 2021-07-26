import Link from "next/link";

function ListItem({
	name,
	Icon,
	link,
	onClick,
	newUpdate,
	active,
	className,
	notiLen,
	newMessage,
	unreadMsg,
}) {
	return link ? (
		<Link href={link}>
			<div
				className={
					"sidebarLink " + (active ? "active " : "") + className
				}
				title={name}>
				{Icon}
				<h2 className='sidebarHeading'>{name}</h2>
				{newUpdate && notiLen > 0 && <span id='dot'>{notiLen}</span>}
				{newMessage && unreadMsg > 0 && (
					<span id='dot'>{unreadMsg}</span>
				)}
			</div>
		</Link>
	) : (
		<div
			className={"sidebarLink " + className}
			title={name}
			onClick={onClick}>
			{Icon}
			<h2 className='sidebarHeading'>{name}</h2>
		</div>
	);
}

export default ListItem;
