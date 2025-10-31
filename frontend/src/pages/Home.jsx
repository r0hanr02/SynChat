import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Login from "../components/custom/Login";
import SignUp from "../components/custom/SignUp";

const Home = () => {
  const [toggle, setToggle] = useState("login");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-4">
      <h4 className="text-4xl font-bold mb-8 tracking-wide">SynChat</h4>

      <div className="flex gap-6 mb-10">
        <Button
          onClick={() => setToggle("login")}
          className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full shadow-md transition duration-300 ${
            toggle === "login"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-600 hover:bg--700"
          }`}
        >
          Login
        </Button>
        <Button
          onClick={() => setToggle("signup")}
          className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full shadow-md transition duration-300 ${
            toggle === "signup"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          Sign Up
        </Button>
      </div>

      <div className="w-full max-w-sm bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg">
        {toggle === "login" ? (
          <div className="animate-fadeIn">
            <Login />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <SignUp />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
