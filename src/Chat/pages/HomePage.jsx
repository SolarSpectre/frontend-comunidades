import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useAuthStore } from "../store/useAuthStore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ChatAmigos = () => {
  const { selectedUser } = useChatStore();
  const { authUser, isCheckingAuth, onlineUsers } = useAuthStore();

  console.log(onlineUsers);
  console.log(authUser);
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <AiOutlineLoading3Quarters className="size-10 animate-spin" />
      </div>
    );
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatAmigos;
