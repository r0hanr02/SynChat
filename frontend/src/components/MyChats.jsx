import React, { useState, useEffect } from "react";
import { useChat } from "../context/chatProvider";
import axios from "axios";
import { showError } from "../service/toast";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./customs/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const { selectedChat, setSelectedChat, user, chats, setChats } = useChat();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/chat`,
        config
      );
      setChats(data);
    } catch (error) {
      showError("Error Occured! Failed to Load Chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <section
      className={`${
        selectedChat ? "hidden md:flex" : "flex"
      } flex-col items-center w-full md:w-1/3 py-4 bg-gray-50 border-r border-gray-200`}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full px-4 pb-3 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800">My Chats</h4>
        <GroupChatModal>
          <button className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-300">
            Create Group
          </button>
        </GroupChatModal>
      </div>

      {/* Chat List */}
      <div className="flex-1 w-full overflow-y-scroll px-4 py-2">
        {chats ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200
                ${
                  selectedChat?._id === chat._id
                    ? "bg-indigo-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
            >
              <p className="text-sm font-medium truncate">
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </p>
            </div>
          ))
        ) : (
          <ChatLoading />
        )}
      </div>
    </section>
  );
};

export default MyChats;
