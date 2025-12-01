import React from "react";
import { useChat } from "../context/chatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChat();

  return (
    <div className={`${selectedChat ? "md:flex " : "hidden md:flex"} w-full`}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
