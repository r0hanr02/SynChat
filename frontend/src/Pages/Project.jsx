import React, { useEffect, useRef, useState } from "react";
import { TiGroupOutline } from "react-icons/ti";
import {
  IoSend,
  IoCloseOutline,
  IoAddCircle,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import { useUser } from "../context/userContext";
import Markdown from "markdown-to-jsx";

const MarkdownParagraph = ({ children, ...props }) => (
  <p
    {...props}
    className="
      whitespace-pre-wrap 
      wrap-break-word 
      leading-relaxed
      max-h-64 
      overflow-y-auto
    "
  >
    {children}
  </p>
);

const MarkdownListItem = ({ children, ...props }) => (
  <li
    {...props}
    className="
      list-inside 
      whitespace-pre-wrap 
      wrap-break-word 
      leading-relaxed
      max-h-64 
      overflow-y-auto
    "
  >
    {children}
  </li>
);

const markdownOptions = {
  forceBlock: true,
  overrides: {
    p: { component: MarkdownParagraph },
    li: { component: MarkdownListItem },
  },
};

const Project = () => {
  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  const location = useLocation();
  const { user } = useUser();

  // ----------- SAFE PROJECT + PROJECT ID HANDLING -------------
  const stateProject = location.state?.project || null;
  const projectId =
    stateProject?._id || window.location.pathname.split("/").pop();
  const [project, setProject] = useState(stateProject);

  // ----------- UI STATES -------------
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isConversationCollapsed, setIsConversationCollapsed] =
    useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messageBoxRef = useRef(null);

  function tryParseJSON(str) {
    try {
      return JSON.parse(str);
    } catch (error) {
      return null;
    }
  }

  // ----------- FETCH PROJECT IF NOT FROM ROUTER STATE -------------
  useEffect(() => {
    if (!project) {
      axios
        .get(`/projects/get-project/${projectId}`)
        .then((res) => setProject(res.data.project))
        .catch((err) => console.log(err));
    }
  }, [projectId, project]);

  // ----------- FETCH USERS ONCE -------------
  useEffect(() => {
    axios
      .get(`/projects/get-project/${projectId}`)
      .then((res) => setProject(res.data.project))
      .catch((err) => console.log(err));

    axios
      .get("/api/all")
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.log(err));
  }, [projectId]);

  function mergeAiFileTree(aiFiles) {
    const converted = {};
    for (const [filename, content] of Object.entries(aiFiles)) {
      converted[filename] = { content };
    }
    return converted;
  }

  // ----------- SOCKET SETUP (listen / cleanup) -------------
  useEffect(() => {
    if (!projectId) return;

    initializeSocket(projectId);

    receiveMessage("project-message", (data) => {
      const parsed = tryParseJSON(data.message);

      if (parsed) {
        console.log("AI JSON", parsed);

        if (parsed.filetree) {
          const converted = mergeAiFileTree(parsed.filetree);
          setFileTree((prev) => ({
            ...prev,
            ...converted,
          }));
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: data.sender,
            message: parsed.text || "",
          },
        ]);
      } else {
        setMessages((prev) => [...prev, data]);
      }
    });
  }, [projectId]);

  // ----------- auto-scroll to bottom when messages change -------------
  useEffect(() => {
    const box = messageBoxRef.current;
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }, [messages]);

  // ----------- USER SELECT HANDLING -------------
  const handleClick = (id) => {
    setSelectedUserId((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  // ----------- ADD COLLABORATOR -------------
  const addCollaborator = () => {
    axios
      .put("/projects/adduser", {
        projectId: projectId,
        users: selectedUserId,
      })
      .then((res) => {
        console.log(res);
        setIsModalOpen(false);
      })
      .catch((err) => console.log(err));
  };

  // ----------- SEND MESSAGE -------------
  const send = () => {
    if (!message.trim()) return;

    const payload = {
      message: message.trim(),
      sender: user.email,
    };

    setMessages((prev) => [...prev, payload]);
    sendMessage("project-message", payload);
    setMessage("");
  };

  // ----------- UI -------------
  return (
    <main className="h-screen w-screen flex bg-gray-950 text-gray-100">
      <section
        className={`left relative flex flex-col h-full bg-gray-900/90 border-r border-gray-800/80 backdrop-blur transition-all duration-300 ${
          isConversationCollapsed
            ? "w-14 min-w-14 basis-auto"
            : "min-w-[18rem] basis-3/5 max-w-[40%]"
        }`}
      >
        {isConversationCollapsed ? (
          <div className="flex flex-col items-center justify-between h-full py-6">
            <button
              type="button"
              className="p-2 rounded-full border border-gray-800 text-gray-300 hover:text-white hover:border-blue-500 transition-colors"
              onClick={() => setIsConversationCollapsed(false)}
            >
              <IoChevronForwardOutline size={20} />
            </button>

            <div className="flex flex-col items-center gap-5">
              <button
                className="flex gap-2 rounded-lg bg-blue-600/10 px-3 py-2 text-blue-300 hover:text-white hover:bg-blue-600/30 transition-colors"
                onClick={() => setIsModalOpen((prev) => !prev)}
              >
                <IoAddCircle size={22} />
              </button>

              <button
                type="button"
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                onClick={() => setIsSidePanelOpen((prev) => !prev)}
              >
                <TiGroupOutline size={22} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <header className="flex justify-between items-center gap-3 p-4 w-full bg-gray-900/80 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-2 rounded-lg bg-blue-600/10 px-3 py-2 text-blue-300 hover:text-white hover:bg-blue-600/30 transition-colors"
                  onClick={() => setIsModalOpen((prev) => !prev)}
                >
                  <IoAddCircle size={22} />
                  <p className="text-sm font-semibold">Add Collaborator</p>
                </button>

                <button
                  type="button"
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setIsSidePanelOpen((prev) => !prev)}
                >
                  <TiGroupOutline size={22} />
                </button>
              </div>

              <button
                type="button"
                className="p-2 rounded-full border border-gray-800/70 text-gray-300 hover:text-white hover:border-blue-500 transition-all"
                onClick={() => setIsConversationCollapsed(true)}
                aria-label="Collapse conversation"
              >
                <IoChevronForwardOutline className="rotate-180" size={18} />
              </button>
            </header>

            {/* CHAT AREA */}
            <div className="conversation-area flex flex-col grow bg-gray-900 px-4 py-3 gap-3 overflow-hidden">
              <div
                ref={messageBoxRef}
                className="message-box flex flex-col grow overflow-y-auto gap-3 pr-2 min-h-0"
              >
                {messages.length === 0 && (
                  <>
                    <div className="incoming message w-full max-w-[80%] flex flex-col p-4 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg shadow-black/40 wrap-break-word">
                      <small className="opacity-70 text-xs mb-1 text-gray-300">
                        example@gmail.com
                      </small>
                      <p className="text-sm text-gray-100 whitespace-pre-wrap wrap-break-word leading-relaxed">
                        Lorem ipsum dolor sit amet
                      </p>
                    </div>

                    <div className="self-end outgoing message w-full max-w-[80%] flex flex-col p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 wrap-break-word">
                      <small className="opacity-80 text-xs mb-1 text-white text-right">
                        example@gmail.com
                      </small>
                      <p className="text-sm text-white text-right whitespace-pre-wrap wrap-break-word leading-relaxed">
                        Lorem ipsum dolor sit amet
                      </p>
                    </div>
                  </>
                )}

                {messages.map((m, index) => {
                  const mine = m.sender === user.email;

                  return (
                    <div
                      key={index}
                      className={`w-full flex ${
                        mine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] border border-gray-700 px-4 py-3 rounded-lg wrap-break-word shadow-md ${
                          mine
                            ? "bg-blue-600 border-blue-500/40"
                            : "bg-gray-800/80"
                        }`}
                      >
                        <div
                          className={`text-xs font-medium mb-1 opacity-70 ${
                            mine ? "text-right text-4xl" : "text-gray-300"
                          }`}
                        >
                          {m.sender}
                        </div>

                        <div
                          className={`text-sm leading-relaxed whitespace-pre-wrap wrap-break-word prose prose-invert prose-sm max-h-96 overflow-y-auto overflow-x-hidden discord-markdown ${
                            mine ? "text-white" : "text-gray-100"
                          }`}
                        >
                          <Markdown options={markdownOptions}>
                            {m.message || m.text}
                          </Markdown>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INPUT FIELD */}
              <div className="inputField w-full flex items-center gap-3 p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter Message"
                  className="p-3 px-4 w-full bg-gray-800/70 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                />

                <button
                  onClick={send}
                  className="flex items-center justify-center bg-blue-600/90 hover:bg-blue-500 text-white font-semibold px-5 py-3 rounded-xl transition-colors duration-200"
                >
                  <IoSend size={18} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* SIDE PANEL */}
        <div
          className={`slidePanel fixed z-40 w-80 max-w-xs h-full flex flex-col bg-gray-900/95 top-0 left-0 border-r border-gray-800/80 shadow-2xl transition-transform duration-300 ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/90">
            <h1 className="text-lg font-semibold text-gray-200">
              Collaborators
            </h1>

            <button
              onClick={() => setIsSidePanelOpen((prev) => !prev)}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Close Panel"
            >
              <IoCloseOutline size={28} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-900/80 custom-scrollbar">
            {project?.users?.length > 0 ? (
              project.users.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-3 mb-3 px-3 py-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 transition-colors border border-gray-800"
                >
                  <span className="text-2xl text-gray-400">
                    <FaRegUserCircle />
                  </span>
                  <span className="text-sm text-gray-100 truncate">
                    {u.email || u.username || u.name}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm mt-10">
                No collaborators yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {isModalOpen ? (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-900 w-full max-w-md min-h-60 text-gray-100 p-6 rounded-2xl border border-gray-800 shadow-2xl shadow-black/50 flex flex-col gap-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Select User
              </h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No users available</p>
                </div>
              ) : (
                users.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => handleClick(u._id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedUserId.includes(u._id)
                        ? "border-blue-500 bg-blue-600/20 text-white shadow-md shadow-blue-500/20"
                        : "border-gray-800 hover:border-gray-700 hover:bg-gray-800/50 text-gray-200"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        selectedUserId.includes(u._id)
                          ? "bg-blue-600/30 text-blue-300"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      <FaRegUserCircle />
                    </div>

                    <p className="text-sm font-medium flex-1">
                      {u.email}
                    </p>

                    {selectedUserId.includes(u._id) && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <button
              onClick={addCollaborator}
              disabled={selectedUserId.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition"
            >
              Add{" "}
              {selectedUserId.length > 0
                ? `${selectedUserId.length} `
                : ""}
              Collaborator
              {selectedUserId.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      ) : null}

      {/* RIGHT PANEL */}
      <section className="right w-full bg-linear-to-br from-gray-900 to-gray-950 flex">
        {/* FILE EXPLORER */}
        <div className="explorer h-full max-w-64 min-w-52 py-3 border-r border-gray-800 bg-gray-900/40">
          <div className="file-tree w-full flex flex-col gap-1">
            {Object.keys(fileTree).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFile(file);
                  setOpenFiles([...new Set([...openFiles, file])]);
                }}
                className="
                  tree-element 
                  p-3 px-4 
                  flex items-center
                  bg-slate-800 
                  hover:bg-slate-700 
                  transition-colors
                  text-left
                  w-full
                  border-b border-gray-700/40
                "
              >
                <p className="cursor-pointer font-bold text-sm text-gray-200 truncate w-full">
                  {file}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* CODE VIEWER */}
        <div className="codeEditor flex-1 p-4">
          {currentFile ? (
            <div className="w-full h-full flex flex-col bg-gray-900/40 border border-gray-800 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="code-editor-header flex justify-between items-center px-4 py-2 bg-gray-800/80 border-b border-gray-700">
                <div className="top p-2 flex gap-2 overflow-x-auto whitespace-nowrap">
                  {openFiles.map((file, index) => (
                    <button
                      key={index}
                      className="
                        open-file 
                        px-3 py-1 
                        bg-gray-900 
                        border border-gray-700 
                        rounded-md
                        text-gray-300 
                        hover:bg-gray-800 hover:text-white 
                        transition
                      "
                      onClick={() => setCurrentFile(file)}
                    >
                      {file}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentFile(null);
                    setOpenFiles([]);
                  }}
                  className="
                    text-gray-300 hover:text-white 
                    p-1 rounded-md
                    hover:bg-gray-700
                    transition
                  "
                >
                  <IoCloseOutline size={20} />
                </button>
              </div>

              {/* Code Display */}
              <textarea
                className="
                  flex-1 
                  overflow-auto 
                  text-green-300 
                  text-sm 
                  p-4 
                  bg-black/30 
                  font-mono 
                  outline-none
                "
                value={fileTree[currentFile].content}
                onChange={(e) =>
                  setFileTree({
                    ...fileTree,
                    [currentFile]: { content: e.target.value },
                  })
                }
              ></textarea>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <p className="text-sm">Select a file to preview.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Project;
