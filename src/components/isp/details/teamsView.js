"use client";
import { useEffect, useState } from "react";
import style from "@/css/operator/operator.module.scss";
import NoTeamMember from "@/components/operators/details/noTeamMember";
import TeamsList from "./teamList";
import AddTeamMember from "@/components/operators/details/addTeamMember";
import EditTeamMember from "@/components/operators/details/editTeamMember";
import SearchFilterTeam from "@/components/operators/searchFilterTeam";
import SearchFilterTeamMobile from "@/components/operators/searchFilterTeamMobile";

export default function TeamsView({ isp, setActiveTab, user }) {
	const [selectedTeam, setSelectedTeam] = useState({});
	const [keyword, setKeyword] = useState("");
	const [searchText, setSearchText] = useState("");
	const [status, setStatus] = useState("");
	const [sortBy, setSortBy] = useState("");

	const [action, setAction] = useState("view");

	useEffect(() => {
		const checkKeyword = setTimeout(() => {
			setSearchText(keyword);
		}, 500);

		return () => clearTimeout(checkKeyword);
	}, [keyword]);

	useEffect(() => {
		handleViewAction();
	}, [isp.no_of_users]);

	const handleAddAction = () => {
		setAction("add");
	};

	const handleViewAction = () => {
		if (isp.no_of_users > 0) {
			setAction("view");
		} else {
			setAction("noView");
		}
	};

	const handleTeamSelect = (team) => {
		setSelectedTeam(team);
		setAction("edit");
	};

	const handleViewOperatorBtn = () => {
		setActiveTab("operators");
	};

	const handleAssignOperatorBtn = () => {
		setActiveTab("operators");
		const interval = setInterval(() => {
			if (jQuery("#operatorBtn").length > 0) {
				clearInterval(interval);
				jQuery("#operatorBtn").trigger("click");
			}
		}, 50);
	};

	return (
		<>
			{action == "noView" && (
				<NoTeamMember
					handleAddTeamMember={handleAddAction}
					user={user}
				/>
			)}

			{action == "view" && (
				<>
					<div className={style.teamCardWrapper}>
						<SearchFilterTeam
							handleKeyword={setKeyword}
							handleStatus={setStatus}
							handleSort={setSortBy}
							keyword={keyword}
						/>
						<SearchFilterTeamMobile
							handleKeyword={setKeyword}
							handleStatus={setStatus}
							handleSort={setSortBy}
							keyword={keyword}
						/>
						<TeamsList
							keyword={searchText}
							status={status}
							sort={sortBy}
							isp={isp}
							handleTeamSelect={handleTeamSelect}
						/>
					</div>
					<div className={style.btnWrapper}>
						{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
							<button
								className="commonBtn borderBtn"
								onClick={handleAddAction}
							>
								Add More Team Members
							</button>
						)}

						{isp.no_of_operators > 0 ? (
							<button
								className="commonBtn dark"
								onClick={handleViewOperatorBtn}
							>
								View Operators
							</button>
						) : (
							<>
								{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
									<button
										className="commonBtn dark"
										onClick={handleAssignOperatorBtn}
									>
										Add Operator
									</button>
								)}
							</>
						)}
					</div>
				</>
			)}

			{action == "add" && (
				<AddTeamMember
					operator={isp}
					handleViewAction={handleViewAction}
					hasIpsAction={true}
				/>
			)}

			{action == "edit" && (
				<EditTeamMember
					operator={isp}
					teamMember={selectedTeam}
					handleViewAction={handleViewAction}
				/>
			)}
		</>
	);
}
