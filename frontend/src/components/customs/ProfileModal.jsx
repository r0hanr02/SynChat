import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProfileModal = ({ children, user }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{user.name}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center flex-col gap-2">
          <img
            src={user.pic}
            className="w-60 h-60 object-cover rounded-full"
            alt="Profile"
          />
          <p className="text-xl">
            Email:
            <span className="font-bold text-black text-xl">{user.email}</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
