import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_APP_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
      query: {
        projectId,
      },
    });
  }
  return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
  if (socketInstance) {
    socketInstance.on(eventName, cb);
  }
};
export const sendMessage = (eventName, payload) => {
  if (socketInstance) {
    socketInstance.emit(eventName, payload);
  }
};
