import InfiniteScroll from "react-infinite-scroll-component";

export default function CustomInfiniteScroll({ items, fetchData, hasMore, children, loader }) {
	return (
		<InfiniteScroll
			dataLength={items.length}
			next={fetchData}
			hasMore={hasMore}
			loader={loader}
		>
			{children}
		</InfiniteScroll>
	);
}
