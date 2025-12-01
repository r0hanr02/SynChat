import React from "react";
import { useChat } from "../context/chatProvider";
import { GiCaptainHatProfile } from "react-icons/gi";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./customs/ProfileModal";
import UpdateGroupChatModal from "./customs/UpdateGroupChatModal";
import { MdGroups2 } from "react-icons/md";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useChat();

  console.log(selectedChat);
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
                  >
                    <MdGroups2 size={26} />
                  </UpdateGroupChatModal>
                </>
              )}
            </div>
          </div>

          {/* Chat Body Placeholder */}
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p className="text-sm">Chat messages will appear here...</p>
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
