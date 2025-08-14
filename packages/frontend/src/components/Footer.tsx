import { FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa6";

const Footer = () => {
	return (
		<footer className="flex flex-col justify-around md:flex-row footer footer-center p-6 bg-base-200 text-base-content">
			<div className="grid grid-flow-row md:grid-flow-col  gap-4">
				<a className="link link-hover">About us</a>
				<a className="link link-hover">Contact</a>
				<a className="link link-hover">Privacy Policy</a>
				<a className="link link-hover">Terms of Service</a>
			</div>
			<div>
				<p>Copyright © 2025 - All rights reserved by BookLog Inc.</p>
			</div>
			<div>
				<div className="grid grid-flow-col gap-4">
					<a className="link link-hover">
						<FaTwitter size={24} />
					</a>
					<a className="link link-hover">
						<FaYoutube size={24} />
					</a>
					<a className="link link-hover">
						<FaFacebook size={24} />
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
