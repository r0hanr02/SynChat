import React, { useState } from "react";
import { Button } from "../components/ui/button";
import Login from "../auth/Login";
import Register from "../auth/Register";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [toggle, setToggle] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-100 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 tracking-tight">
          Synchat
        </h1>
        <p className="mt-3 text-gray-600 text-center max-w-md">
          A modern platform to connect, collaborate, and grow together.
        </p>
      </div>

      {/* Auth Card */}
      <div className="flex flex-col bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Toggle Buttons */}
        <div className="flex justify-between w-full mb-6 gap-4">
          <Button
            onClick={() => setToggle(true)}
            className={`w-1/2 rounded-lg transition-all duration-300 ${
              toggle
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Login
          </Button>
          <Button
            onClick={() => setToggle(false)}
            className={`w-1/2 rounded-lg transition-all duration-300 ${
              !toggle
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Sign Up
          </Button>
        </div>

        {/* Auth Forms */}
        <div className="mt-2">{toggle ? <Login /> : <Register />}</div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} Synchat. All rights reserved.
      </footer>
    </section>
  );
};

export default Home;
