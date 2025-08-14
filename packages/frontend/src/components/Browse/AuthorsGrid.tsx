import { type AuthorResource } from "@repo/api";
import AuthorCard from "./AuthorCard";

interface AuthorsGridProps {
	authors: AuthorResource[];
	isLoading: boolean;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	onLoadMore: () => void;
	searchQuery: string;
}

const AuthorsGrid = ({ 
	authors, 
	isLoading, 
	hasNextPage, 
	isFetchingNextPage, 
	onLoadMore, 
	searchQuery 
}: AuthorsGridProps) => (
	<div className="grid gap-4 md:grid-cols-2">
		{isLoading ? (
			<>
				{Array.from({ length: 6 }).map((_, idx) => (
					<div key={idx} className="card bg-base-100 shadow-md">
						<div className="card-body p-4">
							<div className="flex items-center gap-3">
								<div className="skeleton w-12 h-12 rounded-full flex-shrink-0"></div>
								<div className="flex-1 space-y-2">
									<div className="skeleton h-4 w-3/4"></div>
									<div className="skeleton h-3 w-1/2"></div>
								</div>
							</div>
						</div>
					</div>
				))}
			</>
		) : authors.length === 0 ? (
			<div className="text-center py-12 md:col-span-2">
				<p className="text-base-content/60">
					No authors found for "{searchQuery}"
				</p>
			</div>
		) : (
			<>
				{authors.map((author) => (
					<AuthorCard key={author.id} author={author} />
				))}
				{hasNextPage && (
					<div className="text-center py-8 md:col-span-2">
						<button
							onClick={onLoadMore}
							disabled={isFetchingNextPage}
							className="btn btn-outline"
						>
							{isFetchingNextPage ? (
								<span className="loading loading-spinner loading-sm"></span>
							) : (
								"Load More Authors"
							)}
						</button>
					</div>
				)}
				{!hasNextPage && authors.length > 0 && (
					<div className="text-center py-8 md:col-span-2">
						<p className="text-base-content/50">No more authors to load</p>
					</div>
				)}
			</>
		)}
	</div>
);

export default AuthorsGrid;