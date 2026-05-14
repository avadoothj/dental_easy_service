import { useContext } from "react";
import style from "@/css/operator/operator.module.scss";
import { formatPrice } from "@/utils/utils";
import SimpleTooltip from "@/common/simpleTooltip";
import Dropdown from "react-bootstrap/Dropdown";
import { useRouter } from "next/navigation";
import { AppContext } from "@/contextProvider";

export default function OperatorCard({ item }) {
	const router = useRouter();
	const { user } = useContext(AppContext);

	const toggleEditView = () => {
		router.push("/operators/details/" + item.oper_id);
	};

	const toggleViewDetails = () => {
		router.push("/operators/details/" + item.oper_id);
	};
	const toggleAddTeam = () => {
		router.push("/operators/details/" + item.oper_id + "#teams");
	};

	return (
		<div className={style.operatorCard}>
			<div className="threedotpop">
				<Dropdown>
					<Dropdown.Toggle
						className="threedot"
						id="dropdown-basic"
					>
						<span>&#x2026;</span>
					</Dropdown.Toggle>
					<Dropdown.Menu>
						{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
							<Dropdown.Item onClick={() => toggleEditView()}>
								<span className={style.copyicn}>Edit</span>
							</Dropdown.Item>
						)}

						<Dropdown.Item onClick={() => toggleViewDetails()}>
							<span className={style.copyicn}>View Details</span>
						</Dropdown.Item>

						{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
							<Dropdown.Item onClick={(e) => toggleAddTeam()}>
								<span className={style.copyicn}>Add Operator Team</span>
							</Dropdown.Item>
						)}
					</Dropdown.Menu>
				</Dropdown>
			</div>

			<div className={style.header}>
				<SimpleTooltip text={item.oper_name}>
					<h3>{item.oper_name}</h3>
				</SimpleTooltip>
			</div>

			<>
				<div className={style.row}>
					<div className={style.col}>
						<div className={style.label}>Operator Code</div>
						<div className={style.data}>{item.oper_code}</div>
					</div>
					<div className={style.col}>
						<div className={style.label}>Zone</div>
						<div className={style.data}>{item.zone_name}</div>
					</div>
				</div>

				<div className={style.row}>
					<div className={style.col}>
						<div className={style.label}>No. of Users</div>
						<div className={style.data}>{item.no_of_users}</div>
					</div>
				</div>

				<div className={style.footer}>
					Available Balance <span>{formatPrice(item.available_balance)}</span>
				</div>
			</>
		</div>
	);
}
