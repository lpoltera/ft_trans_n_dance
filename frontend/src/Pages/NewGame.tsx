import FooterMain from "../Components/FooterMain";
import GameForm from "../Components/Game/GameForm";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";

const NewGame = () => {
  return (
    <>
      <Navbar />
      <PageLayout>
        <div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12">
          <h1 className="text-3xl">Paramètre de la partie</h1>
          <GameForm />
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default NewGame;
