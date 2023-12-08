import React, { ChangeEvent, useState } from "react";
import {
  PencilSquareIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const TournamentsListItem: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({
    name: "test name",
    participants: ["Nakawashi", "Bryan", "Vragdas"],
    difficulty: "Normal",
    mode: "3",
    power_ups: false,
  });

  const createTournament = async () => {
    setShowEditModal(false);

    console.log("Afficher name : " + form.name);
    console.log("Afficher participants : " + form.participants);
    console.log("Afficher difficulty : " + form.difficulty);
    console.log("Afficher mode : " + form.mode);
    console.log("Afficher power_ups : " + form.power_ups);

    const test = await axios.post("/api/tournaments/create", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log("Test axios : " + test);
  };

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <div className="flex justify-between items-center pr-4 m-1 hover:bg-neutral-800 rounded-md">
        <a href="#" className="py-4 px-4">
          <div className="flex justify-center gap-4">
            <div className="flex flex-col justify-start">
              <p className="text-xl">Nom du tournois</p>
              <p className="text-sm">Créé par [user]</p>
            </div>
          </div>
        </a>
        <div className="grid grid-flow-col grid-cols-3 gap-2">
          {/* [Modal toggle] Edit */}
          <button
            type="button"
            className="w-6 h-6 opacity-50 hover:opacity-100"
            onClick={() => setShowEditModal(true)}
          >
            <PencilSquareIcon />
          </button>

          {/* [Modal toggle] Watch brackets */}
          <button
            type="button"
            className="w-6 h-6 opacity-50 hover:opacity-100"
          >
            <EyeIcon />
          </button>

          <button
            type="button"
            className="w-6 h-6 opacity-50 hover:opacity-100"
            onClick={() => setShowEditModal(true)}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* [Main Modal] Edit */}
      {showEditModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center ">
          <div className="relative p-8 bg-grey w-full max-w-2xl mx-auto rounded-md shadow-lg bg-neutral-800">
            <div className="flex flex-col space-y-4">
              <h3 className="text-2xl font-semibold text-center mb-4">
                Configuration du tournoi
              </h3>
              <form name="createTournamentForm">
                <div className="flex items-center">
                  <p className="font-semibold">Nom du tournoi :</p>
                  <div className="relative ml-3">
                    <input
                      type="text"
                      className="bg-transparent outline outline-1"
                      id="tournamentName"
                      placeholder="Nom"
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="flex justify-around mt-7">
                  <div className="flex flex-col">
                    <p className="font-semibold mb-3">Liste des Participants</p>
                    <ul>
                      <div className="flex items-center mb-2">
                        <input
                          name="withPowerUps"
                          type="checkbox"
                          className="cursor-pointer bg-slate-200 border-none checked:bg-emerald-500 checked:outline-none focus:outline-none"
                        />
                        <li>Bryan</li>
                      </div>
                    </ul>
                  </div>
                </div>

                {/* Options */}
                <div className="flex justify-around mt-7">
                  <div className="flex flex-col">
                    <p className="font-semibold mb-3">Power Ups</p>
                    <input
                      name="withPowerUps"
                      type="checkbox"
                      className="cursor-pointer bg-slate-200 border-none checked:bg-emerald-500 checked:outline-none focus:outline-none"
                      onChange={handleFormChange}
                    />
                  </div>
                  <div onChange={handleFormChange} className="flex flex-col">
                    <p className="font-semibold mb-3">Mode</p>
                    <select
                      name="victoryCondition"
                      required
                      className="w-full bg-transparent border-white rounded-sm"
                    >
                      <option className="bg-neutral-800" value="points">
                        Points
                      </option>
                      <option className="bg-neutral-800" value="1972">
                        1972
                      </option>
                      <option className="bg-neutral-800" value="time">
                        Time
                      </option>
                    </select>
                  </div>
                  <div onChange={handleFormChange} className="flex flex-col">
                    <p className="font-semibold mb-3">Difficulté</p>
                    <select
                      name="difficulty"
                      required
                      className="w-full bg-transparent border-white rounded-sm"
                    >
                      <option className="bg-neutral-800" value={1}>
                        Facile
                      </option>
                      <option className="bg-neutral-800" value={2}>
                        Moyen
                      </option>
                      <option className="bg-neutral-800" value={3}>
                        Difficile
                      </option>
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
    </>
  );
};

export default TournamentsListItem;

// import React, { useState } from "react";
// import { PencilSquareIcon, EyeIcon, PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";

// const TournamentsListItem: React.FC = () => {
// 	const [showEditModal, setShowEditModal] = useState(false);

// 	return (
// 		<>
// 			<div className="flex justify-between items-center pr-4 m-1 hover:bg-neutral-800 rounded-md">
// 				<a href="#" className="py-4 px-4">
// 					<div className="flex justify-center gap-4">
// 						<div className="flex flex-col justify-start">
// 							<p className="text-xl">Nom du tournois</p>
// 							<p className="text-sm">Créé par [user]</p>
// 						</div>
// 					</div>
// 				</a>
// 				<div className="grid grid-flow-col grid-cols-3 gap-2">
// 					{/* [Modal toggle] Edit */}
// 					<button
// 						type="button"
// 						className="w-6 h-6 opacity-50 hover:opacity-100"
// 						onClick={() => setShowEditModal(true)}
// 					>
// 						<PencilSquareIcon />
// 					</button>

