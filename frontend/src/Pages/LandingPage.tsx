import AnimatedBalls from "../Components/AnimatedBalls";
import FooterMain from "../Components/FooterMain";
import PageLayout from "../Components/PageLayout";

const LandingPage = () => {

	return (
		<>
			<PageLayout>
				<AnimatedBalls />
				<div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12 z-10">
					<div className="text-center">
						<h1 className="text-9xl flex flex-col leading-none">
							<span className="flex flex-row items-start text-[#f67539]">
								PONG<sup className="text-base text-[#fa5a45]">42</sup>
							</span>
						</h1>
						<h2 className="text-xl text-[#fa5a45] hover:text-[#f67539] font-light ml-2 tracking-widest pr-4 ">
							ft_transcendance @42Lausanne
						</h2>
					</div>
					<div className="flex gap-4">
						<button
							className=" text-white py-2 px-4 rounded-md  bg-cyan-700 hover:bg-[#f67539] hover:border-none"
							onClick={() => (window.location.href = "/login")}
						>
							Se connecter
						</button>
						<button
							className="py-2 px-4 rounded-md bg-cyan-700  text-white hover:bg-[#f67539] hover:border-none"
							onClick={() => (window.location.href = "/signin")}
						>
							S'inscrire
						</button>
						<button
							className="py-2 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539] hover:border-none"
							onClick={() => (window.location.href = "/api/auth/school42")}
						>
							Se connecter via 42
						</button>
					</div>
				</div>
			</PageLayout>
			<FooterMain />
		</>
	);
};

export default LandingPage;

