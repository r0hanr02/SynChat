import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { showError, showSuccess } from "../service/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState({});

  const imageUpload = async (pic) => {
    if (!pic) {
      showError("Please select an image");
      return;
    }
    if (pic.type !== "image/jpeg" && pic.type !== "image/png") {
      showError("Invalid file type. Only JPG/PNG allowed.");
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "SynChat");
      data.append("cloud_name", "dpit8gehd");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dpit8gehd/image/upload",
        data
      );
      const uploadedImage = res.data.secure_url;
      setFormData((prev) => ({ ...prev, pic: uploadedImage }));
      showSuccess("Profile Photo Uploaded");
    } catch (err) {
      showError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pic") {
      const file = files[0];
      imageUpload(file);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.pic) {
      newErrors.pic = "Profile picture is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { name, email, password, pic } = formData;
        const { data } = await axios.post(
          `${import.meta.env.VITE_APP_URL}/api/user`,
          {
            name,
            email,
            password,
            pic,
          },
          config
        );
        showSuccess("Registration successfull");
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);

        setTimeout(() => {
          navigate("/chats");
        }, 300);
      } catch (error) {
        showError(error.response?.data?.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-indigo-700 text-center">
        Create Your Account
      </h2>
      <p className="text-sm text-gray-500 text-center">
        Join Synchat and start connecting instantly.
      </p>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Profile Picture
          </label>

          {/* Circle Upload */}
          <div className="relative w-28 h-28">
            <input
              type="file"
              name="pic"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {formData.pic ? (
              <img
                src={formData.pic}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-indigo-400 flex items-center justify-center text-gray-500 bg-gray-100 hover:bg-gray-200 transition">
                <span className="text-xs text-center">Upload</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errors.pic && (
            <p className="text-red-500 text-sm mt-2">{errors.pic}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Rohan."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
            autoComplete="username"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Profile Picture */}

        {/* Submit Button */}
        <Button
          disabled={loading || uploading}
          type="submit"
          className="w-full mt-4 bg-indigo-600 text-white rounded-lg py-2 font-semibold hover:bg-indigo-700 transition-all duration-300"
        >
          {loading ? "Loading..." : uploading ? " Uploading Image" : "SignIn"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-sm text-gray-500 text-center mt-4">
        Already have an account?{" "}
        <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
