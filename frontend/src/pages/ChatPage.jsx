import React from "react";
import { useChat } from "../context/chatProvider";
import SideDrawer from "../components/customs/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";

const ChatPage = () => {
  const { user } = useChat();

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Top Drawer */}
      {user && <SideDrawer />}

      {/* Main Chat Section */}
      <section className="flex flex-1 w-full bg-gray-50">
        {/* Sidebar (MyChats) */}
        {user && (
          <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white shadow-sm">
            <MyChats />
          </div>
        )}

        {/* ChatBox */}
        {user && (
          <div className="flex-1 bg-white">
            <ChatBox />
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatPage;
