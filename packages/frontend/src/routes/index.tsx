import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "../components/Home/HeroSection";
import FeaturedBooksSection from "../components/Home/FeaturedBooksSection";
import LatestBookReviewSection from "../components/Home/LatestBookReviewSection";

const Home = () => {
	return (
		<div>
			<HeroSection />
			<FeaturedBooksSection />
			<LatestBookReviewSection />
		</div>
	);
};

export const Route = createFileRoute("/")({
	component: Home,
});
