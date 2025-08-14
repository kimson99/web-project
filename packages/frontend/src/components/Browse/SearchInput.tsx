interface SearchInputProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	onSearch: () => void;
}

const SearchInput = ({ searchQuery, onSearchChange, onSearch }: SearchInputProps) => (
	<div className="flex gap-2 mb-6">
		<div className="flex-1">
			<input
				type="text"
				placeholder="Search for books or authors..."
				className="input input-bordered w-full"
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && onSearch()}
			/>
		</div>
		<button
			onClick={onSearch}
			disabled={!searchQuery.trim()}
			className="btn btn-primary"
		>
			Search
		</button>
	</div>
);

export default SearchInput;