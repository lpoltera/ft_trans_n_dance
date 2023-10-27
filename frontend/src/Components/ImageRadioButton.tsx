import { useState } from "react";

interface Props {
  selected?: boolean;
  img: string;
  id: string;
  name: string;
  onClick?: () => void;
}

const ImageRadioButton = ({
  selected = false,
  img,
  id,
  name,
  onClick,
}: Props) => {
  const [isSelected, setIsSelected] = useState<boolean>(selected);

  const imageClasses = "object-cover w-16 h-16 rounded-full";
  const handleChange = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div onClick={onClick} className={isSelected ? "" : "opacity-50"}>
      <input
        id={id}
        name={name}
        type="radio"
        className="hidden"
        checked={isSelected}
        onChange={handleChange}
      />
      <label htmlFor={id}>
        <img src={img} alt={id} className={imageClasses} />
      </label>
    </div>
  );
};

export default ImageRadioButton;
