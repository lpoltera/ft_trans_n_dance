import PageHeader from "../old-components/PageHeader";
import ScoreTable from "../old-components/ScoreTable";

const ScorePage = () => {
  return (
    <>
      <PageHeader>Tableau des scores</PageHeader>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <ScoreTable></ScoreTable>
        </div>
      </main>
    </>
  );
};

export default ScorePage;
