import axios from "axios";
import React, { useEffect } from "react";

const ChatPage = () => {
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/chat`
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, []);
  return <div>ChatPage</div>;
};

export default ChatPage;
