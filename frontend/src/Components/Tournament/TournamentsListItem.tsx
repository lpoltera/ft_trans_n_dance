import React from 'react';
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from 'axios';


interface TournamentsListItemProps {
	handleStatsButtonClick: (tournamentName: string) => void;
	handleTournamentListChange: () => void;
	tournoi: string[];
	username: string;
}


const TournamentsListItem: React.FC<TournamentsListItemProps> = ({ tournoi, username, handleStatsButtonClick, handleTournamentListChange }) => {

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
				handleTournamentListChange();
				// window.location.reload();
			} catch (error) {
				console.error("Erreur lors de la suppression du tournoi :", error);
			}
		}
	};

	return (
		<>
			<div className="flex justify-between items-center pr-4 m-1 hover:bg-[#f67539] rounded-md">
				<a href="#" className="py-4 px-4">
					<div className="flex justify-center gap-4">
						<div className="flex flex-col justify-start">
							<p className="text-xl">{tournoi[0]} </p>
							<p className="text-sm">Créé par {tournoi[1]}</p>
						</div>
					</div>
				</a>
				<div className="grid grid-flow-col gap-3 pl-12">
					{tournoi[1] === username && (
						<button
							type="button"
							className="w-6 h-6 opacity-50 hover:opacity-100 "
							onClick={() => deleteTournament()}
						>
							<TrashIcon />
						</button>
					)}
					<button type="button" className="w-6 h-6 opacity-50 hover:opacity-100"
						onClick={() => handleStatsButtonClick(tournoi[0])}
					>
						<EyeIcon />
					</button>
				</div>
			</div>
		</>
	);
};

export default TournamentsListItem;