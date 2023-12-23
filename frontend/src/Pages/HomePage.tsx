import { ChangeEvent, useEffect, useState } from "react";
import FooterMain from "../Components/FooterMain";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import PodiumList from "../Components/PodiumList";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { GameHistoryProps } from "../models/Game";
import axios from "axios";

const HomePage = () => {
	const navigate = useNavigate();
	const [checkedId, setCheckedId] = useState<string | null>(null);
	const { user, loadingUser, userRelations } = useUserContext();
	const [showEditModal, setShowEditModal] = useState(false);
	const [form, setForm] = useState<GameHistoryProps>({
		id: 0,
		name_p1: "",
		name_p2: "",
		score_p1: 0,
		score_p2: 0,
		// updated_at: "",
		difficulty: "facile",
		mode: "1972",
		mode_value: 0,
		power_ups: false,
		status: "pending",
	});

	useEffect(() => {
		if (!loadingUser) {
			return;
		}
	}, [loadingUser]);

	const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
		// console.log("handleFormChange called", event.target.value)
		if (event.target.name === "name_p2") {
			setForm({ ...form, name_p2: event.target.value });
		} else if (event.target.name === "difficulty") {
			setForm({ ...form, difficulty: event.target.value });
		} else if (event.target.name === "mode") {
			setForm({ ...form, mode: event.target.value });
		} else if (event.target.name === "power_ups") {
			setForm({ ...form, power_ups: event.target.checked });
		} else if (event.target.name === "mode_value") {
			setForm({ ...form, mode_value: +event.target.value });
		}
	};

	const onlyOneCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
		console.log("onlyOneCheckbox called value : ", event.target.value);
		setCheckedId(event.target.value);
		setForm({ ...form, name_p2: event.target.value });
	}


	const createGame = async () => {
		// if (form.participants.length !== 1) {
		// 	window.alert(`Le nombre de participants doit être égal à 1`); // logique à revoir (lorsque on sélectionne un adversaire le précédent est déselectionné)
		// 	return;
		// }
		// envoyer une invitation à name_p2
		// navigate to avec id de la partie en paramètre
		setShowEditModal(false);
		if (user) {
			form.name_p1 = user.username;
			console.log("form : ", form);
			try {
				const response = await axios.post("/api/game/create", form, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				console.log("Partie enregistrée avec succès dans la base de données. id = ", response.data);
				navigate("/game/" + response.data);
			} catch (error) {
				console.error("Erreur lors de l'enregistrement de la partie :", error);
			}
		}
	};

	const resestForm = () => {
		setShowEditModal(false);
		setForm({
			id: 0,
			name_p1: "",
			name_p2: "",
			score_p1: 0,
			score_p2: 0,
			// updated_at: "",
			difficulty: "facile",
			mode: "1972",
			mode_value: 0,
			power_ups: false,
			status: "pending",
		});
	}

	const navigateToGame = () => {
		navigate("/game");
	}

	return (
		<>
			<Navbar />
			<PageLayout>
				<div className="w-full h-full grow flex flex-col items-center">
					<img
						className="absolute top-0 left-0 w-screen h-screen"
						src="src/assets/homepage-bkg.png"
						alt="background"
					></img>
					<h1 className="text text-5xl font-bold z-10">C'est là que tout commence !</h1>
					<div className="h-screen flex items-center z-10 mt-24 mr-8 ">
						<button
							// href="/game"
							className="py-2 px-4 rounded-md border-4 text-black border-black z-10 font-bold hover:bg-[#f67539] hover:bg-opacity-70 hover:text-white"
							type="button"
							onClick={() => navigateToGame()}
						>
							Partie rapide
						</button>
						<button
							// href="/new-game"
							type="button"
							className="py-2 px-4 ml-4 rounded-md border-4 text-black border-black z-10 font-bold hover:bg-[#f67539] hover:bg-opacity-70 hover:text-white"
							onClick={() => setShowEditModal(true)}
						>
							Nouvelle partie
						</button>
					</div>
				</div>
				{/* --------------------------------------- Modal --------------------------------------- */}
				{showEditModal && (
					<div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black/60">
						<div className="relative p-8 bg-grey w-full max-w-2xl mx-auto rounded-md shadow-lg bg-neutral-800">
							<div className="flex flex-col space-y-4">
								<h3 className="text-2xl font-semibold text-center mb-4">Configuration de la partie</h3>
								<form name="createGameForm">
									<div className="flex justify-around mt-7">
										<div className="flex flex-col">
											<p className="font-semibold mb-3">
												Adversaire
											</p>
											<ul className="flex-col items-center mb-2">
												{userRelations.map((relation, index) => (
													relation.friend && user && (
														<li key={index}>
															<input
																name="name_p2"
																type="checkbox"
																className="cursor-pointer bg-slate-200 border-none checked:bg-emerald-500 checked:outline-none focus:outline-none mr-2"
																checked={checkedId === relation.friend.username}
																onChange={onlyOneCheckbox}
																value={relation.friend.username}
															/>
															{relation.friend?.username}
														</li>
													))
												)}
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
												<option className="bg-neutral-800" value="1972" >1972</option>
												<option className="bg-neutral-800" value="points">Points</option>
												<option className="bg-neutral-800" value="time">Time</option>
											</select>
										</div>
										{(form.mode === "points" || form.mode === "time") && (
											<div onChange={handleFormChange} className="flex flex-col">
												<p className="font-semibold mb-3">
													Value
												</p>
												<input
													name="mode_value"
													type="number"
													className="w-full bg-transparent border-white rounded-sm"
												/>
											</div>
										)}
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
											onClick={() => createGame()}
										>
											Envoyer invitation
										</button>
										<button
											type="button"
											className="mt-5 py-2 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-pointer"
											onClick={() => resestForm()}
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
			<FooterMain />
		</>
	);
};

export default HomePage;
