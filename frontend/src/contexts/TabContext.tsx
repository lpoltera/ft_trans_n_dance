/* eslint-disable react-refresh/only-export-components */
// TabContext.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface TabContextType {
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
}

const TabContext = createContext<TabContextType>({
  activeTab: 0,
  setActiveTab: () => {},
});

export const useTabContext = () => useContext(TabContext);

interface TabProviderProps {
  children: ReactNode;
  value: TabContextType;
}

export const TabProvider: React.FC<TabProviderProps> = ({
  children,
  value,
}) => <TabContext.Provider value={value}>{children}</TabContext.Provider>;

export default TabContext;
