import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";

import BookCover from "../components/BookCover";
import {
	FaDeleteLeft,
	FaChevronDown,
	FaBookOpen,
	FaBookOpenReader,
	FaRegCircleCheck,
	FaPen,
} from "react-icons/fa6";
import {
	userLibraryIndex,
	userLibraryUpdate,
	userLibraryDestroy,
	type UserBookResource,
} from "@repo/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const Route = createFileRoute("/my-library")({
	component: MyLibraryPage,
});

enum ReadingStatus {
	WANT_TO_READ = "want-to-read",
	READING = "reading",
	FINISHED = "finished",
}

type StatusFilter = "all" | ReadingStatus;

function MyLibraryPage() {
	const [activeTab, setActiveTab] = useState<StatusFilter>("all");
	const [searchQuery, setSearchQuery] = useState("");

	const {
		data: libraryBooks,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user-library"],
		queryFn: () => userLibraryIndex({}),
	});

	const filteredBooks = useMemo(() => {
		if (!libraryBooks?.data?.data) return [];

		let filtered = libraryBooks.data.data;

		// Filter by status
		if (activeTab !== "all") {
			filtered = filtered.filter(
				(userBook: UserBookResource) => userBook.status === activeTab
			);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			filtered = filtered.filter((userBook: UserBookResource) => {
				const title = userBook.book.title.toLowerCase();
				const authors = userBook.book.authors
					?.map((author) => author.name.toLowerCase())
					.join(" ") || "";
				
				return title.includes(query) || authors.includes(query);
			});
		}

		return filtered;
	}, [libraryBooks?.data?.data, activeTab, searchQuery]);

	const getStatusCounts = useMemo(() => {
		if (!libraryBooks?.data?.data)
			return {
				all: 0,
				[ReadingStatus.WANT_TO_READ]: 0,
				[ReadingStatus.READING]: 0,
				[ReadingStatus.FINISHED]: 0,
			};

		const counts = libraryBooks.data.data.reduce(
			(acc, userBook: UserBookResource) => {
				acc.all++;
				const status = userBook.status as ReadingStatus;
				if (status in acc) {
					acc[status]++;
				}
				return acc;
			},
			{
				all: 0,
				[ReadingStatus.WANT_TO_READ]: 0,
				[ReadingStatus.READING]: 0,
				[ReadingStatus.FINISHED]: 0,
			}
		);

		return counts;
	}, [libraryBooks?.data?.data]);

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-8">My Library</h1>
				<div className="flex space-x-1 mb-8">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="bg-gray-300 h-12 w-24 rounded animate-pulse"
						></div>
					))}
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
					{Array.from({ length: 10 }).map((_, i) => (
						<div key={i} className="animate-pulse">
							<div className="bg-gray-300 aspect-[3/4] rounded-lg mb-3"></div>
							<div className="bg-gray-300 h-4 rounded mb-2"></div>
							<div className="bg-gray-300 h-3 rounded w-3/4 mb-2"></div>
							<div className="bg-gray-300 h-6 rounded w-20"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-8">My Library</h1>
				<div className="alert alert-error">
					<span>Failed to load your library. Please try again.</span>
				</div>
			</div>
		);
	}

	if (!libraryBooks?.data?.data || libraryBooks.data.data.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-8">My Library</h1>
				<div className="text-center py-16">
					<div className="text-6xl mb-4">📚</div>
					<h3 className="text-xl font-semibold mb-2">Your library is empty</h3>
					<p className="text-gray-600 mb-6">
						Start building your collection by adding books you want to read!
					</p>
					<a href="/browse" className="btn btn-primary">
						Browse Books
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">My Library</h1>
			
			{/* Search Bar */}
			<div className="mb-6">
				<div className="form-control w-full max-w-md">
					<div className="relative">
						{/* Search Icon - Left */}
						<div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
							<svg className="w-4 h-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
						
						{/* Input */}
						<input
							type="text"
							placeholder="Search books and authors..."
							className="input input-bordered w-full pl-10 pr-10"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						
						{/* Clear Button - Right (only when there's text) */}
						{searchQuery && (
							<button
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content z-10"
								onClick={() => setSearchQuery("")}
								title="Clear search"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Status Filter Tabs */}
			<div className="tabs tabs-boxed mb-8 bg-base-200 p-1">
				<button
					className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
					onClick={() => setActiveTab("all")}
				>
					All ({getStatusCounts.all})
				</button>
				<button
					className={`tab ${activeTab === ReadingStatus.WANT_TO_READ ? "tab-active" : ""}`}
					onClick={() => setActiveTab(ReadingStatus.WANT_TO_READ)}
				>
					Want to Read ({getStatusCounts[ReadingStatus.WANT_TO_READ]})
				</button>
				<button
					className={`tab ${activeTab === ReadingStatus.READING ? "tab-active" : ""}`}
					onClick={() => setActiveTab(ReadingStatus.READING)}
				>
					Reading ({getStatusCounts[ReadingStatus.READING]})
				</button>
				<button
					className={`tab ${activeTab === ReadingStatus.FINISHED ? "tab-active" : ""}`}
					onClick={() => setActiveTab(ReadingStatus.FINISHED)}
				>
					Finished ({getStatusCounts[ReadingStatus.FINISHED]})
				</button>
			</div>

			{/* Books Grid */}
			{filteredBooks.length === 0 ? (
				<div className="text-center py-16">
					<div className="text-4xl mb-4">
						{searchQuery.trim() ? "🔍" : "📖"}
					</div>
					<h3 className="text-lg font-semibold mb-2">
						{searchQuery.trim() 
							? `No books found for "${searchQuery}"`
							: `No books in "${getStatusDisplayText(activeTab)}"`
						}
					</h3>
					<p className="text-gray-600">
						{searchQuery.trim() ? (
							<>
								Try searching for a different book title or author name.
								<br />
								<button 
									className="btn btn-sm btn-outline mt-2"
									onClick={() => setSearchQuery("")}
								>
									Clear search
								</button>
							</>
						) : (
							<>
								{activeTab === ReadingStatus.WANT_TO_READ &&
									"Add books you want to read from the browse page!"}
								{activeTab === ReadingStatus.READING &&
									"Start reading some of your books!"}
								{activeTab === ReadingStatus.FINISHED &&
									"Finish reading some books to see them here!"}
								{activeTab === "all" &&
									"Your library is empty. Start adding books!"}
							</>
						)}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
					{filteredBooks.map((userBook: UserBookResource) => (
						<LibraryBookCard key={userBook.book.id} userBook={userBook} />
					))}
				</div>
			)}
		</div>
	);
}

function LibraryBookCard({ userBook }: { userBook: UserBookResource }) {
	const { book } = userBook;
	const queryClient = useQueryClient();
	const [showRemoveModal, setShowRemoveModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	const updateStatusMutation = useMutation({
		mutationFn: ({
			userBookId,
			status,
		}: {
			userBookId: string;
			status: ReadingStatus;
		}) =>
			userLibraryUpdate({
				path: { userBook: userBookId },
				body: { status },
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-library"] });
			toast.success("Status updated successfully!");
		},
		onError: () => {
			toast.error("Failed to update status");
		},
	});

	const removeFromLibraryMutation = useMutation({
		mutationFn: (userBookId: string) =>
			userLibraryDestroy({
				path: { userBook: userBookId },
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-library"] });
			toast.success("Book removed from library!");
			setShowRemoveModal(false);
		},
		onError: () => {
			toast.error("Failed to remove book");
		},
	});

	const handleStatusChange = (newStatus: ReadingStatus) => {
		updateStatusMutation.mutate({
			userBookId: userBook.id,
			status: newStatus,
		});
	};

	const handleRemoveFromLibrary = () => {
		removeFromLibraryMutation.mutate(userBook.id);
	};

	return (
		<div className="flex flex-col h-full bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-shadow pb-2">
			{/* Book Cover - clickable */}
			<a
				href={`/books/${book.id}`}
				className="block relative aspect-[3/4] mb-3"
			>
				<BookCover
					title={book.title}
					src={book.cover_image_url || undefined}
					className="w-full h-full object-cover rounded-lg"
				/>
			</a>

			{/* Book Info */}
			<div className="flex flex-col flex-1 px-1">
				{/* Title - clickable */}
				<a href={`/books/${book.id}`} className="block mb-2">
					<h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
						{book.title}
					</h3>
				</a>

				{/* Authors - clickable to author pages */}
				<div className="text-xs text-base-content/70 mb-2 line-clamp-1">
					by{" "}
					{book.authors?.map((author, index) => (
						<span key={author.id}>
							<a
								href={`/authors/${author.id}`}
								className="hover:text-primary transition-colors"
							>
								{author.name}
							</a>
							{index < book.authors.length - 1 ? ", " : ""}
						</span>
					)) || "Unknown"}
				</div>

				{/* Rating and Progress - same line */}
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<span className="text-yellow-500">⭐</span>
						<span className="text-xs text-base-content/80">
							{book.average_rating?.toFixed(1) || "0.0"}
						</span>
					</div>
					<div className="text-xs text-base-content/60">
						{book.num_pages 
							? `${Math.round(((userBook.current_page || 0) / book.num_pages) * 100)}%`
							: "0%"
						}
					</div>
				</div>

				{/* Status Dropdown */}
				<div className="mt-auto">
					<div className="dropdown dropdown-top dropdown-end w-full">
						<div
							tabIndex={0}
							role="button"
							className={`btn btn-sm btn-neutral ${getStatusBadgeClass(userBook.status)} w-full justify-between gap-2 cursor-pointer hover:brightness-110`}
						>
							<span className="text-xs">
								{getStatusDisplayText(userBook.status)}
							</span>
							<FaChevronDown className="w-3 h-3" />
						</div>
						<ul
							tabIndex={0}
							className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow-lg border border-base-300 mt-2"
						>
							{Object.values(ReadingStatus).map((status) => (
								<li key={status}>
									<button
										className={`text-sm justify-start gap-2 ${userBook.status === status ? "active" : ""}`}
										onClick={() => handleStatusChange(status)}
										disabled={updateStatusMutation.isPending}
									>
										{getStatusIcon(status)}
										{getStatusDisplayText(status)}
									</button>
								</li>
							))}
							<div className="divider my-1"></div>
							<li>
								<button
									className="text-sm justify-start gap-2"
									onClick={() => setShowEditModal(true)}
								>
									<FaPen className="w-4 h-4" />
									Edit Details
								</button>
							</li>
							<li>
								<button
									className="text-sm justify-start gap-2 text-error hover:bg-error/10"
									onClick={() => setShowRemoveModal(true)}
									disabled={removeFromLibraryMutation.isPending}
								>
									<FaDeleteLeft className="w-4 h-4" />
									Remove
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Remove Confirmation Modal */}
			{showRemoveModal && (
				<div className="modal modal-open">
					<div className="modal-box">
						<h3 className="font-bold text-lg">Remove from Library</h3>
						<p className="py-4">
							Are you sure you want to remove{" "}
							<span className="font-semibold">"{book.title}"</span> from your
							library?
						</p>
						<div className="modal-action">
							<button
								className="btn btn-ghost"
								onClick={() => setShowRemoveModal(false)}
								disabled={removeFromLibraryMutation.isPending}
							>
								Cancel
							</button>
							<button
								className={`btn btn-error ${removeFromLibraryMutation.isPending ? "loading" : ""}`}
								onClick={handleRemoveFromLibrary}
								disabled={removeFromLibraryMutation.isPending}
							>
								{removeFromLibraryMutation.isPending ? "Removing..." : "Remove"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Edit Details Modal */}
			{showEditModal && <EditBookModal userBook={userBook} onClose={() => setShowEditModal(false)} />}
		</div>
	);
}

function EditBookModal({ userBook, onClose }: { userBook: UserBookResource; onClose: () => void }) {
	const { book } = userBook;
	const queryClient = useQueryClient();
	
	const [formData, setFormData] = useState({
		status: userBook.status as ReadingStatus,
		current_page: userBook.current_page || 0,
		notes: userBook.notes || ""
	});

	const updateMutation = useMutation({
		mutationFn: (data: any) =>
			userLibraryUpdate({
				path: { userBook: userBook.id },
				body: data
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-library"] });
			toast.success("Book details updated successfully!");
			onClose();
		},
		onError: () => {
			toast.error("Failed to update book details");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateMutation.mutate(formData);
	};

	const progressPercentage = book.num_pages && formData.current_page 
		? Math.min((formData.current_page / book.num_pages) * 100, 100)
		: 0;

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-md">
				<h3 className="font-bold text-lg mb-4">Edit "{book.title}"</h3>
				
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Status */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">Reading Status</span>
						</label>
						<select 
							className="select select-bordered w-full"
							value={formData.status}
							onChange={(e) => setFormData({...formData, status: e.target.value as ReadingStatus})}
						>
							{Object.values(ReadingStatus).map((status) => (
								<option key={status} value={status}>
									{getStatusDisplayText(status)}
								</option>
							))}
						</select>
					</div>

					{/* Current Page */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">
								Current Page
								{book.num_pages && ` (of ${book.num_pages})`}
							</span>
						</label>
						<input
							type="number"
							min="0"
							max={book.num_pages || undefined}
							placeholder="0"
							className="input input-bordered w-full"
							value={formData.current_page}
							onChange={(e) => setFormData({...formData, current_page: parseInt(e.target.value) || 0})}
						/>
						{book.num_pages && progressPercentage > 0 && (
							<div className="mt-2">
								<div className="flex justify-between text-xs text-base-content/60 mb-1">
									<span>{progressPercentage.toFixed(1)}% complete</span>
								</div>
								<div className="w-full bg-base-300 rounded-full h-2">
									<div 
										className="bg-primary h-2 rounded-full transition-all duration-300" 
										style={{ width: `${progressPercentage}%` }}
									></div>
								</div>
							</div>
						)}
					</div>

					{/* Notes */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">Personal Notes</span>
						</label>
						<textarea
							className="textarea textarea-bordered h-24 resize-none"
							placeholder="Add your thoughts, quotes, or reading notes..."
							value={formData.notes}
							onChange={(e) => setFormData({...formData, notes: e.target.value})}
						/>
					</div>

					{/* Actions */}
					<div className="modal-action">
						<button 
							type="button"
							className="btn btn-ghost" 
							onClick={onClose}
							disabled={updateMutation.isPending}
						>
							Cancel
						</button>
						<button 
							type="submit"
							className={`btn btn-primary ${updateMutation.isPending ? "loading" : ""}`}
							disabled={updateMutation.isPending}
						>
							{updateMutation.isPending ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

const STATUS_CONFIG = {
	[ReadingStatus.WANT_TO_READ]: {
		label: "Want to Read",
		badgeClass: "badge-primary",
		icon: <FaBookOpen className="w-4 h-4" />,
	},
	[ReadingStatus.READING]: {
		label: "Reading",
		badgeClass: "badge-warning",
		icon: <FaBookOpenReader className="w-4 h-4" />,
	},
	[ReadingStatus.FINISHED]: {
		label: "Finished",
		badgeClass: "badge-success",
		icon: <FaRegCircleCheck className="w-4 h-4" />,
	},
} as const;

const EXTRA_STATUS_CONFIG = {
	all: "All Books",
} as const;

function getStatusBadgeClass(status: string): string {
	return STATUS_CONFIG[status as ReadingStatus]?.badgeClass || "badge-ghost";
}

function getStatusDisplayText(status: string | StatusFilter): string {
	if (status === "all") return EXTRA_STATUS_CONFIG.all;
	return STATUS_CONFIG[status as ReadingStatus]?.label || status;
}

function getStatusIcon(status: string) {
	return STATUS_CONFIG[status as ReadingStatus]?.icon || null;
}
