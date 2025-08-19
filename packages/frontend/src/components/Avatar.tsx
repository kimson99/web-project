import { cn } from "../libs/utils";
import type { HTMLAttributes } from "react";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
	name: string;
	src: string | null;
	className?: string;
	textClassName?: string;
}

const Avatar = ({
	name,
	src,
	className,
	textClassName,
	...props
}: AvatarProps) => {
	const initial = name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
	if (!src) {
		return (
			<div className="avatar avatar-placeholder" {...props}>
				<div
					className={cn(
						"bg-neutral text-neutral-content w-24 rounded-full",
						className
					)}
				>
					<span className={cn("text-xl", textClassName)}>{initial}</span>
				</div>
			</div>
		);
	}

	return (
		<div className="avatar" {...props}>
			<div className={cn("w-10 rounded-full", className)}>
				<img alt={`avatar-${initial}`} src={src} />
			</div>
		</div>
	);
};

export default Avatar;
