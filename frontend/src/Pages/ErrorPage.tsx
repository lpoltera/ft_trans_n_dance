interface Props {
  statusCode: string;
}

const ErrorPage = ({ statusCode }: Props) => {
  return (
    <>
      <div className="h-full flex flex-col justify-center items-center">
        <h1 className="text-9xl font-bold">{statusCode}</h1>
        <h2 className="text-4xl font-bold">Page Not Found</h2>
        <a href="/" className="text-2xl font-bold">
          Retour à l'accueil
        </a>
      </div>
    </>
  );
};

export default ErrorPage;
