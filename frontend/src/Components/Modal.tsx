import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  visibility: boolean;
}

const Modal = ({ children, visibility }: Props) => {
  return (
    <div
      className={`fixed top-0 bottom-0 right-0 left-0 flex-col items-center justify-center bg-opacity-50 bg-neutral-900 backdrop-blur-md z-50 pointer-events-none ${
        visibility ? " flex" : " hidden"
      }`}
    >
      <div className="bg-neutral-950 bg-opacity-100 p-8 border border-white">
        {children}
      </div>
    </div>
  );
};

export default Modal;
