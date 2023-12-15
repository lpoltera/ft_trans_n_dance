import { RankingProps } from "../models/Game";

interface Props {
	joueur: RankingProps;
	id: number;
}

const RankingPlayersRow = ({ joueur, id }: Props) => {
	return (
		<div className="grid grid-flow-col grid-cols-6 text-md text-center py-2 hover:bg-neutral-800">
			<div className="pl-4">{id}</div>
			<div className="pl-4">{joueur.name}</div>
			<div className="pl-4">{joueur.wins}</div>
			<div className="pl-4">{joueur.losses}</div>
			<div className="pl-4">{joueur.goals_scored}</div>
			<div className="pl-4">{joueur.goals_conceded}</div>
		</div>
	);
};
export default RankingPlayersRow;