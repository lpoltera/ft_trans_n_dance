import FooterMain from "../Components/FooterMain";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import PodiumList from "../Components/PodiumList";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <PageLayout>
        <div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12">
          <h1 className="text text-5xl">C'est là que tout commence !</h1>
          <div className="flex gap-4">
            <button
              className="bg-white text-black py-2 px-4 rounded-md border border-white"
              type="button"
            >
              Partie rapide
            </button>
            <button
              className="py-2 px-4 rounded-md border border-white"
              type="button"
            >
              Nouvelle partie
            </button>
          </div>
          <PodiumList />
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default HomePage;
