import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import Modal from "../../../components/Modal";
import BookCover from "../../../components/BookCover";
import dayjs from "dayjs";
import { bookDestroy, bookIndex } from "@repo/api";
import { formatId } from "../../../libs/utils";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import useDebounce from "../../../hooks/useDebounce";

export const Route = createFileRoute("/admin/books/")({
	component: AdminBooks,
});

const columns = [
	{ key: "id", label: "ID" },
	{ key: "cover", label: "Cover" },
	{ key: "title", label: "Title" },
	{ key: "authors", label: "Authors" },
	{ key: "rating", label: "Rating" },
	{ key: "pages", label: "Pages" },
	{ key: "added", label: "Added" },
	{ key: "actions", label: "Actions" },
];

function AdminBooks() {
	const [searchTerm, setSearchTerm] = useState("");
	const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const queryClient = useQueryClient();

	const debouncedSearchTerm = useDebounce(searchTerm, 350);

	const {
		data,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["admin-books", debouncedSearchTerm, currentPage],
		queryFn: () =>
			bookIndex({
				query: {
					skip: (currentPage - 1) * itemsPerPage,
					take: itemsPerPage,
					search: debouncedSearchTerm || undefined,
				},
			}),
	});

	const deleteBookMutation = useMutation({
		mutationFn: (bookId: string) => bookDestroy({ path: { book: bookId } }),
		onSuccess: () => {
			toast.success("Book deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["admin-books"] });
			setDeleteBookId(null);
		},
		onError: (error: any) => {
			console.error("Delete error:", error);
			toast.error(error?.body?.message || "Failed to delete book");
		},
	});

	const books = data?.data?.data || [];
	const meta = data?.data?.meta;
	const totalItems = meta?.total ? parseInt(meta.total.toString()) : 0;
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const handleDeleteBook = (bookId: string) => {
		deleteBookMutation.mutate(bookId);
	};

	if (error) {
		return (
			<div className="text-center py-8">
				<div className="text-red-600">Failed to load books</div>
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-base-content">
					Book Management
				</h2>
				<Link to="/admin/books/new" className="btn btn-primary">
					<FaPlus />
					Add Book
				</Link>
			</div>

			{/* Search */}
			<div className="mb-6">
				<div className="relative">
					<input
						type="text"
						placeholder="Search books..."
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setCurrentPage(1); // Reset to first page on search
						}}
						className="input input-bordered w-full max-w-md"
					/>
					<i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
				</div>
			</div>

			{/* Books Table or Empty State */}
			{isLoading ? (
				<div className="card bg-base-100 shadow-xl">
					<div className="overflow-x-auto">
						<table className="table table-zebra table-hover">
							<thead>
								<tr>
									{columns.map((column) => (
										<th key={column.key}>{column.label}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{Array.from({ length: 5 }).map((_, i) => (
									<tr key={i}>
										{columns.map((column) => (
											<td key={column.key}>
												{column.key === "cover" ? (
													<div className="w-16 h-20 bg-gray-200 animate-pulse rounded"></div>
												) : column.key === "actions" ? (
													<div className="flex space-x-2">
														<div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
														<div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
													</div>
												) : (
													<div
														className={`h-4 bg-gray-200 animate-pulse rounded ${
															column.key === "id"
																? "w-20"
																: column.key === "title"
																	? "w-32"
																	: column.key === "authors"
																		? "w-24"
																		: column.key === "rating"
																			? "w-16"
																			: "w-20"
														}`}
													></div>
												)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : books.length === 0 ? (
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body text-center py-16">
						<div className="text-6xl mb-4">📚</div>
						<h3 className="text-xl font-semibold mb-2">No books found</h3>
						<p className="text-base-content/60 mb-6">
							{searchTerm
								? `No books match "${searchTerm}". Try a different search term.`
								: "No books have been added yet. Create your first book to get started."}
						</p>
						<Link to="/admin/books/new" className="btn btn-primary">
							<i className="fas fa-plus mr-2"></i>
							Add First Book
						</Link>
					</div>
				</div>
			) : (
				<div className="card bg-base-100 shadow-xl">
					<div className="overflow-x-auto">
						<table className="table table-zebra table-hover">
							<thead>
								<tr>
									{columns.map((column) => (
										<th key={column.key}>{column.label}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{books.map((book) => (
									<tr key={book.id}>
										<td>
											<code className="text-xs bg-base-200 px-2 py-1 rounded">
												{formatId(book.id)}
											</code>
										</td>
										<td>
											<BookCover
												title={book.title}
												src={book.cover_image_url || undefined}
												className="w-16 h-20"
											/>
										</td>
										<td>
											<div>
												<div className="font-semibold">{book.title}</div>
											</div>
										</td>
										<td>
											<div className="text-sm">
												{book.authors
													?.map((author) => author.name)
													.join(", ") || "Unknown"}
											</div>
										</td>
										<td>
											<div className="flex items-center">
												<i className="fas fa-star text-yellow-400 mr-1"></i>
												<span className="text-sm">
													{book.average_rating
														? book.average_rating.toFixed(1)
														: "N/A"}
												</span>
											</div>
										</td>
										<td>
											<div className="flex items-center">
												{book.num_pages || "N/A"}
											</div>
										</td>
										<td>
											<div className="text-sm text-gray-500">
												{book.created_at
													? dayjs(book.created_at).format("MMM D, YYYY")
													: "N/A"}
											</div>
										</td>
										<td>
											<div className="flex space-x-2">
												<Link
													to="/admin/books/edit/$bookId"
													params={{ bookId: book.id.toString() }}
													className="btn btn-sm btn-outline btn-square"
												>
													<FaPen />
												</Link>
												<button
													onClick={() => setDeleteBookId(book.id)}
													className="btn btn-sm btn-error btn-outline btn-square"
													disabled={deleteBookMutation.isPending}
												>
													<FaTrash />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="p-4 flex flex-col items-center border-t space-y-4">
							<div className="join">
								{/* Previous button */}
								<button
									className={`join-item btn btn-sm ${
										currentPage === 1 ? "btn-disabled" : ""
									}`}
									onClick={() => setCurrentPage(currentPage - 1)}
									disabled={currentPage === 1}
								>
									«
								</button>
								
								{/* Page numbers */}
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									const startPage = Math.max(
										1,
										Math.min(currentPage - 2, totalPages - 4)
									);
									const page = startPage + i;
									
									if (page > totalPages) return null;
									
									return (
										<button
											key={page}
											className={`join-item btn btn-sm ${
												currentPage === page ? "btn-active" : ""
											}`}
											onClick={() => setCurrentPage(page)}
										>
											{page}
										</button>
									);
								})}
								
								{/* Next button */}
								<button
									className={`join-item btn btn-sm ${
										currentPage === totalPages ? "btn-disabled" : ""
									}`}
									onClick={() => setCurrentPage(currentPage + 1)}
									disabled={currentPage === totalPages}
								>
									»
								</button>
							</div>
							
							{/* Pagination info */}
							<div className="text-sm text-base-content/60">
								Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
								{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
							</div>
						</div>
					)}
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{deleteBookId && (
				<Modal
					isOpen={true}
					onClose={() => setDeleteBookId(null)}
					title="Delete Book"
				>
					<div className="py-4">
						<p className="text-gray-600 mb-4">
							Are you sure you want to delete this book? This action cannot be
							undone.
						</p>
						<div className="flex justify-end space-x-2">
							<button
								onClick={() => setDeleteBookId(null)}
								className="btn btn-outline"
							>
								Cancel
							</button>
							<button
								onClick={() => handleDeleteBook(deleteBookId)}
								disabled={deleteBookMutation.isPending}
								className="btn btn-error"
							>
								{deleteBookMutation.isPending ? (
									<>
										<span className="loading loading-spinner loading-sm mr-2"></span>
										Deleting...
									</>
								) : (
									"Delete"
								)}
							</button>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
}
