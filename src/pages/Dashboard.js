import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { taskEndpoints } from "./../utils/apis";
import InfoComponent from "../components/tasks/InfoCard";
import NewTask from "../components/tasks/NewTask";
import LogoutButton from "../components/user/Logout";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get(taskEndpoints.GET_ALL_TASK_API, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Tasks fetched successfully", response.data);
        setTasks(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks", error);
        setError(
          "Failed to load tasks. " +
            (error?.response?.data?.message || error.message)
        );
        setLoading(false);
        if (error?.response?.data?.message !== "Went Wrong in authorizaton") {
          console.log("No cookies found");
          navigate("/login");
        }
      });
  }, [token, navigate]);

  const handleTaskDelete = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  const handleTaskUpdate = (taskId, updatedStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, completed: updatedStatus } : task
      )
    );
  };

  const handleCreate = (newTask) => {
    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white max-w-4xl rounded-lg m-10 flex flex-col w-11/12">
      <div className="fixed bottom-20 z-10 left-[75%] flex flex-col">
        <button
          onClick={openModal}
          className="bg-green-500 text-white p-2 rounded-md mb-4"
        >
          New Task
        </button>
        <LogoutButton />

        {/* Render NewTask as a modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 h-screen w-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto relative">
              <NewTask onCreate={handleCreate} />
              <button
                onClick={closeModal}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md absolute top-0 right-3"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <h1 className="font-bold text-2xl sticky top-0 m-2 bg-inherit text-center z-10 pb-2">
        Task Dashboard
      </h1>

      <div className="mx-auto flex flex-wrap justify-center">
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          tasks.map((task) => (
            <InfoComponent
              key={task._id}
              task={task}
              onDelete={handleTaskDelete}
              onUpdate={handleTaskUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
