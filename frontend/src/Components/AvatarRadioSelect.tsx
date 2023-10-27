import { useState } from "react";
import avatar from "../assets/avatar-1.png";

const AvatarRadioSelect = () => {
  const Avatars = [
    { id: "avatar-1", path: avatar },
    { id: "avatar-2", path: avatar },
    { id: "avatar-3", path: avatar },
  ];
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    "avatar-1"
  );

  // Fonction pour gérer le changement de l'avatar sélectionné
  const handleChange = (newAvatar: string) => {
    setSelectedAvatar(newAvatar);
  };

  // Fonction pour générer les classes pour l'image, en ajoutant 'opacity-50' si non sélectionnée
  const imageClasses = (avatarId: string) => {
    const baseClasses = `object-cover w-16 h-16 rounded-full ${
      avatarId !== selectedAvatar ? "opacity-50" : ""
    }`;
    return baseClasses;
  };

  return (
    <>
      {Avatars.map((avatar) => (
        <div key={avatar.id} onClick={() => handleChange(avatar.id)}>
          <input
            id={avatar.id}
            name="avatar"
            type="radio"
            className="hidden"
            value={avatar.path}
            checked={selectedAvatar === avatar.id}
            onChange={() => handleChange(avatar.id)}
          />
          <label htmlFor={avatar.id}>
            <img
              src={avatar.path}
              alt={avatar.id}
              className={imageClasses(avatar.id)}
            />
          </label>
        </div>
      ))}
    </>
  );
};

export default AvatarRadioSelect;
