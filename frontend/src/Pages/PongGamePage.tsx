import FooterMain from "../Components/FooterMain";
import PongGame from "../Components/Game/PongGame";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";

const PongGamePage = () => {
  return (
    <>
      <Navbar />
      <PageLayout>
        <PongGame />
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default PongGamePage;
