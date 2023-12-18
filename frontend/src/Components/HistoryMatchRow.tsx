import { GameHistoryProps } from "../models/Game";

interface Props {
	partie: GameHistoryProps;
}

const HistoryMatchRow = ({ partie }: Props) => {
	return (
		<div className="grid grid-flow-col grid-cols-5 text-md text-center py-4 hover:bg-neutral-800">
			<div className="pl-4">{partie.name_p1}</div>
			<div className="pl-4">{partie.name_p2}</div>
			<div className="pl-4">{partie.score_p1 + "-" + partie.score_p2}</div>
			<div className="pl-4">{partie.updated_at.substring(0, 10)}</div>
			<div className="pl-4">{partie.status}</div>
		</div>
	);
};

export default HistoryMatchRow;


