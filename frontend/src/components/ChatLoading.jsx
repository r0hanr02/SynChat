import React from "react";

const ChatLoading = () => {
  return (
  <>
    <div className="flex items-center gap-3 p-2 animate-pulse">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

      <div className="flex flex-col gap-2">
        <div className="w-32 h-3 bg-gray-300 rounded"></div>
        <div className="w-20 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="flex items-center gap-3 p-2 animate-pulse">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

      <div className="flex flex-col gap-2">
        <div className="w-32 h-3 bg-gray-300 rounded"></div>
        <div className="w-20 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="flex items-center gap-3 p-2 animate-pulse">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

      <div className="flex flex-col gap-2">
        <div className="w-32 h-3 bg-gray-300 rounded"></div>
        <div className="w-20 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>

  </>
  );
};

export default ChatLoading;
