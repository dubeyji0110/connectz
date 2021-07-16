import { useRouter } from "next/router";
import { ArrowBackRounded } from "@material-ui/icons";

function MenuTabs({ active, owner }) {
	const router = useRouter();

	const setTab = (tab) => router.push(`?tab=${tab}`);

	return (
		<div className='tabs_wrapper'>
			{router.query.tab === "following" ||
			router.query.tab === "followers" ? (
				<ArrowBackRounded
					style={{ marginBottom: "0.5rem" }}
					onClick={() => setTab("profile")}
				/>
			) : (
				<>
					<div
						onClick={() => setTab("profile")}
						className={
							"tab " + (active === "profile" ? "act" : "")
						}>
						Profile
					</div>
					{owner && (
						<>
							<div
								onClick={() => setTab("update_profile")}
								className={
									"tab " +
									(active === "update_profile" ? "act" : "")
								}>
								Update Profile
							</div>
							<div
								onClick={() => setTab("settings")}
								className={
									"tab " +
									(active === "settings" ? "act" : "")
								}>
								Settings
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default MenuTabs;
