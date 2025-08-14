import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { bookShow, reviewIndex, type BookResource } from "@repo/api";
import { useAuthContext } from "../../providers/useAuthContext";
import BookDetailCard from "../../components/BookDetail/BookDetailCard";
import BookInfo from "../../components/BookDetail/BookInfo";
import BookTabs from "../../components/BookDetail/BookTabs";
import OverviewTab from "../../components/BookDetail/OverviewTab";
import ReviewsTab from "../../components/BookDetail/ReviewsTab";

const BookDetail = () => {
	const { bookId } = Route.useParams();
	const { user } = useAuthContext();
	const [activeTab, setActiveTab] = useState<"overview" | "reviews">(
		"overview"
	);

	// Fetch book details
	const {
		data: book,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["book", bookId],
		queryFn: () => bookShow({ path: { book: bookId } }),
	});

	// Fetch book reviews
	const { data: reviewsData } = useQuery({
		queryKey: ["book-reviews", bookId],
		queryFn: () =>
			reviewIndex({
				query: {
					book_id: bookId,
					skip: 0,
					take: 10,
				},
			}),
		enabled: !!bookId,
	});

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Cover Skeleton */}
						<div className="lg:w-1/3">
							<div className="skeleton w-full h-96 rounded-lg"></div>
						</div>
						{/* Content Skeleton */}
						<div className="lg:w-2/3 space-y-4">
							<div className="skeleton h-8 w-3/4"></div>
							<div className="skeleton h-6 w-1/2"></div>
							<div className="skeleton h-4 w-full"></div>
							<div className="skeleton h-4 w-full"></div>
							<div className="skeleton h-4 w-2/3"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !book?.data) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
					<p className="text-base-content/70">
						Sorry, we couldn't find the book you're looking for.
					</p>
					<a href="/browse" className="btn btn-primary mt-4">
						Browse Books
					</a>
				</div>
			</div>
		);
	}

	const bookData = book.data as BookResource;
	const reviews = reviewsData?.data?.data || [];

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Column 1: Book Card - Keep it small */}
					<div className="lg:w-80 flex-shrink-0">
						<BookDetailCard book={bookData} user={user} />
					</div>

					{/* Column 2: Book Info + Tabs - Takes remaining space */}
					<div className="flex-1 space-y-6">
						<BookInfo book={bookData} reviewsCount={reviews.length} />

						<div className="bg-base-100 shadow-xl rounded-lg">
							<BookTabs
								activeTab={activeTab}
								onTabChange={setActiveTab}
								reviewsCount={reviews.length}
							/>

							<div className="border-t border-base-300 p-6">
								{activeTab === "overview" && <OverviewTab book={bookData} />}
								{activeTab === "reviews" && (
									<ReviewsTab reviews={reviews} user={user} bookId={bookId} />
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Route = createFileRoute("/books/$bookId")({
	component: BookDetail,
});
