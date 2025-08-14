import { useQuery } from "@tanstack/react-query";
import { bookIndex, type BookResource } from "@repo/api";
import BookCard from "../Browse/BookCard";

interface SimilarBooksProps {
	book: BookResource;
}

const SimilarBooks = ({ book }: SimilarBooksProps) => {
	const genreNames = book.genres?.map(genre => genre.name) || [];
	
	const { data: similarBooks, isLoading, error } = useQuery({
		queryKey: ["similar-books", book.id, genreNames],
		queryFn: () => bookIndex({
			query: {
				genres: genreNames,
				take: 8,
				skip: 0,
			},
		}),
		enabled: genreNames.length > 0,
	});

	if (isLoading) {
		return (
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Similar Books</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="skeleton h-64 w-full"></div>
					))}
				</div>
			</div>
		);
	}

	if (error || !similarBooks?.data?.data) {
		return null;
	}

	const filteredBooks = similarBooks.data.data.filter(
		(similarBook: BookResource) => similarBook.id !== book.id
	);

	if (filteredBooks.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Similar Books</h3>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{filteredBooks.slice(0, 4).map((similarBook: BookResource) => (
					<BookCard key={similarBook.id} book={similarBook} />
				))}
			</div>
		</div>
	);
};

export default SimilarBooks;