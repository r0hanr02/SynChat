import React, { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import { MdAdd } from "react-icons/md";
import axios from "../config/axios";
import { FaPeopleGroup } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const greetingName = user?.email?.split("@")[0] ?? "there";

  function openModal() {
    setIsModalOpen(true);
    setError("");
  }
  function closeModal() {
    setIsModalOpen(false);
    setProjectName("");
    setError("");
  }
  function createProject(projectName) {
    axios
      .post("projects/create", {
        name: projectName,
      })
      .then((res) => {
        console.log(res);
        setIsModalOpen(false);
      })
      .catch((err) => console.log(err));
  }
  function handleSubmit(e) {
    e.preventDefault();

    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }
    createProject(projectName);
    closeModal();
  }
  useEffect(() => {
    axios
      .get("projects/all")
      .then((res) => {
        // console.log(res.data);
        setProjects(res.data.projects);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 flex px-4">
      <div className="flex flex-col items-start w-full max-w-xl mr-auto py-10 space-y-8">
        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
        >
          <MdAdd className="text-lg" />
          <span className="text-base">New Project</span>
        </button>
        <div className="w-80 space-y-3">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() =>
                navigate(`/project`, {
                  state: { project },
                })
              }
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:bg-gray-700 transition-all shadow cursor-pointer flex flex-col gap-2"
            >
              <span className="text-white text-base font-medium mb-2">
                {project.name}
              </span>
              <div className="flex items-center gap-3 mt-1">
                <FaPeopleGroup className="text-blue-400 text-xl" />
                <span className="bg-blue-900 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                  {project.users.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md">
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Create Project
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Close
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="projectName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Project Name
                  </label>
                  <input
                    id="projectName"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  {error && (
                    <p className="mt-2 text-sm font-medium text-red-400">
                      {error}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition hover:text-white"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
