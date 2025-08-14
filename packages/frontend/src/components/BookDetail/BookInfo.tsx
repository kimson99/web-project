import { type BookResource } from "@repo/api";
import Avatar from "../Avatar";

interface BookInfoProps {
	book: BookResource;
	reviewsCount: number;
}

const BookInfo = ({ book, reviewsCount }: BookInfoProps) => (
	<div className="bg-base-100 p-6 rounded-lg shadow-xl h-fit">
		<div className="space-y-6">
			{/* Basic Stats */}
			<div className="flex flex-wrap items-center gap-4">
				{book.published_year && (
					<div className="badge badge-outline">
						Published {book.published_year}
					</div>
				)}

				{book.num_pages && (
					<div className="badge badge-outline">{book.num_pages} pages</div>
				)}

				<div className="badge badge-outline">{reviewsCount} reviews</div>
			</div>
			{/* Genres */}
			{book.genres && book.genres.length > 0 && (
				<div>
					<h3 className="text-lg font-semibold mb-3">Genres</h3>
					<div className="flex flex-wrap gap-2">
						{book.genres.map((genre) => (
							<span key={genre.id} className="badge badge-primary">
								{genre.name}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Authors */}
			<div>
				<h3 className="text-lg font-semibold mb-3">
					{book.authors.length > 1 ? "Authors" : "Author"}
				</h3>
				<div className="space-y-3">
					{book.authors.map((author) => (
						<div key={author.id} className="flex items-center gap-3">
							<Avatar
								name={author.name}
								src={author.avatar_image_path}
								className="w-12"
							/>
							<div>
								<div className="font-medium">{author.name}</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div>
				<span className="font-medium">Published: </span>
				<span className="ml-2 text-base-content/70">
					{book.published_year ? book.published_year : "N/A"}
				</span>
			</div>

			{/* Description */}
			<div>
				<h3 className="text-lg font-semibold mb-3">Description</h3>
				<p className="text-base-content/80 leading-relaxed">
					{book.description ? book.description : "N/A"}
				</p>
			</div>
		</div>
	</div>
);

export default BookInfo;
