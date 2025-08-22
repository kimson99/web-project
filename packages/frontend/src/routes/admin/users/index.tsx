import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import Modal from "../../../components/Modal";
import Avatar from "../../../components/Avatar";
import dayjs from "dayjs";
import { userDestroy, userIndex, userAdminUpdate } from "@repo/api";
import { formatId } from "../../../libs/utils";
import { FaPen, FaTrash } from "react-icons/fa6";
import useDebounce from "../../../hooks/useDebounce";

export const Route = createFileRoute("/admin/users/")({
	component: AdminUsers,
});

const columns = [
	{ key: "id", label: "ID" },
	{ key: "avatar", label: "Avatar" },
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" },
	{ key: "role", label: "Role" },
	{ key: "status", label: "Status" },
	{ key: "stats", label: "Activity" },
	{ key: "joined", label: "Joined" },
	{ key: "actions", label: "Actions" },
];

function AdminUsers() {
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState<"admin" | "member" | undefined>(
		undefined
	);
	// const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
	const [editingUser, setEditingUser] = useState<any | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const queryClient = useQueryClient();

	const debouncedSearchTerm = useDebounce(searchTerm, 350);

	const { data, isLoading, error } = useQuery({
		queryKey: ["admin-users", debouncedSearchTerm, roleFilter, currentPage],
		queryFn: () =>
			userIndex({
				query: {
					skip: (currentPage - 1) * itemsPerPage,
					take: itemsPerPage,
					search: debouncedSearchTerm || undefined,
					role: roleFilter || undefined,
				},
			}),
	});

	// const deleteUserMutation = useMutation({
	// 	mutationFn: (userId: string) => userDestroy({ path: { user: userId } }),
	// 	onSuccess: () => {
	// 		toast.success("User deleted successfully");
	// 		queryClient.invalidateQueries({ queryKey: ["admin-users"] });
	// 		setDeleteUserId(null);
	// 	},
	// 	onError: (error: any) => {
	// 		console.error("Delete error:", error);
	// 		toast.error(error?.body?.message || "Failed to delete user");
	// 	},
	// });

	const updateUserMutation = useMutation({
		mutationFn: ({ userId, data }: { userId: string; data: any }) =>
			userAdminUpdate({ path: { user: userId }, body: data }),
		onSuccess: () => {
			toast.success("User updated successfully");
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			setEditingUser(null);
		},
		onError: (error: any) => {
			console.error("Update error:", error);
			toast.error(error?.body?.message || "Failed to update user");
		},
	});

	const users = data?.data?.data || [];
	const meta = data?.data?.meta;
	const totalItems = meta?.total ? parseInt(meta.total.toString()) : 0;
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	// const handleDeleteUser = (userId: string) => {
	// 	deleteUserMutation.mutate(userId);
	// };

	const getRoleBadgeClass = (role: string) => {
		return role === "admin" ? "badge-primary" : "badge-secondary";
	};

	const getStatusBadgeClass = (isActive: boolean) => {
		return isActive ? "badge-success" : "badge-error";
	};

	if (error) {
		return (
			<div className="text-center py-8">
				<div className="text-red-600">Failed to load users</div>
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-base-content">
					User Management
				</h2>
			</div>

			{/* Search and Filters */}
			<div className="mb-6 flex flex-wrap gap-4 items-end">
				<div className="flex-1 min-w-[300px]">
					<input
						type="text"
						placeholder="Search by name or email..."
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setCurrentPage(1);
						}}
						className="input input-bordered w-full"
					/>
				</div>
				<div>
					<select
						value={roleFilter}
						onChange={(e) => {
							setRoleFilter(e.target.value as "admin" | "member" | undefined);
							setCurrentPage(1);
						}}
						className="select select-bordered"
					>
						<option value="">All Roles</option>
						<option value="member">Members</option>
						<option value="admin">Admins</option>
					</select>
				</div>
			</div>

			{/* Users Table or Empty State */}
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
												{column.key === "avatar" ? (
													<div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
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
																: column.key === "name" ||
																	  column.key === "email"
																	? "w-32"
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
			) : users.length === 0 ? (
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body text-center py-16">
						<div className="text-6xl mb-4">👥</div>
						<h3 className="text-xl font-semibold mb-2">No users found</h3>
						<p className="text-base-content/60">
							{searchTerm || roleFilter
								? "No users match your current search criteria."
								: "No users found in the system."}
						</p>
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
								{users.map((user) => (
									<tr key={user.id}>
										<td>
											<code className="text-xs bg-base-200 px-2 py-1 rounded">
												{formatId(user.id)}
											</code>
										</td>
										<td>
											<Avatar
												name={user.name}
												src={user.avatar_path}
												className="w-10 h-10"
											/>
										</td>
										<td>
											<div className="font-semibold">{user.name}</div>
										</td>
										<td>
											<div className="text-sm text-gray-600">{user.email}</div>
										</td>
										<td>
											<span className={`badge ${getRoleBadgeClass(user.role)}`}>
												{user.role}
											</span>
										</td>
										<td>
											<span
												className={`badge ${getStatusBadgeClass(Boolean(user.is_active))}`}
											>
												{user.is_active ? "Active" : "Suspended"}
											</span>
										</td>
										<td>
											<div className="text-sm">
												<div>{user.reviews_count || 0} reviews</div>
												<div className="text-gray-500">
													{user.user_books_count || 0} books
												</div>
											</div>
										</td>
										<td>
											<div className="text-sm text-gray-500">
												{dayjs(user.created_at).format("MMM D, YYYY")}
											</div>
										</td>
										<td>
											<div className="flex space-x-2">
												<button
													onClick={() => setEditingUser(user)}
													className="btn btn-sm btn-outline btn-square"
													title="Edit user"
												>
													<FaPen />
												</button>
												{/* <button
													onClick={() => setDeleteUserId(user.id)}
													className="btn btn-sm btn-error btn-outline btn-square"
													disabled={deleteUserMutation.isPending}
													title="Delete user"
												>
													<FaTrash />
												</button> */}
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
								{Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
								{totalItems} results
							</div>
						</div>
					)}
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{/* {deleteUserId && (
				<Modal
					isOpen={true}
					onClose={() => setDeleteUserId(null)}
					title="Delete User"
				>
					<div className="py-4">
						<p className="text-gray-600 mb-4">
							Are you sure you want to delete this user? This action will also
							remove all their reviews and library entries. This action cannot
							be undone.
						</p>
						<div className="flex justify-end space-x-2">
							<button
								onClick={() => setDeleteUserId(null)}
								className="btn btn-outline"
							>
								Cancel
							</button>
							<button
								onClick={() => handleDeleteUser(deleteUserId)}
								disabled={deleteUserMutation.isPending}
								className="btn btn-error"
							>
								{deleteUserMutation.isPending ? (
									<>
										<span className="loading loading-spinner loading-sm mr-2"></span>
										Deleting...
									</>
								) : (
									"Delete User"
								)}
							</button>
						</div>
					</div>
				</Modal>
			)} */}

			{/* Edit User Modal */}
			{editingUser && (
				<EditUserModal
					user={editingUser}
					onClose={() => setEditingUser(null)}
					onSave={(data) => {
						updateUserMutation.mutate({
							userId: editingUser.id,
							data,
						});
					}}
					isLoading={updateUserMutation.isPending}
				/>
			)}
		</div>
	);
}

interface EditUserFormData {
	name: string;
	role: "member" | "admin";
	is_active: boolean;
}

interface EditUserModalProps {
	user: any;
	onClose: () => void;
	onSave: (data: EditUserFormData) => void;
	isLoading: boolean;
}

function EditUserModal({
	user,
	onClose,
	onSave,
	isLoading,
}: EditUserModalProps) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<EditUserFormData>({
		defaultValues: {
			name: user.name || "",
			role: user.role || "member",
			is_active: user.is_active ?? true,
		},
	});

	const isActive = watch("is_active");

	const onSubmit = (data: EditUserFormData) => {
		onSave(data);
	};

	return (
		<Modal isOpen={true} onClose={onClose} title="Edit User">
			<div className="flex flex-col gap-2">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* User Info Header */}
					<div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
						<Avatar
							name={user.name}
							src={user.avatar_path}
							className="w-12 h-12"
						/>
						<div>
							<h4 className="font-semibold">{user.name}</h4>
							<p className="text-sm text-gray-600">{user.email}</p>
						</div>
					</div>

					{/* Name Field */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">Name</span>
						</label>
						<input
							{...register("name", {
								required: "Name is required",
								minLength: {
									value: 2,
									message: "Name must be at least 2 characters",
								},
								maxLength: {
									value: 255,
									message: "Name must not exceed 255 characters",
								},
							})}
							type="text"
							className={`w-full input input-bordered ${errors.name ? "input-error" : ""}`}
							placeholder="Enter user name"
						/>
						{errors.name && (
							<label className="label">
								<span className="label-text-alt text-error">
									{errors.name.message}
								</span>
							</label>
						)}
					</div>

					{/* Role Field */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">Role</span>
						</label>
						<select
							{...register("role")}
							className="select select-bordered w-full"
						>
							<option value="member">Member</option>
							<option value="admin">Admin</option>
						</select>
					</div>

					{/* Active Status */}
					<div className="form-control">
						<label className="label cursor-pointer">
							<span className="label-text">Account Status</span>
							<div className="flex items-center gap-2">
								<input
									{...register("is_active")}
									type="checkbox"
									className="checkbox checkbox-success"
								/>
								<span
									className={`text-sm ${isActive ? "text-success" : "text-error"}`}
								>
									{isActive ? "Active" : "Suspended"}
								</span>
							</div>
						</label>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end space-x-2 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="btn btn-outline"
							disabled={isLoading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<span className="loading loading-spinner loading-sm mr-2"></span>
									Updating...
								</>
							) : (
								"Update User"
							)}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
