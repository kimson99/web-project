import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewStore, reviewUpdate, type ReviewResource } from "@repo/api";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

interface WriteReviewFormProps {
	bookId: string;
	existingReview?: ReviewResource;
}

const WriteReviewForm = ({ bookId, existingReview }: WriteReviewFormProps) => {
	const [rating, setRating] = useState(existingReview?.rating || 0);
	const [content, setContent] = useState(existingReview?.content || "");
	const [hoveredRating, setHoveredRating] = useState(0);
	const queryClient = useQueryClient();

	const submitReviewMutation = useMutation({
		mutationFn: () => {
			if (existingReview) {
				// Update existing review
				return reviewUpdate({
					path: {
						review: existingReview.id,
					},
					body: {
						rating: rating,
						content: content.trim() || undefined,
					},
				});
			} else {
				// Create new review
				return reviewStore({
					body: {
						book_id: bookId,
						rating: rating,
						content: content.trim() || undefined,
					},
				});
			}
		},
		onSuccess: () => {
			// Only reset form for new reviews, not updates
			if (!existingReview) {
				setRating(0);
				setContent("");
				setHoveredRating(0);
			}
			// Refetch reviews and book data
			queryClient.invalidateQueries({ queryKey: ["book", bookId] });
			queryClient.invalidateQueries({ queryKey: ["book-reviews", bookId] });
			// Show success toast
			toast.success(
				existingReview
					? "Review updated successfully!"
					: "Review submitted successfully!"
			);
		},
		onError: (error: AxiosError | Error) => {
			console.error("Failed to submit review:", error);
			if ("response" in error && error?.response?.status === 409) {
				toast.error(
					"You have already reviewed this book. Please refresh the page to edit your existing review."
				);
			} else {
				toast.error(
					existingReview
						? "Failed to update review. Please try again."
						: "Failed to submit review. Please try again."
				);
			}
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (rating > 0) {
			submitReviewMutation.mutate();
		}
	};

	const isSubmitDisabled = rating === 0 || submitReviewMutation.isPending;

	return (
		<div className="card bg-base-200">
			<div className="card-body">
				<h4 className="font-semibold mb-3">
					{existingReview ? "Edit Your Review" : "Write a Review"}
				</h4>
				<form onSubmit={handleSubmit}>
					<div className="form-control">
						<div className="flex items-center gap-3 mb-4">
							<span>
								Your Rating: <span className="text-error">*</span>
							</span>
							<div className="rating">
								{[1, 2, 3, 4, 5].map((star) => (
									<input
										key={star}
										type="radio"
										name="review-rating"
										className={`mask mask-star-2 cursor-pointer transition-colors bg-orange-400 ${
											star <= (hoveredRating || rating)
												? "bg-orange-400"
												: "bg-base-300"
										}`}
										checked={rating === star}
										onChange={() => setRating(star)}
										onMouseEnter={() => setHoveredRating(star)}
										onMouseLeave={() => setHoveredRating(0)}
									/>
								))}
							</div>
							{rating > 0 && (
								<span className="text-sm text-base-content/70">
									({rating} star{rating !== 1 ? "s" : ""})
								</span>
							)}
						</div>
						<textarea
							className="textarea textarea-bordered w-full"
							placeholder="Share your thoughts about this book... (optional)"
							rows={4}
							value={content}
							onChange={(e) => setContent(e.target.value)}
							disabled={submitReviewMutation.isPending}
						/>
						<div className="card-actions justify-end mt-4">
							<button
								type="submit"
								className="btn btn-primary"
								disabled={isSubmitDisabled}
							>
								{submitReviewMutation.isPending ? (
									<>
										<span className="loading loading-spinner loading-sm"></span>
										Submitting...
									</>
								) : existingReview ? (
									"Update Review"
								) : (
									"Submit Review"
								)}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default WriteReviewForm;
