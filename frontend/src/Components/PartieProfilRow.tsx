interface Partie {
  id: number;
  player1: string;
  player2: string;
  score: string;
  date: string;
}

interface Props {
  partie: Partie;
}

const PartieProfilRow = ({ partie }: Props) => {
  return (
    <>
      <div className="grid grid-cols-3 hover:bg-neutral-800 py-2 px-3 rounded-md">
        <div className="grid grid-flow-col auto-cols-max text-md">
          <div>{partie.player1}</div>
          <span className="mx-2"> - </span>
          <div>{partie.player2}</div>
        </div>
        <div className="text-md text-center">{partie.score}</div>
        <div className="text-md text-right">{partie.date}</div>
      </div>
    </>
  );
};

export default PartieProfilRow;
