import React from 'react';
import { PencilSquareIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";



interface TournamentsListItemProps {
	handleStatsButtonClick: (tournamentName: string) => void;
	name: string;
	creator: string;
}


const TournamentsListItem: React.FC<TournamentsListItemProps> = ({ name, creator, handleStatsButtonClick }) => {

	console.log("name", name)
	console.log("creator", creator)

	return (
		<>
			<div className="flex justify-between items-center pr-4 m-1 hover:bg-neutral-800 rounded-md">
				<a href="#" className="py-4 px-4">
					<div className="flex justify-center gap-4">
						<div className="flex flex-col justify-start">
							<p className="text-xl">{name} </p>
							<p className="text-sm">Créé par {creator}</p>
						</div>
					</div>
				</a>
				<div className="grid grid-flow-col grid-cols-3 gap-3">
					{/* [Modal toggle] Edit */}
					<button
						type="button"
						className="w-6 h-6 opacity-50 hover:opacity-100"
					>
						<PencilSquareIcon />
					</button>

					{/* [Modal toggle] Watch brackets */}
					<button type="button" className="w-6 h-6 opacity-50 hover:opacity-100"
						onClick={() => handleStatsButtonClick(name)}
					>
						<EyeIcon />
					</button>

					<button
						type="button"
						className="w-6 h-6 opacity-50 hover:opacity-100"
					>
						<TrashIcon />
					</button>
				</div>
			</div>
		</>
	);
};

export default TournamentsListItem;
