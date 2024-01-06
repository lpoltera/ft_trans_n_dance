import { ChangeEvent, useState } from "react";
import avatar1 from "../assets/pong-avatar-1.png";
import avatar2 from "../assets/pong-avatar-2.png";
import avatar3 from "../assets/pong-avatar-3.png";
import avatar4 from "../assets/pong-avatar-4.png";

interface Props {
	onChange: (avatar: string) => void;
}

const AvatarRadioSelect = ({ onChange }: Props) => {
	const avatars = [
		{ id: "avatar-0", path: avatar1 },
		{ id: "avatar-1", path: avatar2 },
		{ id: "avatar-2", path: avatar3 },
		{ id: "avatar-3", path: avatar4 },
	];
	const [selectedAvatar, setSelectedAvatar] = useState<
		string | ArrayBuffer | null
	>("avatar-1");
	const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);

	const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSelectedAvatar(event.target.id);
		onChange(event.target.value);
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
		const file = event.target.files[0];
		const maxFileSize = 2240 * 2240; // env 5MB
		const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
		const reader = new FileReader();
		if (file.size > maxFileSize) {
			alert("The file is too large. Please select a file smaller than 5MB.");
			return;
		}

		if (!validImageTypes.includes(file.type)) {
			alert("Invalid file type. Please select a JPEG, PNG, or GIF image.");
			return;
		}

		reader.onloadend = () => {
			const result = reader.result as string;
			setUploadedAvatar(result);
			setSelectedAvatar("custom");
			onChange(result);
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="flex flex-row gap-4">
			{/* Render predefined avatars */}
			{avatars.map((avatar, index) => (
				<div key={index} className="relative p-1">
					<input
						type="radio"
						id={`avatar-${index}`}
						name="avatar"
						value={avatar.path}
						checked={selectedAvatar === avatar.id}
						onChange={handleAvatarChange}
						className="absolute top-0 left-0 w-full h-full appearance-none checked:bg-purple-500 indeterminate:bg-purple-500 hover:bg-purple-500 checked:hover:bg-purple-500"
					/>
					<label htmlFor={`avatar-${index}`}>
						<img
							src={avatar.path}
							alt={`Avatar ${index}`}
							className="w-16 h-16 rounded-full relative"
						/>
					</label>
				</div>
			))}

			{/* Render file input for custom avatar */}
			{uploadedAvatar ? (
				<div className="flex items-center space-x-6">
					<div className="flex flex-col items-center">ou</div>
					<label htmlFor="upload-avatar" className="cursor-pointer">
						<span
							className="block w-full text-sm text-[#f67539] border-2 border-[#f67539]  py-2 px-4 rounded-full
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-[#f67539] file:text-[#f67539]
              hover:file:bg-[#f67539] hover:bg-[#f67539] hover:text-white"
						>
							Téléverser un avatar
						</span>
						<input
							type="file"
							id="upload-avatar"
							name="avatar"
							accept="image/*"
							onChange={handleFileChange}
							style={{ display: "none" }}
						/>
					</label>

					<div className="relative p-1">
						<input
							type="radio"
							id="custom-avatar"
							name="avatar"
							value={uploadedAvatar}
							checked={selectedAvatar === "custom"}
							onChange={handleAvatarChange}
							className="absolute top-0 left-0 w-full h-full appearance-none checked:bg-purple-500 indeterminate:bg-purple-500 hover:bg-purple-500 checked:hover:bg-purple-500"
						/>
						<label htmlFor="custom-avatar">
							<img
								src={uploadedAvatar}
								alt="Custom avatar"
								className="w-16 h-16 rounded-full relative"
							/>
						</label>
					</div>
				</div>
			) : (

				<div className="flex items-center space-x-6">
					<div className="flex flex-col items-center">ou</div>
					<label htmlFor="upload-avatar" className="cursor-pointer">
						<span
							className="block w-full text-sm text-[#f67539] border-2 border-[#f67539] py-2 px-4 rounded-full
							file:mr-4 file:py-2 file:px-4
							file:rounded-full file:border-0
							file:text-sm file:font-semibold
							file:bg-[#f67539] file:text-[#f67539]
							hover:file:bg-[#f67539] hover:bg-[#f67539] hover:text-white"
						>
							Téléverser un avatar
						</span>
						<input
							type="file"
							id="upload-avatar"
							name="avatar"
							accept="image/*"
							onChange={handleFileChange}
							style={{ display: "none" }}
						/>
					</label>
				</div>
			)}
		</div>
	);
};

export default AvatarRadioSelect;

// const AvatarRadioSelect = () => {
//   const Avatars = [
//     { id: "avatar-1", path: avatar1 },
//     { id: "avatar-2", path: avatar2 },
//     { id: "avatar-3", path: avatar3 },
//   ];
//   const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
//     "avatar-cat"
//   );

//   // Fonction pour gérer le changement de l'avatar sélectionné
//   const handleChange = (newAvatar: string) => {
//     setSelectedAvatar(newAvatar);
//   };

//   // Fonction pour générer les classes pour l'image, en ajoutant 'opacity-50' si non sélectionnée
//   const imageClasses = (avatarId: string) => {
//     const baseClasses = `object-cover w-16 h-16 rounded-full ${
//       avatarId !== selectedAvatar ? "opacity-50" : ""
//     }`;
//     return baseClasses;
//   };

//   return (
//     <>
//       {Avatars.map((avatar) => (
//         <div key={avatar.id} onClick={() => handleChange(avatar.id)}>
//           <input
//             id={avatar.id}
//             name="avatar"
//             type="radio"
//             className="hidden"
//             value={avatar.path}
//             checked={selectedAvatar === avatar.id}
//             onChange={() => handleChange(avatar.id)}
//           />
//           <label htmlFor={avatar.id}>
//             <img
//               src={avatar.path}
//               alt={avatar.id}
//               className={imageClasses(avatar.id)}
//             />
//           </label>
//         </div>
//       ))}
//     </>
//   );
// };

// export default AvatarRadioSelect;
