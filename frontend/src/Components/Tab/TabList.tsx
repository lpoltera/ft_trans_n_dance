import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  classCustom?: string;
}

function TabList({ children, classCustom }: Props) {
  return <div className={classCustom || "flex gap-6"}>{children}</div>;
}

export default TabList;
