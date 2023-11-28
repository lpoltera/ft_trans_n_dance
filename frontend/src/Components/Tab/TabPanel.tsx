import React from "react";
import { useTabContext } from "../../contexts/TabContext";

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  customClass?: string;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  index,
  customClass,
}) => {
  const { activeTab } = useTabContext();

  if (index !== activeTab) return null;

  return <div className={customClass || "mt-4"}>{children}</div>;
};

export default TabPanel;
