import FooterMain from "../Components/FooterMain";
import FormLogin from "../Components/FormLogin";
import PageLayout from "../Components/PageLayout";

const LoginPage = () => {
  return (
    <>
      <PageLayout>
        <div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12">
          <FormLogin></FormLogin>
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default LoginPage;
