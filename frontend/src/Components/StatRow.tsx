interface Props {
  title: string;
  value: number | undefined;
}

const StatRow = ({ title, value }: Props) => {
  return (
    <div className="flex text-2xl max-w-md leading-none">
      <div className="shrink">{title}</div>
      <span className="flex-grow border border-dashed border-t-0 border-r-0 border-l-0 mx-3" />
      <div className=" shrink text-right">
        {value}
        {title === "Score" && " pts"}
      </div>
    </div>
  );
};

export default StatRow;
