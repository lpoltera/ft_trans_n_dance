// TabContainer.tsx
import React, { useState, ReactNode } from "react";
import { TabProvider } from "../../contexts/TabContext";

interface TabContainerProps {
  children: ReactNode;
}

const TabContainer: React.FC<TabContainerProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TabProvider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabProvider>
  );
};

export default TabContainer;
