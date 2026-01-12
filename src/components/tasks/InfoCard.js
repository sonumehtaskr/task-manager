import React, { useState } from "react";
import axios from "axios";
import { taskEndpoints } from "../../utils/apis";

const InfoComponent = ({ task, onDelete, onUpdate }) => {
  const token = localStorage.getItem("token");

  const [isCompleted, setIsCompleted] = useState(task.completed); // Manage the completed state locally

  const handleDelete = (id) => {
    axios
      .delete(taskEndpoints.DELETE_TASK_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: id,
        },
      })
      .then((response) => {
        console.log("Task deleted successfully", response.data);
        onDelete(id); // Notify parent to remove task from state
      })
      .catch((error) => {
        console.error("Error deleting task", error);
      });
  };

  const convertToIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const handleStatusToggle = () => {
    const updatedStatus = !isCompleted;
    setIsCompleted(updatedStatus); // Update the local state

    axios
      .put(
        taskEndpoints.UPDATE_TASK_API,
        {
          id: task._id,
          status: updatedStatus, // Update the completed status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Task updated successfully", response.data);
        onUpdate(task._id, updatedStatus); // Notify parent to update task status in state
      })
      .catch((error) => {
        console.error("Error updating task", error);
        // Revert the local state if the API call fails
        setIsCompleted(task.completed);
      });
  };

  return (
    <div
      className={`border-4 p-2 m-2 rounded min-w-fit w-[90%] md:w-[40%] ${
        isCompleted ? "opacity-50" : ""
      }`}
    >
      <h2 className="font-bold text-lg border-b-2">{task.title}</h2>
      <p>{task.desc}</p>
      <p>Created At: {convertToIST(task.createdAt)}</p>
      <p>Updated At: {convertToIST(task.updatedAt)}</p>
      <p>Status: {isCompleted ? "Complete" : "Incomplete"}</p>

      <div className="flex items-center justify-between">
        <button
          onClick={() => handleDelete(task._id)}
          className="mt-2 p-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
        <button
          onClick={handleStatusToggle}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          {isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
        </button>
      </div>
    </div>
  );
};

export default InfoComponent;
