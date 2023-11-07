import { ReactNode, useState } from "react";

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
            "absolute right-0.5 top-full bg-white text-black rounded-md overflow-clip z-10 " +
            dropdownVisibility
          }
        >
          <ul className="pt-1 pb-1">
            {links.map((link) => (
              <li key={link.title} className="list-none block">
                <a
                  className="text-black block whitespace-nowrap pl-4 pr-4 pt-2 pb-2 hover:bg-slate-200"
                  href={link.href}
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MenuDropdown;
