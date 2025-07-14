const GenreSection = () => {
	const genres = [
		{
			id: 1,
			name: "Fiction",
			description: "Imaginative stories and novels",
			bookCount: 1247,
			image: "https://picsum.photos/300/200?random=10",
			representativeBook: "The Midnight Library",
		},
		{
			id: 2,
			name: "Science Fiction",
			description: "Futuristic and speculative fiction",
			bookCount: 892,
			image: "https://picsum.photos/300/200?random=11",
			representativeBook: "Project Hail Mary",
		},
		{
			id: 3,
			name: "Mystery & Thriller",
			description: "Suspenseful and detective stories",
			bookCount: 1156,
			image: "https://picsum.photos/300/200?random=12",
			representativeBook: "The Silent Patient",
		},
		{
			id: 4,
			name: "Romance",
			description: "Love stories and relationships",
			bookCount: 2034,
			image: "https://picsum.photos/300/200?random=13",
			representativeBook: "The Seven Husbands of Evelyn Hugo",
		},
		{
			id: 5,
			name: "Self-Help",
			description: "Personal development and growth",
			bookCount: 678,
			image: "https://picsum.photos/300/200?random=14",
			representativeBook: "Atomic Habits",
		},
		{
			id: 6,
			name: "Biography",
			description: "Real life stories and memoirs",
			bookCount: 445,
			image: "https://picsum.photos/300/200?random=15",
			representativeBook: "Becoming",
		},
		{
			id: 7,
			name: "History",
			description: "Historical accounts and analysis",
			bookCount: 567,
			image: "https://picsum.photos/300/200?random=16",
			representativeBook: "Sapiens",
		},
		{
			id: 8,
			name: "Fantasy",
			description: "Magical worlds and adventures",
			bookCount: 789,
			image: "https://picsum.photos/300/200?random=17",
			representativeBook: "The Name of the Wind",
		},
	];

	return (
		<section className="py-16 bg-base-200">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold mb-4">Browse by Genre</h2>
					<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
						Explore thousands of books across different genres and find your
						next favorite read.
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{genres.map((genre) => (
						<div
							key={genre.id}
							className="group cursor-pointer bg-base-100 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
						>
							{/* Genre Image */}
							<div className="relative h-32 overflow-hidden">
								<img
									src={genre.image}
									alt={genre.name}
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
								/>
								{/* Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

								{/* Genre Name on Image */}
								<div className="absolute bottom-0 left-0 right-0 p-3">
									<h3 className="text-white font-bold text-lg">{genre.name}</h3>
								</div>
							</div>

							{/* Genre Info */}
							<div className="p-4">
								<p className="text-sm text-base-content/70 mb-2">
									{genre.description}
								</p>

								<div className="flex items-center justify-between mb-3">
									<span className="text-xs text-base-content/60">
										{genre.bookCount.toLocaleString()} books
									</span>
								</div>
								<button className="w-full btn btn-primary btn-sm">
									Browse
								</button>
							</div>
						</div>
					))}
				</div>

				<div className="text-center mt-12">
					<button className="btn btn-primary btn-lg">View All Genres</button>
				</div>
			</div>
		</section>
	);
};

export default GenreSection;
