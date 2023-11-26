import FooterMain from "../Components/FooterMain";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import PongGame from "../Components/PongGame";

interface PlayerProps {
  username: string;
  isAi: boolean;
}

interface Props {
  difficulty: number;
  withPowerUps: boolean;
  victoryCondition: {
    type: "points" | "time";
    value: number;
  };
  player1: PlayerProps;
  player2: PlayerProps;
}

const PongGamePage = () => {
  const players: Props = {
    difficulty: 1,
    withPowerUps: false,
    victoryCondition: { type: "time", value: 10 },
    player1: { username: "Tito", isAi: false },
    player2: { username: "Lucas", isAi: true },
  };

  return (
    <>
      <Navbar />
      <PageLayout>
        <PongGame {...players} />
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default PongGamePage;
