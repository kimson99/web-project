import { type BookResource } from "@repo/api";
import BookDetailCard from "./BookDetailCard";
import BookInfo from "./BookInfo";
import type { User } from "../../providers/useAuth";

interface BookHeaderProps {
	book: BookResource;
	user: User | undefined;
	reviewsCount: number;
}

const BookHeader = ({ book, user, reviewsCount }: BookHeaderProps) => (
	<div className="flex flex-col lg:flex-row gap-8 mb-8">
		{/* Column 1: Book Card - Keep it small */}
		<div className="lg:w-80 flex-shrink-0">
			<BookDetailCard book={book} user={user} />
		</div>

		{/* Column 2: Book Info - Takes remaining space */}
		<div className="flex-1">
			<BookInfo book={book} reviewsCount={reviewsCount} />
		</div>
	</div>
);

export default BookHeader;
