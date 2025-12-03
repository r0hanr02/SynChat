import React, { useEffect, useRef } from "react";
import { isLastMessage, isSameSender } from "../config/ChatLogics";
import { useChat } from "../context/chatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = useChat();
  const bottomRef = useRef();

  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full">
      {messages &&
        messages.map((m, i) => {
          // AI MESSAGE BLOCK
          if (m.isAi) {
            return (
              <div key={i} ref={bottomRef} className="flex items-start gap-2">
                <div className="px-3 py-2 rounded-lg bg-blue-100 text-blue-800 shadow-sm max-w-[70%]">
                  🤖 {m.content}
                </div>
              </div>
            );
          }

          // NORMAL USER/HUMAN MESSAGE BLOCK
          return (
            <div
              ref={bottomRef}
              key={m._id}
              className={`flex items-end ${
                m.sender._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) &&
                m.sender._id !== user._id && (
                  <img
                    src={m.sender.pic}
                    title={m.sender.name}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-2 border border-indigo-300"
                  />
                )}

              <span
                className={`px-3 py-2 rounded-lg text-sm shadow-sm ${
                  m.sender._id === user._id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {m.content}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default ScrollableChat;

// useEffect(() => {
//   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
// }, [messages]);
