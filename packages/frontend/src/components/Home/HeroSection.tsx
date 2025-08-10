const HeroSection = () => {
	return (
		<div className="flex items-center justify-center min-h-[80vh] bg-[url(./hero.jpg)] bg-cover bg-center bg-black/30 bg-blend-overlay">
			<div className=""></div>
			<div className="hero-content text-neutral-content text-center">
				<div className="max-w-md">
					<h1 className="mb-5 text-5xl font-bold">Hello there</h1>
					<p className="mb-5">
						Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
						excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
						a id nisi.
					</p>
					<button className="btn btn-primary">Join Us</button>
				</div>
			</div>
		</div>
	);
};

export default HeroSection;
