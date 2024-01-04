import FooterMain from "../Components/FooterMain";
import PageLayout from "../Components/PageLayout";

const LandingPage = () => {
	return (
		<>
			<PageLayout>
				<div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12">
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
							className=" text-white py-2 px-4 rounded-md border hover:bg-[#f67539] hover:border-none"
							onClick={() => (window.location.href = "/login")}
						>
							Se connecter
						</button>
						<button
							className="py-2 px-4 rounded-md border border-white hover:bg-[#f67539] hover:border-none"
							onClick={() => (window.location.href = "/signin")}
						>
							S'inscrire
						</button>
						<button
							className="py-2 px-4 rounded-md border border-white hover:bg-[#f67539] hover:border-none"
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

{
	/* <>
<PageHeader>Homepage</PageHeader>
<main className="h-full">
	<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
		<div className="flex items-center justify-center h-full w-full pt-10">
			<div className="max-w-xl">
				<FormLogin />
			</div>
		</div>
	</div>
</main>
</> */
}
