import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { bookStore, mediaUploadImage } from "@repo/api";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPlus, FaTrash, FaUpload } from "react-icons/fa6";
import { useState } from "react";

export const Route = createFileRoute("/admin/books/new")({
	component: NewBook,
});

interface BookFormData {
	title: string;
	description: string;
	cover_image_path: string;
	authors: { name: string }[];
	num_pages: number;
	published_year: string;
}

function NewBook() {
	const navigate = useNavigate();
	const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
		null
	);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		control,
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

	// Image upload mutation
	const uploadImageMutation = useMutation({
		mutationFn: (file: File) => {
			const formData = new FormData();
			formData.append("image", file);
			return mediaUploadImage({ body: { image: file } });
		},
		onSuccess: (response) => {
			console.log(response);
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

	const createBookMutation = useMutation({
		mutationFn: (data: BookFormData) =>
			bookStore({
				body: {
					...data,
					authors: data.authors.map((author) => author.name).filter(Boolean),
				},
			}),
		onSuccess: () => {
			toast.success("Book created successfully!");
			navigate({ to: "/admin/books" });
		},
		onError: (error: any) => {
			toast.error(error?.body?.message || "Failed to create book");
		},
	});

	const onSubmit = (data: BookFormData) => {
		// Validate that at least one author is provided
		const validAuthors = data.authors.filter((author) => author.name.trim());
		if (validAuthors.length === 0) {
			toast.error("At least one author is required");
			return;
		}

		// Validate that an image has been uploaded
		if (!uploadedImagePath) {
			toast.error("Please upload a cover image");
			return;
		}
		console.log(uploadedImagePath);
		createBookMutation.mutate({
			...data,
			authors: validAuthors,
			cover_image_path: uploadedImagePath,
		});
	};

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
				<h2 className="text-2xl font-bold text-base-content">Add New Book</h2>
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
									Cover Image <span className="text-error">*</span>
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
									{!uploadedImagePath && (
										<label className="label">
											<span className="label-text-alt text-error">
												Cover image is required
											</span>
										</label>
									)}
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
									min: {
										value: 1,
										message: "Number of pages must be at least 1",
									},
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
								disabled={createBookMutation.isPending}
							>
								Cancel
							</button>
							<button
								type="submit"
								className={`btn btn-primary ${
									createBookMutation.isPending ? "loading" : ""
								}`}
								disabled={createBookMutation.isPending}
							>
								{createBookMutation.isPending ? (
									"Creating..."
								) : (
									<>
										<FaPlus className="w-4 h-4 mr-2" />
										Create Book
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
