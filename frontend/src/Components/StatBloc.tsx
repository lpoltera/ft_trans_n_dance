interface Props {
	title: string;
	score: number | string;
}

const StatBloc = ({ title, score }: Props) => {
	return (
		<>
			<div className="bg-neutral-600 p-4 rounded-md">
				<div className="text-lg font-light">{title}</div>
				<div className="text-3xl">
					{score} {title === "Score" ? " pts" : ""}
				</div>
			</div>
		</>
	);
};

export default StatBloc;
