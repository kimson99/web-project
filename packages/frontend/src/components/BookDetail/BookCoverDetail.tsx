import { useState, useRef } from "react";
import { cn } from "../../libs/utils";

const BookCoverDetail = ({
	title,
	src,
	className,
}: {
	title: string;
	src?: string;
	className?: string;
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const imgRef = useRef<HTMLImageElement>(null);

	if (!src) {
		return (
			<div
				className={cn(
					"w-full aspect-[2/3] bg-primary-content text-center text-black flex items-center justify-center text-2xl font-bold",
					className
				)}
			>
				{title?.charAt(0).toUpperCase() || "B"}
			</div>
		);
	}

	return (
		<div className="relative">
			{isLoading && (
				<div className={cn("skeleton w-full aspect-[2/3] absolute inset-0", className)} />
			)}
			<img
				ref={imgRef}
				alt={`${title} Cover`}
				src={src}
				className={cn("w-full aspect-[2/3] object-cover", isLoading && "opacity-0", className)}
				onLoad={() => setIsLoading(false)}
			/>
		</div>
	);
};

export default BookCoverDetail;
