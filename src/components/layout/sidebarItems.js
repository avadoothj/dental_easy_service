"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import sidebarStyle from "@/css/common/sidebar.module.scss";
import CustomImage from "@/common/customImage";
import { sidebarExclamationIcon } from "@/utils/imagesPicker";

export default function SidebarItems({ menus, planCount, handleHamburgerClick }) {
	const pathname = usePathname();
	const [selectedMenu, setSelectedMenu] = useState([]);

	const handleSubMenuClick = (menuId = 0) => {
		let hasClass = false;
		if (menuId > 0) {
			hasClass = jQuery("#subMenu_" + menuId).hasClass(sidebarStyle.open);
		}

		jQuery(".customSubMenu").removeClass(sidebarStyle.open);

		if (menuId > 0) {
			if (hasClass) {
				jQuery("#subMenu_" + menuId).removeClass(sidebarStyle.open);
			} else {
				jQuery("#subMenu_" + menuId).addClass(sidebarStyle.open);
			}

			if (
				jQuery("#subMenu_" + menuId).hasClass("customSubMenu") &&
				jQuery("#toggleButton").hasClass(sidebarStyle.checked)
			) {
				jQuery("#toggleButton").trigger("click");
			}
		}
	};

	function processMenus(data) {
		let result = {};
		data.map((x) => {
			x.map((y) => {
				if (y.menus.length > 0) {
					y.menus.map((z) => {
						result[z.link] = [y.menu_id, z.menu_id];
					});
				} else {
					result[y.link] = [y.menu_id];
				}
			});
		});

		return result;
	}

	let menuList = [];
	try {
		menuList = processMenus(JSON.parse(menus));
	} catch (error) {
		// console.error("Unable to parse menu json sidebar");
	}

	const findSidebarItem = () => {
		let result = [];
		if (pathname == "/") {
			result = menuList["/"];
		} else {
			Object.keys(menuList).map((item) => {
				if (pathname.startsWith(item) && item != "/") {
					result = menuList[item];
				}
			});
		}
		return result;
	};

	const displayMenuItemName = (menuName) => {
		const words = menuName.split(" ");

		if (words.length > 1) {
			const maxLineLength = 12;

			let lines = [];
			let currentLine = "";

			words.forEach((word) => {
				if ((currentLine + word).length <= maxLineLength) {
					currentLine += (currentLine ? " " : "") + word;
				} else {
					if (currentLine) lines.push(currentLine);
					currentLine = word;
				}
			});

			if (currentLine) lines.push(currentLine);

			return lines.map((x, i) => <span key={i}>{x}</span>);
		} else {
			return menuName;
		}
	};

	useEffect(() => {
		const value = findSidebarItem();
		if (value && value[0]) {
			const interval = setInterval(() => {
				if (typeof jQuery != "undefined") {
					clearInterval(interval);
					handleSubMenuClick(value[0]);
				}
			}, 100);
		}
	}, []);

	useEffect(() => {
		setSelectedMenu(findSidebarItem());
	}, [pathname]);
	return (
		<div className={`${sidebarStyle.sideBarMenu} sideBarMenu`}>
			{menus != null &&
				JSON.parse(menus).map((parentMenu, parentIndex) => (
					<ul key={parentIndex} className="avadooth">
						{parentMenu
							.filter((y) => y.on_sidebar == 1)
							.map((x, i) => (
								<li
									key={i}
									className={
										selectedMenu?.includes(x.menu_id)
											? sidebarStyle.active
											: x.link != "/" && pathname.startsWith(x.link)
												? sidebarStyle.active
												: ""
									}
								>
									{x.menus.length == 0 ? (
										<Link
											href={x.link}
											onClick={() => {
												handleHamburgerClick();
												handleSubMenuClick(x.menu_id);
											}}
											className={sidebarStyle.link}
										>
											<CustomImage
												alt={x.name}
												src={x.image}
												width="16"
												height="16"
											/>
											<div className={sidebarStyle.label}>
												{displayMenuItemName(x.name)}
												{x.link === "/plans" &&
													planCount.price_not_set > 0 && (
														<CustomImage
															alt="exclamation"
															src={sidebarExclamationIcon}
															width="7"
															height="7"
														/>
													)}
											</div>
										</Link>
									) : (
										<>
										<div
											id={"subMenu_" + x.menu_id}
											className={`${sidebarStyle.link} subMenu customSubMenu`}
											onClick={() => handleSubMenuClick(x.menu_id)}
										>
											<CustomImage
												alt={x.name}
												src={x.image}
												width="16"
												height="16"
											/>
											<div className={sidebarStyle.label}>
												{x.name.split(" ").length > 1 ? (
													x.name
														.split(" ")
														.map((menuInWord, i) => (
															<span key={i}>{menuInWord}</span>
														))
												) : (
													<>{x.name}</>
												)}
											</div>
										</div>
										<ul className={sidebarStyle.subMenu}>
											{x.menus
												.filter((y) => y.on_sidebar == 1)
												.map((y, j) => (
													<li
														key={j}
														className={
															selectedMenu?.includes(y.menu_id)
																? style.active
																: ""
														}
													>
														<Link
															href={y.link}
															className="sub_menu_link"
															onClick={handleHamburgerClick}
														>
															{y.name}
														</Link>
													</li>
												))}
										</ul>
										</>
									)}
								</li>
							))}
					</ul>
				))}
		</div>
	);
}
