import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function TabList({ children }: Props) {
  return <div className="flex gap-6">{children}</div>;
}

export default TabList;
