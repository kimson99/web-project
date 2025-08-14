import { type BookResource } from "@repo/api";
import BookCoverDetail from "./BookCoverDetail";
import LibraryActions from "./LibraryActions";
import type { User } from "../../providers/useAuth";

interface BookDetailCardProps {
	book: BookResource;
	user: User | undefined;
}

const BookDetailCard = ({ book, user }: BookDetailCardProps) => (
	<div className="card bg-base-100 shadow-xl sticky top-8">
		<div className="card-body p-6">
			{/* Book Cover */}
			<div className="mb-4">
				<BookCoverDetail
					title={book.title}
					src={book.cover_image_url}
					className="w-48 shadow-lg rounded-lg"
				/>
			</div>

			{/* Title */}
			<h2 className="card-title text-xl font-bold leading-tight mb-2">
				{book.title}
			</h2>

			{/* Authors */}
			<p className="text-base-content/70 mb-3">
				by {book.authors.map((author) => author.name).join(", ")}
			</p>

			{/* Rating */}
			<div className="flex items-center gap-2 mb-4">
				<div className="rating rating-sm">
					<div
						className={`mask mask-star-2 w-4 h-4 bg-orange-400`}
						aria-checked="true"
					></div>
				</div>
				<span className="font-semibold text-sm">
					{book.average_rating.toFixed(1)}
				</span>
			</div>

			{/* Library Actions */}
			{user && <LibraryActions book={book} />}
		</div>
	</div>
);

export default BookDetailCard;
