import React from "react";
import { useTabContext } from "../../contexts/TabContext";

interface TabProps {
  children: React.ReactNode;
  index: number;
}

const Tab: React.FC<TabProps> = ({ children, index }) => {
  const { activeTab, setActiveTab } = useTabContext();
  const isActive = index === activeTab;

  return (
    <button
      className={`py-2 text-white ${isActive ? "opacity-100" : "opacity-50"}`}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
};

export default Tab;
