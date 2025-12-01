import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center gap-4 p-3 my-2 rounded-lg border border-indigo-200 
                 bg-indigo-50 shadow-sm cursor-pointer hover:bg-indigo-100
                 transition-colors duration-300 "
    >
      {/* Avatar */}
      {user.pic ? (
        <img
          src={user.pic}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover border border-indigo-300"
        />
      ) : (
        <div
          className="w-12 h-12 rounded-full bg-indigo-600 text-white 
                        flex items-center justify-center text-lg font-semibold border border-indigo-300"
        >
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
      )}

      {/* User Info */}
      <div className="flex flex-col">
        <p className="font-semibold text-indigo-800">{user.name}</p>
        <p className="text-sm text-indigo-600">{user.email}</p>
      </div>
    </div>
  );
};

export default UserListItem;
