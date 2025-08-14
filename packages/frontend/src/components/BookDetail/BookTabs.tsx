interface BookTabsProps {
	activeTab: "overview" | "reviews";
	onTabChange: (tab: "overview" | "reviews") => void;
	reviewsCount: number;
}

const BookTabs = ({ activeTab, onTabChange, reviewsCount }: BookTabsProps) => (
	<div className="tabs tabs-lifted">
		<button
			className={`tab tab-lifted ${activeTab === "overview" ? "tab-active" : ""}`}
			onClick={() => onTabChange("overview")}
		>
			Overview
		</button>
		<button
			className={`tab tab-lifted ${activeTab === "reviews" ? "tab-active" : ""}`}
			onClick={() => onTabChange("reviews")}
		>
			Reviews ({reviewsCount})
		</button>
	</div>
);

export default BookTabs;