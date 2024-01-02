import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

type Links = {
  title: string;
  href: string;
};

interface Props {
  children: ReactNode;
  links: Links[];
}

const MenuDropdown = ({ children, links }: Props) => {
  const [dropdownVisibility, setDropdownVisibility] = useState("hidden");
  const navigate = useNavigate();

  const checkIfGame = () => {
    return /\/game\/\d+/.test(location.pathname);
  };
  const navigateTo = (link: string) => {
    if (checkIfGame()) {
      const isConfirm = window.confirm(
        "Êtes-vous sûr de vouloir quitter le jeu ?"
      );
      if (isConfirm) {
        navigate(link);
      } else {
        return;
      }
    } else {
      navigate(link);
    }
  };
  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setDropdownVisibility("")}
        onMouseLeave={() => setDropdownVisibility("hidden")}
      >
        {children}
        <div
          className={
            "absolute right-0.5 top-full bg-neutral-800 text-white rounded-md overflow-clip z-10 " +
            dropdownVisibility
          }
        >
          <ul className="pt-1 pb-1">
            {links.map((link) => (
              <li key={link.title} className="list-none block">
                <button
                  className="w-full text-left block whitespace-nowrap pl-4 pr-4 pt-2 pb-2 hover:text-[#f67539]"
                  // href={link.href}
                  onClick={() => navigateTo(link.href)}
                >
                  {link.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MenuDropdown;
