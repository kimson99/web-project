import { bookIndex, reviewIndex, type ReviewResource } from "@repo/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Avatar from "../Avatar";
import { cn } from "../../libs/utils";
import BookCover from "../BookCover";

interface ReviewCardProps {
	review: ReviewResource;
}

interface RatingProps {
	activeIdx: number;
	className?: string;
}

const Rating = ({ activeIdx, className }: RatingProps) => {
	return (
		<div className={cn(className, "rating rating-xs")}>
			{[1, 2, 3, 4, 5].map((idx) => (
				<div
					key={idx}
					className="mask mask-star bg-warning"
					aria-label={`${idx} star`}
					aria-current={idx === activeIdx ? "true" : undefined}
				></div>
			))}
		</div>
	);
};

interface BookCardProps {
	book: {
		id: string;
		title: string;
		average_rating?: number;
	};
}

const BookCard = ({ book }: BookCardProps) => {
	const rating = book.average_rating || 0;

	return (
		<div className="w-full rounded-lg bg-base-200 flex gap-3 p-3">
			<BookCover title={book.title} src={book.cover_image_url} />
			<div className="flex-1 min-w-0">
				<div className="text-sm font-medium line-clamp-2 leading-tight">
					{book.title}
				</div>
				<div className="flex items-center gap-1 mt-1">
					<div className="mask mask-star bg-warning w-3 h-3"></div>
					<span className="text-xs text-base-content/70">
						{rating.toFixed(1)}
					</span>
				</div>
			</div>
		</div>
	);
};

const ReviewCard = ({ review }: ReviewCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const contentLength = review.content.length;
	const shouldShowReadMore = contentLength > 500;

	return (
		<div className="w-full rounded-lg bg-base-200 flex flex-col justify-center py-4">
			<div className="flex">
				<BookCover
					className="min-w-[80px] min-h-[120px]"
					title={review.book?.title || ""}
					src={review.book.cover_image_url}
				/>

				<div className="ml-4 flex-1">
					<div className="flex gap-2 items-center mb-2">
						<div className="text-lg font-semibold">{review.book?.title}</div>
						<Rating activeIdx={parseInt(review.user?.rating || "0")} />
					</div>
					<div className="flex items-center gap-2 mb-2">
						<Avatar
							name={review.user?.name || ""}
							src={review.user?.avatar_path || ""}
							className="w-5"
							textClassName="text-xs"
						/>
						<div className="text-sm">{review.user?.name}</div>
					</div>

					<div className="text-sm text-base-content/70">
						<p
							className={cn(
								"leading-relaxed",
								!isExpanded && shouldShowReadMore && "line-clamp-2"
							)}
						>
							{review.content}
						</p>
						{shouldShowReadMore && (
							<button
								onClick={() => setIsExpanded(!isExpanded)}
								className="text-primary hover:text-primary-focus text-xs font-medium mt-1 transition-colors"
							>
								{isExpanded ? "Read less" : "Read more"}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const LatestBookReviewSection = () => {
	const { data: reviews } = useQuery({
		queryKey: ["reviews"],
		queryFn: () => {
			return reviewIndex({
				query: { skip: 0, take: 5, sort_order: "desc", sort_by: "created_at" },
			});
		},
	});

	const { data: popularBooks } = useQuery({
		queryKey: ["popular-books"],
		queryFn: () => {
			return bookIndex({
				query: {
					skip: 0,
					take: 8,
					sort_order: "desc",
					sort_by: "average_rating",
				},
			});
		},
	});

	return (
		<div className="bg-base-100 px-8">
			<div className="flex flex-col md:flex-row pt-4 gap-8">
				<div className="flex-1">
					<h1 className="pt-4 text-2xl font-semibold">Latest Reviews</h1>
					<div className="flex flex-col gap-4">
						{reviews?.data?.data.map((review) => (
							<ReviewCard key={review.id} review={review} />
						))}
					</div>
				</div>
				<div className="md:w-1/5">
					<h1 className="pt-4 text-2xl font-semibold">Popular Books</h1>
					<div className="flex flex-col gap-4">
						{popularBooks?.data?.data.map((book) => (
							<BookCard key={book.id} book={book} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LatestBookReviewSection;
