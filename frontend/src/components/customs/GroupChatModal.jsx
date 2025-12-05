import React, { useEffect, useState } from "react";
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
import { showError, showSuccess } from "../../service/toast";
import axios from "axios";
import { Spinner } from "../ui/spinner";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { user, chats, setChats } = useChat();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

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
      setSearchResult(data.users);
      setLoading(false);
    } catch (error) {
      showError("Error Occured! Failed to Load Chats");
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      showError("Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      showSuccess("New Group Chat Created");
      setLoading(false);
      setGroupChatName("");
      setSelectedUsers([]);
      setOpen(false);
    } catch (error) {
      showError("Error Occured! Failed to Create Group");
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      showSuccess("User Already Added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (deletedUser) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== deletedUser._id)
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-gray-800">
            Create Group Chat
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Form */}
          <form className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
                             focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
            />
            <input
              type="text"
              value={search}
              placeholder="Add User e.g. Rohan, Philips"
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
                             focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
            />
          </form>

          {/* Selected Users */}
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </div>

          {/* Search Results */}
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium 
                       hover:bg-indigo-700 transition-colors duration-300"
          >
            Create Chat
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupChatModal;
