import React from "react";
import { useTabContext } from "../../contexts/TabContext";

interface TabProps {
  children: React.ReactNode;
  index: number;
  classInactive?: string;
  classActive?: string;
}

const Tab = ({ children, index, classInactive, classActive }: TabProps) => {
  const { activeTab, setActiveTab } = useTabContext();
  const isActive = index === activeTab;
  const inactiveClass = classInactive || "opacity-50";
  const activeClass = classActive || "opacity-100";

  return (
    <button
      className={`py-2 text-white ${isActive ? activeClass : inactiveClass}`}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
};

export default Tab;
