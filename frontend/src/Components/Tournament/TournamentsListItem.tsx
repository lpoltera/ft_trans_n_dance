import React from 'react';
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from 'axios';


interface TournamentsListItemProps {
	handleStatsButtonClick: (tournamentName: string) => void;
	tournoi: string[];
}


const TournamentsListItem: React.FC<TournamentsListItemProps> = ({ tournoi, handleStatsButtonClick }) => {

	console.log("tournoi name", tournoi[0])
	console.log("tournoi creator", tournoi[1])

	const deleteTournament = async () => {
		const isConfirmed = window.confirm(
			"Êtes-vous sûr de vouloir supprimer ce tournoi ?"
		);
		if (isConfirmed) {
			try {
				await axios.delete(`/api/tournaments/${tournoi[0]}`);
				console.log("Le tournois a bien pu être supprimé");
				window.location.reload();
			} catch (error) {
				console.error("Erreur lors de la suppression du tournoi :", error);
			}
		}
	};

	return (
		<>
			<div className="flex justify-between items-center pr-4 m-1 hover:bg-neutral-800 rounded-md">
				<a href="#" className="py-4 px-4">
					<div className="flex justify-center gap-4">
						<div className="flex flex-col justify-start">
							<p className="text-xl">{tournoi[0]} </p>
							<p className="text-sm">Créé par {tournoi[1]}</p>
						</div>
					</div>
				</a>
				<div className="grid grid-flow-col grid-cols-2 gap-3">
					<button type="button" className="w-6 h-6 opacity-50 hover:opacity-100"
						onClick={() => handleStatsButtonClick(tournoi[0])}
					>
						<EyeIcon />
					</button>
					<button
						type="button"
						className="w-6 h-6 opacity-50 hover:opacity-100"
						onClick={() => deleteTournament()}
					>
						<TrashIcon />
					</button>
				</div>
			</div>
		</>
	);
};

export default TournamentsListItem;
