import FooterMain from "../Components/FooterMain";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import PongGame from "../Components/PongGame";

const PongGamePage = () => {
  return (
    <>
      <Navbar />
      <PageLayout>
        <PongGame
          difficulty={3}
          withPowerUps={false}
          victoryCondition={{ type: "time", value: 300 }}
        />
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default PongGamePage;
