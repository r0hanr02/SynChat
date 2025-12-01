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

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(null);
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const menuRef = useRef(null);
  const { user, setSelectedChat, chats, setChats } = useChat();
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
        <div className="flex items-center gap-4">
          <CiBellOn size={22} className="cursor-pointer" />

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
          className={`bg-gray-800 h-full w-80 shadow-xl border-r z-30 flex flex-col text-white fixed left-0 top-0 transform ease-in-out transition-transform duration-700 p-2
  ${openSideDrawer ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-2">
            <h4 className="text-xl">Search User</h4>
            <button onClick={() => setOpenSideDrawer(false)}>
              <IoClose size={25} />
            </button>
          </div>

          <hr className="p-2" />

          <div className="flex gap-2 m-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search By Name or Email"
              className="w-10/12 bg-gray-500 p-2 rounded-md outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-gray-800 px-3 rounded-xl hover:bg-gray-500 duration-150"
            >
              GO
            </button>
          </div>

          <p className="text-xl underline px-2">Users</p>

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
          {loadingChat && <Spinner />}
        </div>
      )}
    </>
  );
};

export default SideDrawer;
