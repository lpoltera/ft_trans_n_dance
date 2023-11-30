import { ReactElement } from "react";
import { Tooltip } from "react-tooltip";

export interface Props {
  onClick: () => void;
  classCustom?: string;
  tooltip?: string;
  tooltipId?: string;
  disabled?: boolean;
  icon: ReactElement;
  type?: "button" | "submit" | "reset" | undefined;
}

const IconButton = ({
  onClick,
  classCustom,
  tooltip,
  tooltipId,
  disabled,
  icon,
  type,
}: Props) => {
  return (
    <>
      <button
        className={classCustom || "w-8 h-8 p-2 rounded-lg text-inherit"}
        onClick={onClick}
        disabled={disabled}
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltip}
        data-tooltip-floating="true"
        type={type}
      >
        {icon}
      </button>
      <Tooltip id={tooltipId || ""} />
    </>
  );
};

export default IconButton;
