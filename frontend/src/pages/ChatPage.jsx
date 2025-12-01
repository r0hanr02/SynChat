import React from "react";
import { useChat } from "../context/chatProvider";
import SideDrawer from "../components/customs/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";

const ChatPage = () => {
  const { user } = useChat();

  return (
    <div style={{ width: "100%" }}>
      {user & <SideDrawer />}
      <section>
        {user && <MyChats />}
        {user && <ChatBox />}
      </section>
    </div>
  );
};

export default ChatPage;
