import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
import { useChat } from "../../context/chatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { showError } from "../../service/toast";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { Spinner } from "../ui/spinner";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(null);
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const [notificationPanel, setNotificationPanel] = useState(false);
  const menuRef = useRef(null);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useChat();
  const navigate = useNavigate();

  // console.log(user);
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      showError("Please Enter Name or Email ");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/user?search=${search}`,
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSearchResult(data.users);
      setLoading(false);
    } catch (error) {
      showError("failed to load the search Result");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/chat`,
        { userId },
        config
      );

      setSelectedChat(data);
      setLoadingChat(false);
      setOpenSideDrawer(false);
    } catch (error) {
      showError("Error Fetching the Chats");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center px-3 py-2 border-b shadow-sm relative bg-white">
        {/* SEARCH BUTTON */}
        <button
          onClick={() => setOpenSideDrawer((prev) => !prev)}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition"
          title="Search User"
        >
          <p>Search User</p>
          <CiSearch size={20} />
        </button>

        {/* LOGO */}
        <h2 className="text-2xl font-semibold">SynChat</h2>

        {/* RIGHT SIDE ICONS */}
        <div className="relative flex items-center gap-4">
          <button onClick={() => setNotificationPanel((prev) => !prev)}>
            <CiBellOn size={25} className="cursor-pointer" />
            {notification.length > 0 && (
              <span
                className="absolute top-1 right-13 bg-red-600 text-white text-xs 
                   rounded-full w-4 h-4 flex items-center justify-center"
              >
                {notification.length}
              </span>
            )}
          </button>
          {notificationPanel && (
            <div
              className="absolute right-15 top-8 mt-2 w-64 bg-white border border-gray-200 
                        rounded-lg shadow-lg p-3 z-50"
            >
              <div className=" flex justify-between text-sm font-semibold text-indigo-700 mb-2">
                <h2>Notifications</h2>
                <button
                  className="px-2"
                  onClick={() => setNotificationPanel((prev) => !prev)}
                >
                  <IoIosCloseCircleOutline size={21} />
                </button>
              </div>
              {notification.length > 0 ? (
                <div>
                  <ul className="space-y-2">
                    {notification.map((note, idx) => (
                      <li
                        onClick={() => {
                          setSelectedChat(note.chat);
                          setNotification((prev) =>
                            prev.filter((n) => n !== note)
                          );
                        }}
                        key={note._id}
                        className="px-2 py-1 rounded-md bg-indigo-50 text-gray-800 text-sm pointer-cursor"
                      >
                        {note.chat.isGroupChat
                          ? `New Message In ${note.chat.chatName} `
                          : `New Message From ${getSender(
                              user,
                              note.chat.users
                            )}`}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No notifications</p>
              )}
            </div>
          )}
          {/* PROFILE MENU */}
          <div className="relative" ref={menuRef}>
            <div
              className="w-10 h-10 rounded-full border cursor-pointer overflow-hidden"
              onClick={() => setOpenProfileMenu((prev) => !prev)}
            >
              {/* Avatar Image */}
              {user.pic ? (
                <img
                  src={user.pic}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full bg-black text-white
                    flex items-center justify-center text-lg font-semibold cursor-pointer"
                >
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>

            {openProfileMenu && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40 py-2 z-20">
                <ProfileModal user={user}>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    My Profile
                  </button>
                </ProfileModal>

                <button
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {openSideDrawer && (
        <div
          className={`fixed left-0 top-0 h-full w-80 bg-indigo-100 text-indigo-800 shadow-xl border-r 
                z-30 flex flex-col transform transition-transform duration-700 ease-in-out p-4
                ${openSideDrawer ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xl font-semibold">Search User</h4>
            <button
              onClick={() => setOpenSideDrawer(false)}
              className="text-indigo-600 hover:text-red-600 transition-colors duration-200"
            >
              <IoClose size={25} />
            </button>
          </div>

          <hr className="border-indigo-300 mb-4" />

          {/* Search Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="flex-1 bg-white text-indigo-800 px-3 py-2 rounded-full 
                   border border-indigo-300 placeholder-indigo-400 
                   focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium 
                   hover:bg-indigo-700 transition-colors duration-200"
            >
              GO
            </button>
          </div>

          {/* Users Section */}
          <p className="text-lg font-medium underline mb-2">Users</p>

          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SideDrawer;
