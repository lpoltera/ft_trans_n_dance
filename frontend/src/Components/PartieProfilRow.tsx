interface Partie {
  id: number;
  name_p1: string;
  name_p2: string;
  score_p1: number;
  score_p2: number;
  updated_at: string;
}

interface Props {
  partie: Partie;
}

const PartieProfilRow = ({ partie }: Props) => {
  return (
    <>
      <div className="grid grid-cols-3 hover:bg-neutral-800 py-2 px-3 rounded-md">
        <div className="grid grid-flow-col auto-cols-max text-md">
          <div>{partie.name_p1}</div>
          <span className="mx-2"> - </span>
          <div>{partie.name_p2}</div>
        </div>
        <div className="text-md text-center">
          {partie.score_p1 + "-" + partie.score_p2}
        </div>
        <div className="text-md text-right">
          {partie.updated_at.substring(0, 10)}
        </div>
      </div>
    </>
  );
};

export default PartieProfilRow;
