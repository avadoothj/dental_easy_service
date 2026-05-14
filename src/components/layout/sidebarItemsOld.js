"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import style from "@/css/common/sidebarOld.module.scss";
import CustomImage from "@/common/customImage";
import { exclamationIcon, sidebarExclamationIcon } from "@/utils/imagesPicker";

export default function SidebarItems({ menus, planCount }) {
	const pathname = usePathname();

	return (
		<div className={`${style.sideBarMenu} sideBarMenu`}>
			{menus &&
				JSON.parse(menus).map((parentMenu, parentIndex) => (
					<ul key={parentIndex}>
						{parentMenu.map((x, i) => (
							<li
								key={i}
								className={
									pathname == "/" && pathname == x.link
										? style.active
										: x.link != "/" && pathname.startsWith(x.link)
										? style.active
										: ""
								}
							>
								<Link
									href={x.link}
									onClick={() => {
										setTimeout(() => {
											jQuery("#sidebarClose").trigger("click");
										}, 300);
									}}
								>
									<CustomImage
										alt={x.name}
										src={x.image}
										width="16"
										height="16"
									/>
									<div className={style.menuTxt}>
										{x.link === "/plans" && planCount.price_not_set > 0 ? (
											<>
												<CustomImage
													className="planIcon"
													alt="exclamation"
													src={sidebarExclamationIcon}
													width="7"
													height="7"
												/>
												{x.name}
												<span>
													<CustomImage
														src={sidebarExclamationIcon}
														alt="exclamation"
														width="7"
														height="7"
													/>
													Incomplete Plan
												</span>
											</>
										) : (
											x.name
										)}
									</div>
								</Link>
							</li>
						))}
					</ul>
				))}
		</div>
	);
}
