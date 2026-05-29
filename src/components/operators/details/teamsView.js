"use client";
import { useContext, useEffect, useState } from "react";
import style from "@/css/operator/operator.module.scss";
import { AppContext } from "@/contextProvider";
import NoTeamMember from "@/components/operators/details/noTeamMember";
import TeamsList from "@/components/operators/details/teamsList";
import AddTeamMember from "@/components/operators/details/addTeamMember";
import EditTeamMember from "@/components/operators/details/editTeamMember";
import SearchFilterTeam from "@/components/operators/searchFilterTeam";
import SearchFilterTeamMobile from "@/components/operators/searchFilterTeamMobile";
import { sortList } from "@/utils/masterData";

export default function TeamsView({ user, operator, setActiveTab }) {
	const { showAlert } = useContext(AppContext);

	const [selectedTeam, setSelectedTeam] = useState({});
	const [keyword, setKeyword] = useState("");
	const [searchText, setSearchText] = useState("");
	const [status, setStatus] = useState("");
	const [sortBy, setSortBy] = useState(sortList[0].id);

	const [action, setAction] = useState(operator.no_of_users > 0 ? "view" : "noView");

	useEffect(() => {
		const checkKeyword = setTimeout(() => {
			setSearchText(keyword);
		}, 500);

		return () => clearTimeout(checkKeyword);
	}, [keyword]);

	useEffect(() => {
		handleViewAction();
	}, [operator.no_of_users]);

	const handleAddAction = () => {
		setAction("add");
	};

	const handleViewAction = () => {
		if (operator.no_of_users > 0) {
			setAction("view");
		} else {
			setAction("noView");
		}
	};

	const handleTeamSelect = (team) => {
		setSelectedTeam(team);
		setAction("edit");
	};

	const handleAssignPlanBtn = () => {
		setActiveTab("plans");
		const interval = setInterval(() => {
			if (jQuery("#assignPlan").length > 0) {
				clearInterval(interval);
				jQuery("#assignPlan").trigger("click");
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
							operator={operator}
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
						{operator.no_of_plans > 0 ? (
							<button
								className="commonBtn dark"
								onClick={() => setActiveTab("plans")}
							>
								View Plan
							</button>
						) : (
							<>
								{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
									<button
										className="commonBtn dark"
										onClick={() => handleAssignPlanBtn()}
									>
										Assign Plan
									</button>
								)}
							</>
						)}
					</div>
				</>
			)}

			{action == "add" && (
				<AddTeamMember
					operator={operator}
					handleViewAction={handleViewAction}
				/>
			)}

			{action == "edit" && (
				<EditTeamMember
					operator={operator}
					teamMember={selectedTeam}
					handleViewAction={handleViewAction}
				/>
			)}
		</>
	);
}
