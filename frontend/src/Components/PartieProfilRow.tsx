import { GameHistoryProps } from "../models/Game";

interface Props {
  partie: GameHistoryProps;
}

const PartieProfilRow = ({ partie }: Props) => {
  return (
    <>
      <div className="grid grid-flow-col grid-cols-4 text-xl">
        <div>{partie.name_p1}</div>
        <div>{partie.name_p2}</div>
        <div>{partie.score_p1 + "-" + partie.score_p2}</div>
        <div>{partie.updated_at.substring(0, 10)}</div>
      </div>
      {/* <div className="grid grid-cols-3 hover:bg-[#f67539] py-2 px-3 rounded-md">
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
      </div> */}
    </>
  );
};

export default PartieProfilRow;
