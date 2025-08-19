import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { userProfile } from "@repo/api";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import Avatar from "../../components/Avatar";
import BookCover from "../../components/BookCover";

dayjs.extend(relativeTime);

export const Route = createFileRoute("/profiles/$userId")({
	component: ProfilePage,
});

function ProfilePage() {
	const { userId } = Route.useParams();
	const navigate = useNavigate();

	const {
		data: profile,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user-profile", userId],
		queryFn: async () => {
			const response = await userProfile({
				path: { userId },
			});
			if (response.error) {
				throw new Error("Failed to fetch user profile");
			}
			return response.data;
		},
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-64">
				<LoadingSpinner />
			</div>
		);
	}

	if (error || !profile) {
		return (
			<div className="flex flex-col items-center justify-center min-h-64 text-center">
				<h2 className="text-2xl font-bold text-base-content mb-2">
					User Not Found
				</h2>
				<p className="text-base-content/70">
					The user profile you're looking for doesn't exist.
				</p>
			</div>
		);
	}

	const { reading_stats, recent_activity } = profile;

	const handleBookClick = (bookId: string) => {
		navigate({ to: `/books/${bookId}` });
	};

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			{/* Profile Header */}
			<div className="bg-base-100 rounded-lg shadow-sm border border-base-300 p-6 mb-8">
				<div className="flex items-center space-x-6">
					<Avatar
						name={profile.name}
						src={profile.avatar_path}
						className="w-20"
					/>
					<div>
						<h1 className="text-3xl font-bold text-base-content">
							{profile.name}
						</h1>
						<p className="text-base-content/70 mt-1">
							Member since {dayjs(profile.created_at).format("MMMM YYYY")}
						</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Reading Statistics */}
				<div className="lg:col-span-1">
					<div className="bg-base-100 rounded-lg shadow-sm border border-base-300 p-6">
						<h2 className="text-xl font-semibold text-base-content mb-4">
							Reading Statistics
						</h2>
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="text-base-content/70">Total Books</span>
								<span className="font-semibold text-base-content">
									{reading_stats.total_books}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-base-content/70">Books Read</span>
								<span className="font-semibold text-success">
									{reading_stats.books_read}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-base-content/70">Currently Reading</span>
								<span className="font-semibold text-info">
									{reading_stats.books_reading}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-base-content/70">Want to Read</span>
								<span className="font-semibold text-warning">
									{reading_stats.books_want_to_read}
								</span>
							</div>
							<div className="divider my-4"></div>
							<div className="flex justify-between items-center">
								<span className="text-base-content/70">Total Reviews</span>
								<span className="font-semibold text-base-content">
									{reading_stats.total_reviews}
								</span>
							</div>
							{reading_stats.average_rating && (
								<div className="flex justify-between items-center">
									<span className="text-base-content/70">Average Rating</span>
									<div className="flex items-center justify-end space-x-1">
										<div className="mask mask-star bg-warning w-4 h-4"></div>
										<span className="font-semibold text-base-content">
											{reading_stats.average_rating}
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="lg:col-span-2">
					<div className="space-y-8">
						{/* Recent Reviews */}
						{recent_activity?.recent_reviews &&
							recent_activity.recent_reviews.length > 0 && (
								<div className="bg-base-100 rounded-lg shadow-sm border border-base-300 p-6">
									<h2 className="text-xl font-semibold text-base-content mb-4">
										Recent Reviews
									</h2>
									<div className="space-y-4">
										{recent_activity?.recent_reviews.map((review) => (
											<div
												key={review.id}
												className="w-full rounded-lg bg-base-200 p-4"
											>
												<div className="flex">
													<BookCover
														className="min-w-[80px] min-h-[120px] cursor-pointer hover:opacity-80 transition-opacity"
														title={review.book?.title || "Unknown Book"}
														src={review.book?.cover_image_url || undefined}
														onClick={() =>
															review.book?.id && handleBookClick(review.book.id)
														}
													/>
													<div className="ml-4 flex-1">
														<div className="flex gap-2 items-center mb-2">
															<div
																className="text-lg font-semibold text-base-content cursor-pointer hover:text-primary transition-colors"
																onClick={() =>
																	review.book?.id &&
																	handleBookClick(review.book.id)
																}
															>
																{review.book?.title || "Unknown Book"}
															</div>
															<div className="rating rating-xs">
																{[1, 2, 3, 4, 5].map((idx) => (
																	<div
																		key={idx}
																		className={`mask mask-star ${
																			idx <= (review.rating || 0)
																				? "bg-warning"
																				: "bg-base-300"
																		}`}
																		aria-label={`${idx} star`}
																	/>
																))}
															</div>
														</div>
														<div className="flex items-center gap-2 mb-2">
															<span className="text-xs text-base-content/70">
																{dayjs(review.created_at).fromNow()}
															</span>
														</div>
														{review.content && (
															<div className="text-sm text-base-content/70">
																<p className="leading-relaxed line-clamp-3">
																	{review.content}
																</p>
															</div>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

						{/* Recent Library Activity */}
						{recent_activity?.recent_books &&
							recent_activity.recent_books.length > 0 && (
								<div className="bg-base-100 rounded-lg shadow-sm border border-base-300 p-6">
									<h2 className="text-xl font-semibold text-base-content mb-4">
										Recent Library Activity
									</h2>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										{recent_activity.recent_books.map((userBook) => (
											<div
												key={userBook.id}
												className="flex items-center space-x-3"
											>
												<BookCover
													src={userBook.book?.cover_image_url || undefined}
													title={userBook.book?.title || "Unknown Book"}
													className="min-w-[30px] h-[45px] cursor-pointer hover:opacity-80 transition-opacity"
													onClick={() =>
														userBook.book?.id &&
														handleBookClick(userBook.book.id)
													}
												/>
												<div className="flex-1 min-w-0">
													<h4
														className="font-medium text-base-content truncate cursor-pointer hover:text-primary transition-colors"
														onClick={() =>
															userBook.book?.id &&
															handleBookClick(userBook.book.id)
														}
													>
														{userBook.book?.title || "Unknown Book"}
													</h4>
													<div className="flex items-center space-x-2 text-sm">
														<span
															className={`capitalize px-2 py-1 rounded text-xs font-medium ${
																userBook.status === "read"
																	? "bg-success/10 text-success"
																	: userBook.status === "reading"
																		? "bg-info/10 text-info"
																		: userBook.status === "want_to_read"
																			? "bg-warning/10 text-warning"
																			: "bg-base-200 text-base-content"
															}`}
														>
															{userBook.status.replaceAll("-", " ")}
														</span>
														<span className="text-base-content/50">
															{dayjs(userBook.updated_at).fromNow()}
														</span>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
					</div>
				</div>
			</div>
		</div>
	);
}
