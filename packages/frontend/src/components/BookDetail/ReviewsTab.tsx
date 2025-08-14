import { type ReviewResource } from "@repo/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Avatar from "../Avatar";
import WriteReviewForm from "./WriteReviewForm";
import type { User } from "../../providers/useAuth";

dayjs.extend(relativeTime);

interface ReviewsTabProps {
	reviews: ReviewResource[];
	user: User | undefined;
	bookId: string;
}

const ReviewsTab = ({ reviews, user, bookId }: ReviewsTabProps) => {
	// Find user's existing review for this book
	const userReview = user ? reviews.find(review => review.user?.id === user.id) : undefined;

	return (
		<div className="space-y-6">
			{user && <WriteReviewForm bookId={bookId} existingReview={userReview} />}

		{/* Reviews List */}
		<div className="space-y-4">
			{reviews.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-base-content/60">
						No reviews yet. Be the first to review this book!
					</p>
				</div>
			) : (
				reviews.map((review) => (
					<div key={review.id} className="card bg-base-100 border">
						<div className="card-body">
							<div className="flex items-start gap-3">
								<Avatar
									name={review.user?.name || "Anonymous"}
									src={review.user?.avatar_path || null}
									className="w-10"
								/>
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<span className="font-medium">
											{review.user?.name || "Anonymous"}
										</span>
										<div className="rating rating-sm">
											{[1, 2, 3, 4, 5].map((star) => (
												<div
													key={star}
													className={`mask mask-star-2 w-3 h-3 ${
														star <= (review?.rating ?? 0)
															? "bg-orange-400"
															: "bg-gray-300"
													}`}
													aria-current={
														star === review.rating ? "true" : undefined
													}
												></div>
											))}
										</div>
										<span className="text-xs text-base-content/50">•</span>
										<span className="text-xs text-base-content/70">
											{dayjs(review.created_at).fromNow()}
										</span>
									</div>
									<p className="text-base-content/80">{review.content}</p>
								</div>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	</div>
	);
};

export default ReviewsTab;
