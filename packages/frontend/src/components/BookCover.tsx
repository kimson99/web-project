import { cn } from "../libs/utils";

const BookCover = ({
	title,
	src,
	className,
}: {
	title: string;
	src?: string;
	className?: string;
}) => {
	if (!src) {
		return (
			<div
				className={cn(
					"min-w-[40px] h-[60px] bg-primary-content text-center text-black flex items-center justify-center",
					className
				)}
			>
				{title?.charAt(0).toUpperCase() || "B"}
			</div>
		);
	}

	return (
		<img
			alt={`${title} Cover`}
			src={src}
			className={cn("min-w-[40px] h-[60px] object-fill ", className)}
		/>
	);
};

export default BookCover;