// 					{/* [Modal toggle] Watch brackets */}
// 					<button type="button" className="w-6 h-6 opacity-50 hover:opacity-100">
// 						<EyeIcon />
// 					</button>

// 					<button
// 						type="button"
// 						className="w-6 h-6 opacity-50 hover:opacity-100"
// 						onClick={() => setShowEditModal(true)}
// 					>
// 						<TrashIcon />
// 					</button>
// 				</div>
// 			</div>

// 			{/* [Main Modal] Edit */}
// 			{showEditModal && (
// 				<div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center ">
// 					<div className="relative p-8 bg-grey w-full max-w-2xl mx-auto rounded-md shadow-lg bg-neutral-800">

// 						<div className="flex flex-col space-y-4">
// 							<h3 className="text-2xl font-semibold text-center mb-4">Configuration du tournoi</h3>

// 							<div className="flex items-center">
// 								<p className="font-semibold">
// 									Nom du tournoi :
// 								</p>
// 								<div className="relative ml-3" >
// 									<input
// 										type="text"
// 										className="bg-transparent outline outline-1"
// 										id="tournamentName"
// 										placeholder="Nom" />
// 								</div>
// 							</div>

// 							<div className="flex justify-around">

// 								<div className="flex flex-col">
// 									<p className="font-semibold mb-3">
// 										Liste des Participants
// 									</p>
// 									<ul>
// 										<div className="flex items-center mb-2">
// 											<button
// 												type="button"
// 												className="w-6 h-6 opacity-80 hover:opacity-100 p-0.5 mr-2 bg-red-600 rounded"
// 											>
// 												<MinusIcon />
// 											</button>
// 											<li>
// 												Bryan
// 											</li>
// 										</div>
// 										<div className="flex items-center mb-2">
// 											<button
// 												type="button"
// 												className="w-6 h-6 opacity-80 hover:opacity-100 p-0.5 mr-2 bg-red-600 rounded"
// 											>
// 												<MinusIcon />
// 											</button>
// 											<li>
// 												Laurent
// 											</li>
// 										</div>
// 									</ul>

// 								</div>

// 								<div className="flex flex-col">
// 									<p className="font-semibold mb-3">
// 										Liste des joueurs
// 									</p>
// 									<ul>
// 										<div className="flex items-center mb-2">
// 											<button
// 												type="button"
// 												className="w-6 h-6 opacity-80 hover:opacity-100 p-0.5 mr-2 bg-emerald-600 rounded"
// 											>
// 												<PlusIcon />
// 											</button>
// 											<li>
// 												Lucas
// 											</li>
// 										</div>
// 										<div className="flex items-center mb-2">
// 											<button
// 												type="button"
// 												className="w-6 h-6 opacity-80 hover:opacity-100 p-0.5 mr-2 bg-emerald-600 rounded"
// 											>
// 												<PlusIcon />
// 											</button>
// 											<li>
// 												Lucie
// 											</li>
// 										</div>
// 										<div className="flex items-center mb-2">
// 											<button
// 												type="button"
// 												className="w-6 h-6 opacity-80 hover:opacity-100 p-0.5 mr-2 bg-emerald-600 rounded"
// 											>
// 												<PlusIcon />
// 											</button>
// 											<li>
// 												Raphael
// 											</li>
// 										</div>
// 									</ul>
// 								</div>

// 							</div>

// 							{/* Options */}
// 							<div className="flex justify-around">
// 								<div className="flex flex-col">
// 									<p className="font-semibold mb-3">
// 										Power Ups
// 									</p>
// 									<input
// 										name="withPowerUps"
// 										type="checkbox"
// 										className="cursor-pointer bg-slate-200 border-none checked:bg-emerald-500 checked:outline-none focus:outline-none"
// 									/>
// 								</div>
// 								<div className="flex flex-col">
// 									<p className="font-semibold mb-3">
// 										Condition de victoire
// 									</p>
// 									<select
// 										name="victoryCondition"
// 										required
// 										className="w-full bg-transparent border-white rounded-sm"
// 									>
// 										<option className="bg-neutral-800" value="points">Points</option>
// 										<option className="bg-neutral-800" value="1972">1972</option>
// 										<option className="bg-neutral-800" value="time">Time</option>
// 									</select>
// 								</div>
// 								<div className="flex flex-col">
// 									<p className="font-semibold mb-3">
// 										Difficulté
// 									</p>
// 									<select
// 										name="difficulty"
// 										required
// 										className="w-full bg-transparent border-white rounded-sm"
// 									>
// 										<option className="bg-neutral-800" value={1}>Facile</option>
// 										<option className="bg-neutral-800" value={2}>Moyen</option>
// 										<option className="bg-neutral-800" value={3}>Difficile</option>
// 									</select>
// 								</div>
// 							</div>

// 							<div className="flex justify-end gap-4 text-sm">
// 								<button
// 									type="button"
// 									className="mt-5 py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-800 cursor-pointer"
// 									onClick={() => setShowEditModal(false)}
// 								>
// 									Enregistrer
// 								</button>
// 								<button
// 									type="button"
// 									className="mt-5 py-2 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-pointer"
// 									onClick={() => setShowEditModal(false)}
// 								>
// 									Annuler
// 								</button>
// 								<button
// 									type="button"
// 									className="mt-5 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
// 									onClick={() => setShowEditModal(false)}
// 								>
// 									Clôturer
// 								</button>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			)}

// 		</>
// 	);
// };

// export default TournamentsListItem;
