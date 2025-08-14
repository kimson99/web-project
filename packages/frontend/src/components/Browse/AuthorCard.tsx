import { type AuthorResource } from "@repo/api";
import Avatar from "../Avatar";

interface AuthorCardProps {
	author: AuthorResource;
}

const AuthorCard = ({ author }: AuthorCardProps) => (
	<div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
		<div className="card-body p-4">
			<div className="flex items-center gap-3">
				{author.avatar_image_path ? (
					<div className="avatar">
						<div className="w-12 h-12 rounded-full">
							<img src={author.avatar_image_path} alt={author.name} />
						</div>
					</div>
				) : (
					<Avatar
						name={author.name || ""}
						src={author.avatar_image_path}
						className="w-12"
						textClassName="text-base"
					/>
				)}
				<div>
					<h3 className="font-semibold text-lg">{author.name}</h3>
				</div>
			</div>
		</div>
	</div>
);

export default AuthorCard;