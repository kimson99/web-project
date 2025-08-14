import { type BookResource } from "@repo/api";

interface BookCardProps {
	book: BookResource;
}

const BookCard = ({ book }: BookCardProps) => (
	<a
		href={`/books/${book.id}`}
		className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
	>
		<div className="card-body p-4">
			<div className="flex gap-4">
				{book.cover_image_url ? (
					<div className="w-16 h-24 bg-base-200 rounded flex-shrink-0">
						<img
							src={book.cover_image_url}
							alt={book.title}
							className="w-full h-full object-cover rounded"
							onError={(e) => {
								e.currentTarget.style.display = "none";
							}}
						/>
					</div>
				) : (
					<div className="w-16 h-24 bg-base-200 rounded flex-shrink-0 flex items-center justify-center">
						<span className="text-xs text-base-content/50">No Cover</span>
					</div>
				)}
				<div className="flex-1">
					<h3 className="font-semibold text-lg">{book.title}</h3>
					<p className="text-base-content/70 mb-1">
						by{" "}
						{book.authors.map((author) => author.name).join(", ") ||
							"Unknown Author"}
					</p>
					<div className="flex items-center gap-2 mb-2">
						<div className="flex items-center gap-1">
							<div className="mask mask-star bg-warning w-4 h-4"></div>
							<span className="text-sm text-base-content/70">
								{book.average_rating.toFixed(1)}
							</span>
						</div>
						{book.published_year && (
							<span className="text-sm text-base-content/60">
								• {book.published_year}
							</span>
						)}
						{book.num_pages && (
							<span className="text-sm text-base-content/60">
								• {book.num_pages} pages
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	</a>
);

export default BookCard;
