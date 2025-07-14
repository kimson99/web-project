const FeaturedBooksSection = () => {
	const featuredBooks = [
		{
			id: 1,
			title: "The Midnight Library",
			author: "Matt Haig",
			genre: "Fiction",
			rating: 4.5,
			image: "https://picsum.photos/120/180?random=1",
			description:
				"Between life and death there is a library, and within that library, the shelves go on forever.",
		},
		{
			id: 2,
			title: "Atomic Habits",
			author: "James Clear",
			genre: "Self-Help",
			rating: 4.8,
			image: "https://picsum.photos/120/180?random=2",
			description:
				"Tiny changes, remarkable results. An easy and proven way to build good habits and break bad ones.",
		},
		{
			id: 3,
			title: "The Seven Husbands of Evelyn Hugo",
			author: "Taylor Jenkins Reid",
			genre: "Historical Fiction",
			rating: 4.6,
			image: "https://picsum.photos/120/180?random=3",
			description:
				"Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.",
		},
		{
			id: 4,
			title: "Project Hail Mary",
			author: "Andy Weir",
			genre: "Science Fiction",
			rating: 4.7,
			image: "https://picsum.photos/120/180?random=4",
			description:
				"Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the Earth itself will perish.",
		},
		{
			id: 5,
			title: "Lessons in Chemistry",
			author: "Bonnie Garmus",
			genre: "Historical Fiction",
			rating: 4.4,
			image: "https://picsum.photos/120/180?random=5",
			description:
				"Set in 1960s California, this blockbuster debut is the hilarious, idiosyncratic and uplifting story of a female scientist.",
		},
		{
			id: 6,
			title: "Tomorrow, and Tomorrow, and Tomorrow",
			author: "Gabrielle Zevin",
			genre: "Literary Fiction",
			rating: 4.3,
			image: "https://picsum.photos/120/180?random=6",
			description:
				"A modern love story about two friends finding their way through life, set in the world of video game development.",
		},
	];

	return (
		<section className="py-16 bg-base-100">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold mb-4">Featured Books</h2>
					<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
						Discover our handpicked collection of must-read books that are
						trending and loved by readers worldwide.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{featuredBooks.map((book) => (
						<div
							key={book.id}
							className="bg-base-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
						>
							<div className="flex gap-4">
								{/* Book Cover */}
								<div className="flex-shrink-0">
									<img
										src={book.image}
										alt={book.title}
										className="w-20 h-30 object-cover rounded shadow-md"
									/>
								</div>

								{/* Book Info */}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between mb-2">
										<span className="badge badge-primary badge-xs">
											{book.genre}
										</span>
										<div className="flex items-center gap-1">
											<span className="text-yellow-500 text-sm">★</span>
											<span className="text-sm font-medium">{book.rating}</span>
										</div>
									</div>

									<h3 className="font-semibold text-base mb-1 line-clamp-2 leading-tight">
										{book.title}
									</h3>

									<p className="text-sm text-base-content/70 mb-2">
										by {book.author}
									</p>

									<p className="text-xs text-base-content/80 line-clamp-3 mb-3 leading-relaxed">
										{book.description}
									</p>

									<div className="flex gap-2">
										<button className="btn btn-primary btn-xs">
											Read More
										</button>
										<button className="btn btn-outline btn-xs">
											Add to List
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="text-center mt-12">
					<button className="btn btn-primary btn-lg">View All Books</button>
				</div>
			</div>
		</section>
	);
};

export default FeaturedBooksSection;
