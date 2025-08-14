import { bookIndex, userLibraryStore } from "@repo/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import BookCover from "../BookCover";
import Modal from "../Modal";
import SignInForm from "../SignInForm";
import SignUpForm from "../SignUpForm";
import { useAuthContext } from "../../providers/useAuthContext";
import { useNavigate } from "@tanstack/react-router";

const FeaturedBooksSection = () => {
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
	const { user } = useAuthContext();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: featuredBooks, isLoading } = useQuery({
		queryKey: ["featured-books"],
		queryFn: () => {
			return bookIndex({
				query: {
					skip: 0,
					take: 6,
					sort_order: "desc",
					sort_by: "average_rating",
				},
			});
		},
	});

	const addToLibraryMutation = useMutation({
		mutationFn: (bookId: string) =>
			userLibraryStore({
				body: {
					book_id: bookId,
					status: "want-to-read" as const,
				},
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["featured-books"] });
		},
		onError: (error: Error) => {
			console.error("Failed to add book to library:", error);
		},
	});

	const handleAddBook = (bookId: string) => {
		if (!user) {
			setAuthMode("signin");
			setIsAuthModalOpen(true);
			return;
		}
		addToLibraryMutation.mutate(bookId);
	};

	const handleNavToBookDetail = (bookId: string) => {
		navigate({ to: `/books/${bookId}` });
	};

	const handleAuthSuccess = () => {
		setIsAuthModalOpen(false);
	};

	const handleSwitchToSignUp = () => {
		setAuthMode("signup");
	};

	const handleSwitchToSignIn = () => {
		setAuthMode("signin");
	};

	if (isLoading) {
		return (
			<section className="py-16 bg-base-100">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4">Featured Books</h2>
						<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
							Discover our handpicked collection of must-read books that are
							trending and loved by readers worldwide.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{Array.from({ length: 6 }).map((_, idx) => (
							<div key={idx} className="bg-base-200 rounded-lg shadow-md p-4">
								<div className="flex gap-4">
									<div className="skeleton w-[120px] h-[180px]"></div>
									<div className="flex-1 space-y-3">
										<div className="skeleton h-4 w-full"></div>
										<div className="skeleton h-3 w-3/4"></div>
										<div className="skeleton h-3 w-1/2"></div>
										<div className="skeleton h-16 w-full"></div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 bg-base-100">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold mb-4">Featured Books</h2>
					<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
						Discover our handpicked collection of must-read books that are
						trending and loved by readers worldwide.
					</p>
				</div>

				<div className="flex gap-6 justify-center flex-wrap">
					{featuredBooks?.data?.data?.slice(0, 6).map((book) => (
						<div
							key={book.id}
							className="bg-base-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 w-[180px] flex-shrink-0 flex flex-col"
						>
							<BookCover
								className="w-full h-[240px] mb-3 cursor-pointer"
								title={book.title}
								src={book.cover_image_url || undefined}
								onClick={() => handleNavToBookDetail(book.id)}
							/>
							
							{/* Title section - fixed height */}
							<div className="mb-3 h-[32px] flex items-start">
								<h3 className="font-medium text-sm line-clamp-2 leading-tight">
									<a href={`/books/${book.id}`} className="hover:text-primary">
										{book.title}
									</a>
								</h3>
							</div>
							
							{/* Author section - fixed height */}
							<div className="mb-4 h-[16px] flex items-center">
								<p className="text-xs text-base-content/70 truncate">
									by{" "}
									<a href={`/authors/${book.authors?.[0]?.id}`} className="hover:text-primary">
										{book.authors?.[0]?.name || "Unknown Author"}
									</a>
								</p>
							</div>
							
							{/* Rating and Action section - always at bottom */}
							<div className="mt-auto">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-1">
										<div className="mask mask-star bg-warning w-3 h-3"></div>
										<span className="text-xs text-base-content/70">
											{book.average_rating.toFixed(1) || "N/A"}
										</span>
									</div>
									<button
										className={`btn btn-xs ${book.user_data?.reading_status ? 'btn-success' : 'btn-primary'}`}
										onClick={() => handleAddBook(book.id)}
										disabled={book.user_data?.reading_status ? true : (addToLibraryMutation.isPending && addToLibraryMutation.variables === book.id)}
									>
										{addToLibraryMutation.isPending && addToLibraryMutation.variables === book.id ? (
											<span className="loading loading-spinner loading-xs"></span>
										) : book.user_data?.reading_status ? (
											"In Library"
										) : (
											"Add"
										)}
									</button>
								</div>
							</div>
						</div>
					)) || []}
				</div>

				<div className="text-center mt-12">
					<a href="/browse" className="btn btn-primary btn-lg">
						View All Books
					</a>
				</div>

				<Modal
					isOpen={isAuthModalOpen}
					onClose={() => setIsAuthModalOpen(false)}
					title={
						authMode === "signin"
							? "Sign In to Add Books"
							: "Sign Up to Add Books"
					}
				>
					{authMode === "signin" ? (
						<SignInForm
							onSignInSuccess={handleAuthSuccess}
							onSwitchToSignUp={handleSwitchToSignUp}
						/>
					) : (
						<SignUpForm onSignUpSuccess={handleAuthSuccess} />
					)}
					{authMode === "signup" && (
						<div className="text-center mt-4">
							<p className="text-sm text-base-content/70">
								Already have an account?{" "}
								<button
									onClick={handleSwitchToSignIn}
									className="text-primary hover:underline font-medium"
								>
									Sign in
								</button>
							</p>
						</div>
					)}
				</Modal>
			</div>
		</section>
	);
};

export default FeaturedBooksSection;
