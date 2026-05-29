import Link from "next/link";

import style from "@/css/operator/operator.module.scss";
import CustomImage from "@/common/customImage";
import { addOperatorImage, plusIcon } from "@/utils/imagesPicker";

export default function NoOperators({ user }) {
	return (
		<div className={style.importOperator}>
			<div className={style.inner}>
				<div className={style.imagebox}>
					<CustomImage
						src={addOperatorImage}
						alt="no operator"
						width="336"
						height="272"
					/>
				</div>
				{user.user_type != "super isp" &&
					user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
						<>
							<h1>Add Your First Operator</h1>
							<div className={style.buttonWrapper}>
								<Link
									href="/operators/add"
									className={`commonBtn dark ${style.addNew}`}
								>
									<CustomImage
										src={plusIcon}
										alt="add"
										width="20"
										height="20"
									/>
									Add New Operator
								</Link>
							</div>
						</>
					)}
			</div>
		</div>
	);
}
