import React, { useState } from 'react';
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import TournamentsListItem from "../Components/Tournament/TournamentsListItem";

const TournamentsPage: React.FC = () => {
	const [tournamentList, setTournamentList] = useState<string[]>([]);

	const addNewItem = () => {
		const newItemId = new Date().toISOString();
		setTournamentList((prevList) => [...prevList, newItemId]);
	}

	return (
		<>
			<Navbar />
			<PageLayout>
				<h2 className="text-xl mb-4">Liste des tournois</h2>
				<main>
					<div className="w-1/3 h-250">
					<button
						className="bg-emerald-700 hover:bg-emerald-950 rounded-md p-3 mb-5"
						onClick={addNewItem}
						>
							Créer un nouveau tournois
					</button>
					{tournamentList.map((itemId) => (
						<TournamentsListItem key={itemId} />
					))}
					</div>
				</main>

			</PageLayout>
		</>
	);
}

export default TournamentsPage;