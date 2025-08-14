import { cn } from "../libs/utils";

const BookCover = ({
	title,
	src,
	className,
	onClick,
}: {
	title: string;
	src?: string;
	className?: string;
	onClick?: () => void;
}) => {
	const handleOnclick = () => {
		onClick?.();
	};
	if (!src) {
		return (
			<div
				className={cn(
					"min-w-[40px] h-[60px] bg-primary-content text-center text-black flex items-center justify-center",
					className
				)}
				onClick={handleOnclick}
			>
				{title?.charAt(0).toUpperCase() || "B"}
			</div>
		);
	}

	return (
		<img
			alt={`${title} Cover`}
			src={src}
			className={cn(
				"min-w-[40px] h-[60px] object-cover aspect-[2/3]",
				className
			)}
			onClick={handleOnclick}
		/>
	);
};

export default BookCover;
