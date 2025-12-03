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
import { showError, showSuccess } from "../service/toast";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const socket = io("https://synchat-j0gx.onrender.com", { autoConnect: false });
let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useChat();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [aiMessage, setAiMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (e) => {
    // Detect Enter OR button click
    const isSend =
      (e.key === "Enter" || e.type === "click") && newMessage.trim() !== "";

    // Check for AI prompt
    if (isSend && newMessage.includes("@ai")) {
      setAiMessage(true);
      setNewMessage("");
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_APP_URL
          }/api/ai/get-result?prompt=${newMessage}`
        );

        const aiMsg = {
          sender: { _id: "AI", name: "SyncAI" },
          content: data,
          chat: selectedChat._id,
          isAi: true,
        };

        socket.emit("ai-message", {
          room: selectedChat._id,
          message: aiMsg,
        });

        setMessages((prev) => [...prev, aiMsg]);
        setAiMessage(false);

        return;
      } catch (error) {
        console.log("AI fetch error:", error);
        setAiMessage(false);
        return;
      }
    }

    // NORMAL USER MESSAGE
    if (isSend) {
      socket.emit("stop typing", selectedChat._id);

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
        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
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
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      showError("Error Occured!");
      setLoading(false);
    }
  };

  function TemporaryAI() {
    showSuccess("Chat With AI is Temporary Chat");
  }

  useEffect(() => {
    TemporaryAI();
    if (!socket.connected) socket.connect();
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give  Notification
        if (!notification.includes(newMessageReceived)) {
          setNotification((prev) => [newMessageReceived, ...prev]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    });
    return () => {
      socket.off("message received");
    };
  }, []);

  useEffect(() => {
    socket.off("ai-message");
    const aiHandler = (payload) => {
      setMessages((prev) => [...prev, payload.message]);
    };
    socket.on("ai-message", aiHandler);

    return () => socket.off("ai-message", aiHandler);
  }, []);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    let typingTimeout;
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    let timerLength = 3000;

    typingTimeout = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, timerLength);
  };

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
          <div className="flex flex-col items-center gap-2 p-3 border-t border-gray-200 bg-white">
            {/* Typing Indicator */}
            {isTyping && (
              <span className="self-start text-gray-500 italic">Typing...</span>
            )}

            {/* Input + Button */}
            <div className="flex w-full items-center gap-2 flex-1">
              <input
                type="text"
                onKeyDown={sendMessage}
                required
                value={newMessage}
                onChange={typingHandler}
                placeholder="Use SyncAI @ai or Type a message..."
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
