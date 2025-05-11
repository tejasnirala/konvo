import { useState, useEffect } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => {
        setProjects(res.data.projects);
      })
      .catch((error) => console.log(error));
  }, []);

  function createProject(e) {
    e.preventDefault();
    console.log(projectName);

    axios
      .post("/projects/create", {
        name: projectName,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    setIsModalOpen(false);
  }

  return (
    <main className="p-4">
      <div className="projects flex flex-wrap gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="project p-4 border border-slate-300 rounded-md cursor-pointer"
        >
          New Project <i className="ml-1 ri-link"></i>
        </button>
        {projects.map((project) => (
          <div
            onClick={() =>
              navigate("/project", {
                state: { project },
              })
            }
            key={project._id}
            className="flex flex-col justify-center gap-2 p-4 border border-slate-300 rounded-md cursor-pointer min-w-52 hover:bg-slate-300"
          >
            <h2 className="font-semibold">{project.name}</h2>

            <div className="flex gap-2">
              <p>
                <small>
                  <i className="pr-1 ri-user-line"></i>Collaborators :
                </small>
              </p>
              {project.users.length}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl mb-4">Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
