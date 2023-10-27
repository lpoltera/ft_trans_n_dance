import FooterMain from "../Components/FooterMain";
import PageLayout from "../Components/PageLayout";

const LandingPage = () => {
  return (
    <>
      <PageLayout>
        <div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12">
          <div className="text-center">
            <h1 className="text-9xl flex flex-col leading-none">
              <span className="flex flex-row items-start">
                PONG<sup className="text-base">42</sup>
              </span>
            </h1>
            <h2 className="text-xl text-gray-300 font-light ml-2 tracking-widest">
              ft_transcendance @42Lausanne
            </h2>
          </div>
          <div className="flex gap-4">
            <button
              className="bg-white text-black py-2 px-4 rounded-md border border-white"
              onClick={() => (window.location.href = "/login")}
            >
              Se connecter
            </button>
            <button
              className="py-2 px-4 rounded-md border border-white"
              onClick={() => (window.location.href = "/signin")}
            >
              S'inscrire
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
