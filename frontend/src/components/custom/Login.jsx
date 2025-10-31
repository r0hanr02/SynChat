import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    // Add API / Firebase auth logic here later
  };

  const handleGuestLogin = () => {
    const guestCredentials = {
      email: "guest@synchat.com",
      password: "guest123",
    };
    setEmail(guestCredentials.email);
    setPassword(guestCredentials.password);
    console.log("Guest login initiated:", guestCredentials);
    // You can auto-submit or call login API here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full text-white"
    >
      <h2 className="text-2xl font-semibold text-center mb-2">Welcome Back</h2>
      <p className="text-gray-400 text-sm text-center mb-4">
        Login to continue chatting
      </p>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-gray-300">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-900/60 border-gray-700 text-white focus-visible:ring-blue-500"
          required
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2 relative">
        <label htmlFor="password" className="text-sm text-gray-300">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-900/60 border-gray-700 text-white focus-visible:ring-blue-500 pr-10"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <Button
        type="submit"
        className="mt-2 bg-blue-600 hover:bg-blue-700 transition duration-300"
      >
        Login
      </Button>

      <Button
        type="button"
        onClick={handleGuestLogin}
        className="bg-gray-700 hover:bg-gray-800 transition duration-300"
      >
        Login as Guest
      </Button>

      <p className="text-sm text-gray-400 text-center mt-3">
        Don’t have an account?{" "}
        <span className="text-blue-400 hover:underline cursor-pointer">
          Sign up
        </span>
      </p>
    </form>
  );
};

export default Login;
