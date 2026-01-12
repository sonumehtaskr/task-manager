import React, { useState } from "react";
import axios from "axios";
import { taskEndpoints } from "../../utils/apis";

const NewTaskComponent = ({ onCreate }) => {
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "desc") {
      setDesc(value);
    }
  };

  const handleNewTask = () => {
    if (!title || !desc) {
      setError("Please provide both a title and a description");
      return;
    }

    setLoading(true);

    axios
      .post(
        taskEndpoints.CREATE_TASK_API, // Adjust the API endpoint if needed
        {
          title,
          desc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Task created successfully:", response.data);
        setTitle(""); // Clear title input
        setDesc(""); // Clear description input
        setLoading(false);
        onCreate(response?.data?.data); // Notify parent component with the newly created task
      })
      .catch((error) => {
        console.error("Error creating task", error);
        setLoading(false);
        setError("An error occurred while creating the task.");
      });
  };

  return (
    <div className="`border-4 p-2 m-2 rounded min-w-fit w-[90%] md:w-[40%]">
      <h2 className="font-bold text-lg border-b-2 mb-4">Create New Task</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={handleInputChange}
          className="w-full p-2 border-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="desc" className="block font-semibold">
          Description
        </label>
        <textarea
          id="desc"
          name="desc"
          value={desc}
          onChange={handleInputChange}
          className="w-full p-2 border-2 rounded"
        />
      </div>
      <div>
        <button
          onClick={handleNewTask}
          className="p-2 bg-green-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </div>
    </div>
  );
};

export default NewTaskComponent;
