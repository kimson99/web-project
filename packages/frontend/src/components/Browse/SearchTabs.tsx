interface SearchTabsProps {
	activeTab: "books" | "authors";
	onTabChange: (tab: "books" | "authors") => void;
	booksCount: number;
	authorsCount: number;
}

const SearchTabs = ({ activeTab, onTabChange, booksCount, authorsCount }: SearchTabsProps) => (
	<div className="tabs tabs-lifted mb-6">
		<button
			className={`tab tab-lifted ${activeTab === "books" ? "tab-active" : ""}`}
			onClick={() => onTabChange("books")}
		>
			Books ({booksCount})
		</button>
		<button
			className={`tab tab-lifted ${activeTab === "authors" ? "tab-active" : ""}`}
			onClick={() => onTabChange("authors")}
		>
			Authors ({authorsCount})
		</button>
	</div>
);

export default SearchTabs;