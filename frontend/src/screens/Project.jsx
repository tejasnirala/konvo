import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import { UserContext } from "../contexts/user.context";
import Markdown from "markdown-to-jsx";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-json";
import { useNavigate } from "react-router-dom";

export default function Project() {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageBoxRef = useRef(null);
  const scrollAnchorRef = useRef(null);

  const { user } = useContext(UserContext);

  const handleUserClick = useCallback((id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  }, []);

  const getProjectUserIds = useCallback((projectUsers) => {
    return projectUsers.map((user) =>
      typeof user === "string" ? user : user._id
    );
  }, []);

  const handleAddCollaborators = useCallback(() => {
    axios
      .put("/projects/add-user", {
        projectId: project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        setProject(res.data.project);
        setIsModalOpen(false);
        setSelectedUserId([]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [project._id, selectedUserId]);

  const scrollToBottom = useCallback(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleIncomingMessage = useCallback((messageObject) => {
    console.log("🚀 :94 messageObject ==> ", messageObject);

    setMessages((prev) => [...prev, { ...messageObject, type: "incoming" }]);
  }, []);

  const handleOutgoingMessage = useCallback((messageObject) => {
    setMessages((prev) => [...prev, { ...messageObject, type: "outgoing" }]);
  }, []);

  const handleSendMessage = useCallback(() => {
    sendMessage("project-message", {
      message,
      sender: user,
    });

    handleOutgoingMessage({
      message,
      sender: user,
    });

    setMessage("");
  }, [message, user, handleOutgoingMessage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  useEffect(() => {
    initializeSocket(project._id);

    receiveMessage("project-message", (data) => {
      handleIncomingMessage(data);
    });

    axios
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`/projects/get-project/${project._id}`)
      .then((res) => {
        setProject(res.data.project);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [project._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <main className="h-screen w-screen">
      <section className="left relative flex flex-col h-full min-w-96 bg-slate-300">
        <header className="flex justify-between p-2 px-4 w-full bg-slate-100">
          <div className="flex items-center font-bold text-lg">
            <button className="flex items-center cursor-pointer"
            onClick={() =>  navigate('/')}
            >
              <i className="ri-arrow-left-s-line text-2xl"></i>
            </button>
            <h2>{project.name}</h2>
          </div>
          <div className="flex">
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="flex gap-1 justify-center items-center p-2 cursor-pointer"
            >
              <i className="ri-add-fill"></i>
              <small>Add collaborator</small>
            </button>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 cursor-pointer"
            >
              <i className="ri-group-fill"></i>
            </button>
          </div>
        </header>

        <div className="conversation-area flex flex-col flex-grow overflow-hidden">
          <div
            ref={messageBoxRef}
            className="message-box flex flex-col flex-grow overflow-auto hide-scrollbar"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${
                  msg.type === "incoming" ? "incoming" : "outgoing ml-auto"
                } flex flex-col p-2 bg-slate-50 max-w-[70%] w-fit rounded-md m-1`}
              >
                <small className="opacity-65 text-sm font-bold text-orange-500">
                  {msg.sender.email}
                </small>
                {msg.sender._id === "ai" ? (
                  <Markdown
                    options={{
                      overrides: {
                        code: {
                          component: CodeBlock,
                        },
                      },
                    }}
                  >
                    {msg.message}
                  </Markdown>
                ) : (
                  <p>{msg.message}</p>
                )}
              </div>
            ))}
            <div ref={scrollAnchorRef} />
          </div>

          <div className="inputField w-full flex">
            <input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className="bg-white px-4 py-2 border-none outline-node ml-2 mb-2 rounded-md flex-grow"
              type="text"
              onKeyDown={handleKeyDown}
              placeholder="Enter message"
            />
            <button
              onClick={handleSendMessage}
              className="flex justify-center items-center cursor-pointer px-3 text-2xl ml-1 mr-2 mb-2 bg-gray-900 text-white rounded"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel flex flex-col gap-2 w-full h-full bg-slate-50 absolute transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="cross flex justify-between items-center px-4 py-2 bg-slate-200">
            <h2 className="font-bold text-xl">Collaborators</h2>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 cursor-pointer font-bol"
            >
              <i className="ri-close-large-line"></i>
            </button>
          </header>

          <div className="users flex flex-col justify-start items-center gap-2">
            {Array.isArray(project.users) &&
              project.users.map((user) => (
                <div
                  key={typeof user === "string" ? user : user._id}
                  className="flex items-center rounded-md gap-2 bg-red-200 w-[95%] h-fit"
                >
                  <div className="flex justify-center items-center my-2 ml-2 w-12 h-12 text-2xl font-bold rounded-4xl bg-slate-300">
                    {typeof user === "string" ? user[0] : user.email[0]}
                  </div>
                  <div className="username text-md font-semibold">
                    {typeof user === "string" ? user : user.email}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button
                onClick={() => {
                  setIsModalOpen(!isModalOpen);
                  setSelectedUserId([]);
                }}
                className="p-2 cursor-pointer"
              >
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {users
                .filter(
                  (user) => !getProjectUserIds(project.users).includes(user._id)
                )
                .map((user) => (
                  <div
                    key={user._id}
                    className={`user cursor-pointer hover:bg-slate-200 ${
                      Array.from(selectedUserId).includes(user._id)
                        ? "bg-slate-200"
                        : ""
                    } p-2 flex gap-2 items-center`}
                    onClick={() => handleUserClick(user._id)}
                  >
                    <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                      <i className="ri-user-fill absolute"></i>
                    </div>
                    <h1 className="font-semibold text-lg">{user.email}</h1>
                  </div>
                ))}
            </div>
            <button
              onClick={handleAddCollaborators}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const CodeBlock = ({ children, className = "" }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const handleCopy = () => {
    const text = codeRef.current?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="relative my-2">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-gray-600"
      >
        Copy
      </button>
      <pre className="overflow-auto rounded bg-gray-900 p-4 text-white text-sm">
        <code ref={codeRef} className={`language-js ${className}`}>
          {children}
        </code>
      </pre>
    </div>
  );
};
