import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PageLayout = ({ children }: Props) => {
  return (
    <>
      <div className="pt-24 pb-20 pr-16 pl-16 bg-cyan-900 h-screen w-screen flex flex-col text-white ">
        {children}
      </div>
    </>
  );
};

export default PageLayout;
