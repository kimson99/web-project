import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "../components/Home/HeroSection";
import FeaturedBooksSection from "../components/Home/FeaturedBooksSection";
import GenreSection from "../components/Home/GenreSection";

const Home = () => {
	return (
		<div>
			<HeroSection />
			<FeaturedBooksSection />
			<GenreSection />
		</div>
	);
};

export const Route = createFileRoute("/")({
	component: Home,
});
