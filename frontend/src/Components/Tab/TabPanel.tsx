import React from "react";
import { useTabContext } from "../../contexts/TabContext";

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, index }) => {
  const { activeTab } = useTabContext();

  if (index !== activeTab) return null;

  return <div className="mt-4">{children}</div>;
};

export default TabPanel;
