import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick: () => void;
}
const ButtonIcon = ({ children, onClick }: Props) => {
  return (
    <button
      className="text-inherit h-10 w-10 hover:bg-neutral-800 p-2 rounded-lg"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonIcon;
