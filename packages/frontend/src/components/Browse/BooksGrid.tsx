import { type BookResource } from "@repo/api";
import BookCard from "./BookCard";

interface BooksGridProps {
	books: BookResource[];
	isLoading: boolean;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	onLoadMore: () => void;
	searchQuery: string;
}

const BooksGrid = ({ 
	books, 
	isLoading, 
	hasNextPage, 
	isFetchingNextPage, 
	onLoadMore, 
	searchQuery 
}: BooksGridProps) => (
	<div className="grid gap-4">
		{isLoading ? (
			<>
				{Array.from({ length: 6 }).map((_, idx) => (
					<div key={idx} className="card bg-base-100 shadow-md">
						<div className="card-body p-4">
							<div className="flex gap-4">
								<div className="skeleton w-16 h-24 rounded flex-shrink-0"></div>
								<div className="flex-1 space-y-3">
									<div className="skeleton h-4 w-3/4"></div>
									<div className="skeleton h-3 w-1/2"></div>
									<div className="flex gap-2">
										<div className="skeleton h-3 w-12"></div>
										<div className="skeleton h-3 w-16"></div>
										<div className="skeleton h-3 w-20"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</>
		) : books.length === 0 ? (
			<div className="text-center py-12">
				<p className="text-base-content/60">
					No books found for "{searchQuery}"
				</p>
			</div>
		) : (
			<>
				{books.map((book) => (
					<BookCard key={book.id} book={book} />
				))}
				{hasNextPage && (
					<div className="text-center py-8">
						<button
							onClick={onLoadMore}
							disabled={isFetchingNextPage}
							className="btn btn-outline"
						>
							{isFetchingNextPage ? (
								<span className="loading loading-spinner loading-sm"></span>
							) : (
								"Load More Books"
							)}
						</button>
					</div>
				)}
				{!hasNextPage && books.length > 0 && (
					<div className="text-center py-8">
						<p className="text-base-content/50">No more books to load</p>
					</div>
				)}
			</>
		)}
	</div>
);

export default BooksGrid;