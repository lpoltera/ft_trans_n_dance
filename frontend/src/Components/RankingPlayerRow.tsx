import { RankingProps } from "../models/Game";

interface Props {
	joueur: RankingProps;
	id: number;
}

const RankingPlayersRow = ({ joueur, id }: Props) => {
	return (
		<div className="grid grid-flow-col grid-cols-6 text-md text-center py-2 hover:bg-[#f67539]">
			{/* <div className={id < 4 ? "pl-4 text-2xl" : "pl-4"}> */}
			<div className={id === 1 ? "pl-4 text-3xl" : id === 2 ? "pl-4 text-2xl" : id === 3 ? "pl-4 text-xl" : "pl-4"}>
				{id === 1 ? '🥇' : id === 2 ? '🥈' : id === 3 ? '🥉' : id}
			</div>
			<div className="pl-4">{joueur.name}</div>
			<div className="pl-4">{joueur.wins}</div>
			<div className="pl-4">{joueur.losses}</div>
			<div className="pl-4">{joueur.goals_scored}</div>
			<div className="pl-4">{joueur.goals_conceded}</div>
		</div >
	);
};
export default RankingPlayersRow;