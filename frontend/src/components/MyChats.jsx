import React from "react";
import { useChat } from "../context/chatProvider";

const MyChats = () => {
  const { selectedChat, setSelected, user, chats, setChats } = useChat();
  return <div>MyChats</div>;
};

export default MyChats;
