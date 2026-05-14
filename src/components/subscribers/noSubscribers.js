import Link from "next/link";
import style from "@/css/subscribers/subscribers.module.scss";
import CustomImage from "@/common/customImage";
import { addSubscriberImage, plusIcon, importIcon } from "@/utils/imagesPicker";

export default function NoSubscribers({ isAllowBulk = true }) {
	return (
		<div className={style.importSubscriber}>
			<div className={style.inner}>
				<div className={style.imagebox}>
					<CustomImage
						src={addSubscriberImage}
						alt="no subscriber"
						width="336"
						height="272"
					/>
				</div>
				<h1>Add Your First Subscriber</h1>
				{/* <p>
					A subscriber is not just a number, but a connection waiting to be nourished with
					content and engagement.
				</p> */}
				<div className={style.buttonWrapper}>
					{isAllowBulk && (
						<Link
							href="/bulkActivity"
							className={`commonBtn borderBtn ${style.importBtn}`}
						>
							<CustomImage
								src={importIcon}
								alt="import"
								width="18"
								height="18"
							/>
							Import Subscriber
						</Link>
					)}
					<Link
						href="/subscribers/add"
						className={`commonBtn dark ${style.addNew}`}
					>
						<CustomImage
							src={plusIcon}
							alt="add"
							width="20"
							height="20"
						/>
						Add New Subscriber
					</Link>
				</div>
			</div>
		</div>
	);
}
