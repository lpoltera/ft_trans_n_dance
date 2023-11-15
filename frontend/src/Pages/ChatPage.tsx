import FooterMain from "../Components/FooterMain";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import Chat from "../Components/Chat";

const ChatPage = () => {
  return (
    <>
      <Navbar />
      <PageLayout>
        <div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12">
          <Chat></Chat>
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default ChatPage;
