import { Link, useRouter } from "@tanstack/react-router";

const NotFound = () => {
	const router = useRouter();
	return (
		<div className="grow-1 flex items-center justify-center bg-base-300 px-8">
			<div className="text-center">
				<div className="mb-8">
					<h1 className="text-9xl font-bold text-primary">404</h1>
					<h2 className="text-2xl font-semibold text-base-content mb-4">
						Page Not Found
					</h2>
					<p className="text-base-content/70 mb-8 max-w-md">
						The page you're looking for doesn't exist or has been moved.
					</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link to="/" className="btn btn-primary">
						Go Home
					</Link>
					<button
						onClick={() => router.history.back()}
						className="btn btn-outline"
					>
						Go Back
					</button>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
