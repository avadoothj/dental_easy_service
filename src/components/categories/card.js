import Link from "next/link";

export default function Card({ item }) {
	return (
		<li>
			<Link
				href={`/categories/edit/${item.cat_id}`}
				// className={style.active}
			>
				{item.name}
			</Link>
		</li>
	);
}
