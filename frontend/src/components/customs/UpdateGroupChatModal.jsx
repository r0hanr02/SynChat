import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useChat } from "../../context/chatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import { Spinner } from "../ui/spinner";
import UserListItem from "../UserAvatar/UserListItem";
import { showError, showSuccess } from "../../service/toast";

const UpdateGroupChatModal = ({ children, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedChat, setSelectedChat, user } = useChat();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      showSuccess("Only admin can remove someone");
    }
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_URL}/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      showError("Error Occured! Failed to Load Chats");
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      showSuccess("User Already in the Group");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      showError("Only Admin can add someone");
    }
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_URL}/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      showError("Error Occured! Failed to Load Chats");
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/user?search=${search}`,
        config
      );
      setSearchResult(data.users);
      setLoading(false);
    } catch (error) {
      showError("Error Occured! Failed to Load Chats");
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_URL}/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      showError("Error Occured! Failed to Load Chats");
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-indigo-800">
            {selectedChat.chatName}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {/* Current Users */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedChat.users.map((u) => (
            <UserBadgeItem
              key={u._id}
              user={u}
              handleFunction={() => handleRemove(u)}
            />
          ))}
        </div>

        {/* Rename Group */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Rename Group Name"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 
                       focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleRename}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium 
                       hover:bg-indigo-700 transition-colors duration-200"
          >
            Update Name
          </button>
        </div>

        {/* Add User */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Add User To Group"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 
                       focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
            {loading ? (
              <Spinner />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <button
            onClick={() => handleRemove(user)}
            className="w-full px-4 py-2 rounded-md bg-red-600 text-white font-medium 
                       hover:bg-red-700 transition-colors duration-200"
          >
            Leave Group
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGroupChatModal;
