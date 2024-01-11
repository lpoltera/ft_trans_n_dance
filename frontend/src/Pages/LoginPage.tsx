import FooterMain from "../Components/FooterMain";
import FormLogin from "../Components/FormLogin";
import PageLayout from "../Components/PageLayout";
import AnimatedBalls from "../Components/AnimatedBalls";

const LoginPage = () => {

	return (
		<>
			<PageLayout>
				<AnimatedBalls />
				<div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12 z-10">
					<FormLogin></FormLogin>
				</div>
			</PageLayout>
			<FooterMain />
		</>
	);
};

export default LoginPage;
