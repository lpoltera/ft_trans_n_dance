import FooterMain from "../Components/FooterMain";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";

const ChatPage = () => {
  return (
    <>
      <Navbar />
      <PageLayout>
        <div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12"></div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default ChatPage;
