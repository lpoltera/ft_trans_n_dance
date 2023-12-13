import React, { useState, ChangeEvent } from 'react';
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import TournamentsListItem from "../Components/Tournament/TournamentsListItem";
import axios from "axios";
import { useUserContext } from '../contexts/UserContext';

interface Tournament {
	name: string;
	participants: string[];
	difficulty: string;
	mode: string;
	power_ups: boolean;
}

const TournamentsPage: React.FC = () => {
	const { user, userRelations } = useUserContext();
	const [tournaments, setTournaments] = useState<Tournament[]>([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [form, setForm] = useState<Tournament>({
		name: "test name",
		participants: [],
		difficulty: "Normal",
		mode: "3",
		power_ups: false,
	});

	const createTournament = async () => {
		setShowEditModal(false);

		if (user) {
			// store new tournament in tournaments array
			const newTournament: Tournament = { ...form, participants: [...form.participants, user.username], };
			setTournaments([...tournaments, newTournament]);

			console.log("Afficher name : " + newTournament.name)
			console.log("Afficher participants : " + newTournament.participants)
			console.log("Afficher difficulty : " + newTournament.difficulty)
			console.log("Afficher mode : " + newTournament.mode)
			console.log("Afficher power_ups : " + newTournament.power_ups)

			try {
				await axios.post("/api/tournaments/create", newTournament, {
					headers: {
						"Content-Type": "application/json",
					},
				});

				console.log("Tournoi enregistré avec succès dans la base de données.");
			} catch (error) {
				console.error("Erreur lors de l'enregistrement du tournoi :", error);
			}
		}
	};

	const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
		// console.log("handleFormChange called", event.target.value)
		if (event.target.name === "name") {
			setForm({ ...form, name: event.target.value });
		} else if (event.target.name === "difficulty") {
			setForm({ ...form, difficulty: event.target.value });
		} else if (event.target.name === "mode") {
			setForm({ ...form, mode: event.target.value });
		} else if (event.target.name === "power_ups") {
			setForm({ ...form, power_ups: event.target.checked });
		} else if (event.target.name === "participants") {
			if (event.target.checked) {
				let checkboxValue = event.target.value;
				console.log(`Participant ${checkboxValue} added`);
				setForm({ ...form, participants: [...form.participants, checkboxValue] });
			} else {
				let checkboxValue = event.target.value;
				if (checkboxValue !== user?.username) {
					console.log(`Particiapnt ${checkboxValue} removed`);
				}
				setForm({ ...form, participants: form.participants.filter((participant) => participant !== checkboxValue) });
			}
		}
	};


	const updatedUserRelations = [...userRelations, { friend: user }];

	return (
		<>
			<Navbar />
			<PageLayout>
				<h2 className="text-xl mb-4">Liste des tournois</h2>
				<main>
					<div className="w-1/3 h-250">
						<button
							className="bg-emerald-700 hover:bg-emerald-950 rounded-md p-3 mb-5"
							onClick={() => setShowEditModal(true)}
						>
							Ajouter un nouveau tournois
						</button>
					</div>
					{tournaments.map((tournament, index) => (
						<TournamentsListItem key={index} tournament={tournament} />
					))}
				</main>

				{/* [Main Modal] Edit */}
				{showEditModal && (
					<div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center ">
						<div className="relative p-8 bg-grey w-full max-w-2xl mx-auto rounded-md shadow-lg bg-neutral-800">

							<div className="flex flex-col space-y-4">
								<h3 className="text-2xl font-semibold text-center mb-4">Configuration du tournoi</h3>
								<form name="createTournamentForm">
									<div className="flex items-center">
										<p className="font-semibold">
											Nom du tournoi :
										</p>
										<div className="relative ml-3" >
											<input
												type="text"
												className="bg-transparent outline outline-1"
												id="name"
												name="name"
												placeholder="Nom"
												onChange={handleFormChange}
											/>
										</div>
									</div>

									<div className="flex justify-around mt-7">

										<div className="flex flex-col">
											<p className="font-semibold mb-3">
												Liste des Participants
											</p>
											<ul className="flex-col items-center mb-2">
												{updatedUserRelations.map((relation, index) => (
													relation.friend && user && (
														<li key={index}>
															<input
																name="participants"
																type="checkbox"
																className="cursor-pointer bg-slate-200 border-none checked:bg-emerald-500 checked:outline-none focus:outline-none mr-2"
																onChange={handleFormChange}
																value={relation.friend.username}
																checked={form.participants.includes(relation.friend.username) || user.username === relation.friend.username}
															/>
															{relation.friend?.username}
														</li>
													))
												)}
												{/* <li>
														Bryan
													</li> */}
											</ul>
										</div>

									</div>

									{/* Options */}
									<div className="flex justify-around mt-7">
										<div className="flex flex-col">
											<p className="font-semibold mb-3">
												Power Ups
											</p>
											<input
												name="power_ups"
												type="checkbox"
												className="cursor-pointer bg-slate-200 border-none checked:bg-emerald-500 checked:outline-none focus:outline-none"
												onChange={handleFormChange}
											/>
										</div>
										<div onChange={handleFormChange} className="flex flex-col">
											<p className="font-semibold mb-3">
												Mode
											</p>
											<select
												name="mode"
												required
												className="w-full bg-transparent border-white rounded-sm"
											>
												<option className="bg-neutral-800" value="points" >Points</option>
												<option className="bg-neutral-800" value="1972">1972</option>
												<option className="bg-neutral-800" value="time">Time</option>
											</select>
										</div>
										<div onChange={handleFormChange} className="flex flex-col">
											<p className="font-semibold mb-3">
												Difficulté
											</p>
											<select
												name="difficulty"
												required
												className="w-full bg-transparent border-white rounded-sm"
											>
												<option className="bg-neutral-800" value="facile">Facile</option>
												<option className="bg-neutral-800" value="moyen">Moyen</option>
												<option className="bg-neutral-800" value="difficile">Difficile</option>
											</select>
										</div>
									</div>

									<div className="flex justify-end gap-4 text-sm">
										<button
											type="button"
											className="mt-5 py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-800 cursor-pointer"
											onClick={() => createTournament()}
										>
											Créer tournoi
										</button>
										<button
											type="button"
											className="mt-5 py-2 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-pointer"
											onClick={() => setShowEditModal(false)}
										>
											Annuler
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				)}

			</PageLayout>
		</>
	);
}

export default TournamentsPage;