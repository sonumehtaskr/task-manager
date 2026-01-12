import toast from "react-hot-toast";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userEndpoints } from "../../utils/apis";
import { useState } from "react";

const Right = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    email: "",
    password: "",
  });

  const validateField = (fieldName) => {
    let error = { ...errorMessage };
    console.log("validating data");
    if (formData.email.length < 3)
      error.email = "Email must be at least 3 characters long";
    else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      error.email = "Email must be valid missing '@' or '.' ";
    } else {
      error.email = "";
    }
    if (formData.password.length < 6) {
      error.password = "Password must be at least 6 characters long";
    } else {
      error.password = "";
    }
    setErrorMessage(error);
  };

  const handleInputChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    console.log("vale is:", value);
    validateField(name);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitForm = async (formData) => {
    if (!formData.email || !formData.password) {
      throw new Error("All fields are required");
    }

    const form = new FormData();
    form.append("email", formData.email);
    form.append("password", formData.password);

    try {
      const response = await axios.post(userEndpoints.LOGIN_API, form, {
        withCredentials: true,
      });
      console.log("response of post: ", response);
      const token = response.data.token;
      localStorage.setItem("token", token);
    } catch (error) {
      console.log("error in submitting form", error);
      const errMsg = error?.response?.data?.message;
      throw new Error(`${error ? errMsg : "Connection error"}`);
    }
    console.log("Form Submitted Successfully");
    setFormData({ email: "", password: "" });
    navigate("/dashboard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validateField("email");
    validateField("password");

    // Check if there are any errors before submitting
    if (!errorMessage.email && !errorMessage.password) {
      console.log("Form submitting with data:", formData);

      toast.promise(
        submitForm(formData), // Return the promise from submitForm
        {
          loading: "Logging in...", // This is shown while the promise is pending
          success: "Login success!", // Success message after promise resolves
          error: (error) => `${error.message}`, // Error message if promise is rejected
        }
      );
    }
  };

  return (
    <div className="flex flex-col w-[90%] md:w-[50%] m-5 p-5 justify-evenly">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center gap-4 rounded-lg Left"
      >
        <div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <h2 className="opacity-60">Login to your account</h2>
        </div>

        {/* Email Field */}
        <div className="flex flex-col relative">
          <label htmlFor="email" className="mb-1 opacity-60">
            Email:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="rounded-lg bg-inherit outline outline-gray-400 outline-1 focus:outline-indigo-300  p-1 py-2"
          />
          {errorMessage.email && (
            <span className="text-red-600 text-xs italic absolute bg-white -bottom-2 mx-2 Left">
              {errorMessage.email}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col relative">
          <label htmlFor="password" className="mb-1 opacity-60">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="rounded-lg bg-inherit outline outline-gray-400 outline-1 focus:outline-indigo-300 p-1 py-2"
          />
          {errorMessage.password && (
            <span className="text-red-600 text-xs italic absolute bg-white -bottom-2 mx-2 Left">
              {errorMessage.password}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-darkPurple hover:bg-blue-700 text-white rounded-lg mt-4 py-2 font-semibold"
        >
          Sign Up
        </button>
      </form>
      <div className="mx-auto">
        <p className="opacity-60 inline">New Visitor? </p>
        <a href="/">Sign Up</a>
      </div>
    </div>
  );
};

export default Right;
