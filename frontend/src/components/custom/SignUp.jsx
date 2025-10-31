import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ImagePlus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "pic" && files.length > 0) {
      const file = files[0];
      const image_url = await uploadImageToCloudinary(file);
      if (image_url) {
        setFormData((prev) => ({ ...prev, pic: image_url }));
      } else {
        setFormData({ ...formData, pic: value });
      }
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadImageToCloudinary = async (pic) => {
    if (!pic) {
      toast.error("Please Select an Image");
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "SynChat");
      data.append("cloud_name", "dpit8gehd");
      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dpit8gehd/image/upload",
          data
        );
        // console.log(res.data);
        return res.data.secure_url;
      } catch (error) {
        console.error("Cloudinary upload Failes", error);
        toast.error("Image upload failed");
        return null;
      }
    } else {
      toast.error("Only JPEG or PNG images are allowed");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, confirmPassword, pic } = formData;
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please Fill all the details");
      setLoading(false);
      return;
    }

    if (password != confirmPassword) {
      toast.error("Password Do Not Match");
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/user`,
        { name, email, password, pic },
        config
      );
      toast.success("User Registeration Successfull");
      localStorage.setItem("userInfo", JSON.stringify(data));

      setTimeout(() => navigate("/chat"), 2000);
      // console.log({ data });
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("User Registeration Failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full text-white"
    >
      <h2 className="text-2xl font-semibold text-center mb-2">
        Create Account
      </h2>
      <p className="text-gray-400 text-sm text-center mb-4">
        Join SynChat and start connecting instantly
      </p>

      {/* Profile Image Upload */}
      <div className="flex flex-col items-center">
        <label
          htmlFor="image"
          className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-800/60 border border-gray-700 cursor-pointer hover:border-blue-500 transition"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full"
            />
          ) : (
            <ImagePlus className="text-gray-400 w-8 h-8" />
          )}
        </label>
        <input
          type="file"
          id="image"
          name="pic"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <p className="text-xs text-gray-400 mt-2">Upload profile picture</p>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm text-gray-300">
          Full Name
        </label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          className="bg-gray-900/60 border-gray-700 text-white focus-visible:ring-blue-500"
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-gray-300">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
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
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
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

      {/* Confirm Password */}
      <div className="flex flex-col gap-2 relative">
        <label htmlFor="confirmPassword" className="text-sm text-gray-300">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="bg-gray-900/60 border-gray-700 text-white focus-visible:ring-blue-500 pr-10"
            required
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-gray-200"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        className="mt-4 bg-blue-600 hover:bg-blue-700 transition duration-300"
      >
        Sign Up
      </Button>

      <p className="text-sm text-gray-400 text-center mt-3">
        Already have an account?{" "}
        <span className="text-blue-400 hover:underline cursor-pointer">
          Login
        </span>
      </p>
      <ToastContainer />
    </form>
  );
};

export default SignUp;
