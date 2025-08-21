import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { bookShow, bookUpdate, mediaUploadImage } from "@repo/api";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa6";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin/books/edit/$bookId")({
	component: EditBook,
});

interface BookFormData {
	title: string;
	description: string;
	cover_image_path: string;
	authors: { name: string }[];
	num_pages: number;
	published_year: string;
}

function EditBook() {
	const { bookId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	// Fetch existing book data
	const { data: bookData, isLoading: isLoadingBook } = useQuery({
		queryKey: ["book", bookId],
		queryFn: () => bookShow({ path: { book: bookId } }),
	});

	const book = bookData?.data;

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<BookFormData>({
		defaultValues: {
			authors: [{ name: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "authors",
	});

	// Reset form when book data is loaded
	useEffect(() => {
		if (book) {
			reset({
				title: book.title || "",
				description: book.description || "",
				cover_image_path: book.cover_image_path || "",
				authors: book.authors?.map(author => ({ name: author.name })) || [{ name: "" }],
				num_pages: book.num_pages || 0,
				published_year: book.published_year || "",
			});
			setImagePreview(book.cover_image_url || null);
		}
	}, [book, reset]);

	// Image upload mutation
	const uploadImageMutation = useMutation({
		mutationFn: (file: File) => {
			return mediaUploadImage({ body: { image: file } });
		},
		onSuccess: (response) => {
			setUploadedImagePath((response.data as any)?.data?.path || null);
			toast.success("Image uploaded successfully!");
		},
		onError: () => {
			toast.error("Failed to upload image");
			setImagePreview(null);
		},
	});

	// Handle file selection
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			setImagePreview(e.target?.result as string);
		};
		reader.readAsDataURL(file);

		// Upload file
		uploadImageMutation.mutate(file);
	};

	const updateBookMutation = useMutation({
		mutationFn: (data: BookFormData) =>
			bookUpdate({
				path: { book: bookId },
				body: {
					...data,
					authors: data.authors.map((author) => author.name).filter(Boolean),
				},
			}),
		onSuccess: () => {
			toast.success("Book updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["admin-books"] });
			queryClient.invalidateQueries({ queryKey: ["book", bookId] });
			navigate({ to: "/admin/books" });
		},
		onError: (error: any) => {
			toast.error(error?.body?.message || "Failed to update book");
		},
	});

	const onSubmit = (data: BookFormData) => {
		// Validate that at least one author is provided
		const validAuthors = data.authors.filter((author) => author.name.trim());
		if (validAuthors.length === 0) {
			toast.error("At least one author is required");
			return;
		}

		const updateData: any = {
			title: data.title,
			description: data.description,
			authors: validAuthors,
			num_pages: data.num_pages,
			published_year: data.published_year,
		};

		// Only include cover_image_path if a new image was uploaded
		if (uploadedImagePath) {
			updateData.cover_image_path = uploadedImagePath;
		}

		updateBookMutation.mutate(updateData);
	};

	if (isLoadingBook) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<span className="loading loading-spinner loading-lg"></span>
			</div>
		);
	}

	if (!book) {
		return (
			<div className="text-center py-8">
				<div className="text-error">Book not found</div>
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className="flex items-center mb-6">
				<button
					onClick={() => navigate({ to: "/admin/books" })}
					className="btn btn-ghost btn-sm mr-4"
				>
					<FaArrowLeft />
					Back to Books
				</button>
				<h2 className="text-2xl font-bold text-base-content">Edit Book</h2>
			</div>

			{/* Form */}
			<div className="card bg-base-100 shadow-xl">
				<div className="card-body">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Title */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">
									Title <span className="text-error">*</span>
								</span>
							</label>
							<input
								type="text"
								{...register("title", { required: "Title is required" })}
								className={`input input-bordered w-full ${
									errors.title ? "input-error" : ""
								}`}
								placeholder="Enter book title"
							/>
							{errors.title && (
								<label className="label">
									<span className="label-text-alt text-error">
										{errors.title.message}
									</span>
								</label>
							)}
						</div>

						{/* Description */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">
									Description <span className="text-error">*</span>
								</span>
							</label>
							<textarea
								{...register("description", {
									required: "Description is required",
								})}
								className={`textarea textarea-bordered w-full h-32 resize-none ${
									errors.description ? "textarea-error" : ""
								}`}
								placeholder="Enter book description"
							/>
							{errors.description && (
								<label className="label">
									<span className="label-text-alt text-error">
										{errors.description.message}
									</span>
								</label>
							)}
						</div>

						{/* Cover Image Upload */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">
									Cover Image
								</span>
							</label>
							<div className="flex gap-4 flex-col">
								{/* Upload Button */}
								<div className="flex-1">
									<input
										type="file"
										accept="image/*"
										onChange={handleImageUpload}
										className="file-input file-input-bordered w-full"
										disabled={uploadImageMutation.isPending}
									/>
									{uploadImageMutation.isPending && (
										<div className="mt-2 text-sm text-base-content/70 flex items-center gap-2">
											<span className="loading loading-spinner loading-sm"></span>
											Uploading image...
										</div>
									)}
									<div className="mt-1 text-sm text-base-content/60">
										Leave empty to keep current image
									</div>
								</div>
								
								{/* Image Preview */}
								{imagePreview && (
									<div className="flex-shrink-0">
										<div className="w-24 h-32 rounded-lg overflow-hidden bg-base-200">
											<img
												src={imagePreview}
												alt="Cover preview"
												className="w-full h-full object-cover"
											/>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Authors */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">
									Authors <span className="text-error">*</span>
								</span>
							</label>
							<div className="space-y-3">
								{fields.map((field, index) => (
									<div key={field.id} className="flex items-center gap-2">
										<input
											type="text"
											{...register(`authors.${index}.name` as const, {
												required: "Author name is required",
											})}
											className={`input input-bordered flex-1 ${
												errors.authors?.[index]?.name ? "input-error" : ""
											}`}
											placeholder="Enter author name"
										/>
										{fields.length > 1 && (
											<button
												type="button"
												onClick={() => remove(index)}
												className="btn btn-error btn-sm btn-square"
											>
												<FaTrash className="w-3 h-3" />
											</button>
										)}
									</div>
								))}
								<button
									type="button"
									onClick={() => append({ name: "" })}
									className="btn btn-outline btn-sm"
								>
									<FaPlus className="w-3 h-3 mr-2" />
									Add Author
								</button>
								{errors.authors && (
									<label className="label">
										<span className="label-text-alt text-error">
											At least one author is required
										</span>
									</label>
								)}
							</div>
						</div>

						{/* Number of Pages */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">
									Number of Pages <span className="text-error">*</span>
								</span>
							</label>
							<input
								type="number"
								{...register("num_pages", {
									required: "Number of pages is required",
									min: { value: 1, message: "Number of pages must be at least 1" },
									valueAsNumber: true,
								})}
								className={`input input-bordered w-full ${
									errors.num_pages ? "input-error" : ""
								}`}
								placeholder="Enter number of pages"
								min="1"
							/>
							{errors.num_pages && (
								<label className="label">
									<span className="label-text-alt text-error">
										{errors.num_pages.message}
									</span>
								</label>
							)}
						</div>

						{/* Published Year */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">
									Published Year <span className="text-error">*</span>
								</span>
							</label>
							<input
								type="text"
								{...register("published_year", {
									required: "Published year is required",
									pattern: {
										value: /^\d{4}$/,
										message: "Published year must be a 4-digit year",
									},
								})}
								className={`input input-bordered w-full ${
									errors.published_year ? "input-error" : ""
								}`}
								placeholder="YYYY"
								maxLength={4}
							/>
							{errors.published_year && (
								<label className="label">
									<span className="label-text-alt text-error">
										{errors.published_year.message}
									</span>
								</label>
							)}
						</div>

						{/* Submit Buttons */}
						<div className="flex justify-end space-x-4 pt-6 border-t border-base-300">
							<button
								type="button"
								onClick={() => navigate({ to: "/admin/books" })}
								className="btn btn-outline"
								disabled={updateBookMutation.isPending}
							>
								Cancel
							</button>
							<button
								type="submit"
								className={`btn btn-primary ${
									updateBookMutation.isPending ? "loading" : ""
								}`}
								disabled={updateBookMutation.isPending}
							>
								{updateBookMutation.isPending ? (
									"Updating..."
								) : (
									"Update Book"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}