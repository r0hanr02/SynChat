import React, { useState, useEffect } from "react";
import { useChat } from "../context/chatProvider";
import { GiCaptainHatProfile } from "react-icons/gi";
import { IoChevronBackCircleOutline, IoSendOutline } from "react-icons/io5";
import { MdGroups2 } from "react-icons/md";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./customs/ProfileModal";
import UpdateGroupChatModal from "./customs/UpdateGroupChatModal";
import { Spinner } from "./ui/spinner";
import axios from "axios";
import { showError } from "../service/toast";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useChat();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `${import.meta.env.VITE_APP_URL}/api/message`,
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        setNewMessage("");
        setMessages([...messages, data]);
      } catch (error) {
        showError("Error Occured!");
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
    } catch (error) {
      showError("Error Occured!");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col h-full w-full bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-indigo-50">
            {/* Back button (mobile only) */}
            <button
              className="flex md:hidden text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              onClick={() => setSelectedChat(null)}
            >
              <IoChevronBackCircleOutline size={28} />
            </button>

            {/* Chat Title */}
            <div className="flex w-full items-center justify-between gap-2">
              {!selectedChat.isGroupChat ? (
                <>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {getSender(user, selectedChat.users)}
                  </h2>
                  <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                    <GiCaptainHatProfile
                      size={26}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                    />
                  </ProfileModal>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selectedChat.chatName.toUpperCase()}
                  </h2>
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  >
                    <MdGroups2
                      size={26}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                    />
                  </UpdateGroupChatModal>
                </>
              )}
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner className="text-3xl" />
              </div>
            ) : (
              <ScrollableChat messages={messages} />
            )}
          </div>

          {/* Message Input */}
          <div className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white">
            <input
              type="text"
              onKeyDown={sendMessage}
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-full border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              className="flex items-center justify-center p-2 rounded-full 
                         bg-indigo-600 text-white hover:bg-indigo-700 
                         transition-colors duration-200"
            >
              <IoSendOutline size={22} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full text-center text-gray-500">
          <p className="text-xl font-medium">
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
