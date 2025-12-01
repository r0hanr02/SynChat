import React from "react";
import { MdClose } from "react-icons/md";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 
                 font-medium text-sm cursor-pointer hover:bg-indigo-200 transition-colors duration-200"
    >
      <span>{user.name}</span>
      <button
        onClick={handleFunction}
        className="flex items-center justify-center text-indigo-600 hover:text-red-600 focus:outline-none"
      >
        <MdClose size={16} />
      </button>
    </div>
  );
};

export default UserBadgeItem;
