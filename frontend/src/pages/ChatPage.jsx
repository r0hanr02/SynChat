import React, { useState } from "react";
import { useChat } from "../context/chatProvider";
import SideDrawer from "../components/customs/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";

const ChatPage = () => {
  const { user } = useChat();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Top Drawer */}
      {user && <SideDrawer />}

      {/* Main Chat Section */}
      <section className="flex w-full h-screen bg-gray-50">
        {/* Sidebar (MyChats) */}
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}

        {/* ChatBox */}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </section>
    </div>
  );
};

export default ChatPage;
