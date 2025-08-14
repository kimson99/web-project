import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	userLibraryStore,
	userLibraryUpdate,
	type BookResource,
} from "@repo/api";
import toast from "react-hot-toast";
import {
	FaBookOpen,
	FaBookOpenReader,
	FaRegCircleCheck,
} from "react-icons/fa6";

interface LibraryActionsProps {
	book: BookResource;
}

const LibraryActions = ({ book }: LibraryActionsProps) => {
	const queryClient = useQueryClient();
	const currentStatus = book.user_data?.reading_status;
	const isInLibrary = !!currentStatus;

	// Add to library mutation
	const addToLibraryMutation = useMutation({
		mutationFn: (status: "want-to-read" | "reading" | "finished") =>
			userLibraryStore({
				body: {
					book_id: book.id,
					status: status,
				},
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["book", book.id] });
			toast.success("Book added to your library!");
		},
		onError: (error: any) => {
			console.error("Failed to add book to library:", error);
			toast.error("Failed to add book to library. Please try again.");
		},
	});

	// Update status mutation
	const updateStatusMutation = useMutation({
		mutationFn: (status: "want-to-read" | "reading" | "finished") => {
			if (!book.user_data?.id) {
				throw new Error("UserBook ID not found");
			}
			return userLibraryUpdate({
				path: { userBook: book.user_data.id },
				body: { status: status },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["book", book.id] });
			toast.success("Reading status updated!");
		},
		onError: (error: any) => {
			console.error("Failed to update status:", error);
			toast.error("Failed to update status. Please try again.");
		},
	});

	const handleAddToLibrary = (
		status: "want-to-read" | "reading" | "finished"
	) => {
		addToLibraryMutation.mutate(status);
	};

	const handleStatusChange = (
		status: "want-to-read" | "reading" | "finished"
	) => {
		updateStatusMutation.mutate(status);
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "want-to-read":
				return "Want to Read";
			case "reading":
				return "Currently Reading";
			case "finished":
				return "Read";
			default:
				return status;
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "want-to-read":
				return <FaBookOpen className="w-4 h-4" />;
			case "reading":
				return <FaBookOpenReader className="w-4 h-4" />;
			case "finished":
				return <FaRegCircleCheck className="w-4 h-4" />;
			default:
				return <FaBookOpen className="w-4 h-4" />;
		}
	};


	const isPending =
		addToLibraryMutation.isPending || updateStatusMutation.isPending;

	// Determine main button content and behavior
	const mainButtonStatus: "want-to-read" | "reading" | "finished" = 
		(currentStatus as "want-to-read" | "reading" | "finished") || "want-to-read";
	const isDisabled = isPending || isInLibrary;

	return (
		<div className="mt-6">
			<div className="flex">
				{/* Main button - shows current status or default "Want to Read" */}
				<button
					className={`btn flex-1 rounded-r-none ${
						isInLibrary ? "btn-success" : "btn-primary"
					}`}
					onClick={() => handleAddToLibrary(mainButtonStatus)}
					disabled={isDisabled}
				>
					{isPending ? (
						<span className="loading loading-spinner loading-sm"></span>
					) : (
						<>
							{getStatusIcon(mainButtonStatus)}
							{getStatusLabel(mainButtonStatus)}
						</>
					)}
				</button>

				{/* Dropdown button - always available for other statuses */}
				<div className="dropdown dropdown-end">
					<button
						className={`btn rounded-l-none border-l-0 px-2 ${
							isInLibrary ? "btn-success" : "btn-primary"
						}`}
						disabled={isPending}
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
					<ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-2 shadow border">
						{/* Show all options except current status */}
						{currentStatus !== "want-to-read" && (
							<li>
								<button
									onClick={() =>
										isInLibrary
											? handleStatusChange("want-to-read")
											: handleAddToLibrary("want-to-read")
									}
									disabled={isPending}
									className="flex items-center gap-2"
								>
									<FaBookOpen className="w-4 h-4" />
									Want to Read
								</button>
							</li>
						)}
						{currentStatus !== "reading" && (
							<li>
								<button
									onClick={() =>
										isInLibrary
											? handleStatusChange("reading")
											: handleAddToLibrary("reading")
									}
									disabled={isPending}
									className="flex items-center gap-2"
								>
									<FaBookOpenReader className="w-4 h-4" />
									Currently Reading
								</button>
							</li>
						)}
						{currentStatus !== "finished" && (
							<li>
								<button
									onClick={() =>
										isInLibrary
											? handleStatusChange("finished")
											: handleAddToLibrary("finished")
									}
									disabled={isPending}
									className="flex items-center gap-2"
								>
									<FaRegCircleCheck className="w-4 h-4" />
									Read
								</button>
							</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default LibraryActions;
