import toast from "react-hot-toast";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { passwordStrength } from "check-password-strength";
import { userEndpoints } from "../../utils/apis";
import { useState } from 'react';

const Right = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
  });

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    email: "",
    password: "",
  });


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: file, // Store the actual file object
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: "", // Reset if no file selected
      }));
    }
  };

  const validateField = (fieldName) => {
    let error = { ...errorMessage };
    console.log("validating data");
    if (formData.name.length < 3) {
      error.name = "Name must be at least 3 characters long";
    } else {
      error.name = "";
    }
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

    // switch (fieldName) {
    //   case "name":
    //     if (formData.name.length < 3) {
    //       error.name = "Name must be at least 3 characters long";
    //     } else {
    //       error.name = "";
    //     }
    //     break;
    //   case "email":
    //     if (formData.email.length < 3)
    //       error.email = "Email must be at least 3 characters long";
    //     else if (
    //       !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    //         formData.email
    //       )
    //     ) {
    //       error.email = "Email must be valid missing '@' or '.' ";
    //     } else {
    //       error.email = "";
    //     }
    //     break;
    //   case "password":
    //     if (formData.password.length < 6) {
    //       error.password = "Password must be at least 6 characters long";
    //     } else {
    //       error.password = "";
    //     }
    //     break;
    //   default:
    //     break;
    // }
    setErrorMessage(error);
  };

  const handleInputChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    console.log("vale is:", value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name);
  };

  // const handleBlur = (e) => {
  //   const { name } = e.target;
  //   validateField(name);
  // };

  const checkPasswordStrength = (password) => {
    const strength = passwordStrength(password).value;

    let colorClass = "";

    if (strength === "Weak") {
      colorClass = "text-red-500";
    } else if (strength === "Medium") {
      colorClass = "text-yellow-500";
    } else if (strength === "Strong") {
      colorClass = "text-green-500";
    }
    return <span className={colorClass}>{strength}</span>;
  };

  const submitForm = async (formData) => {
    if (!formData.name || !formData.email || !formData.password) {
      throw new Error("All fields are required");
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("password", formData.password);
    if (formData.profilePicture) {
      form.append("profilePicture", formData.profilePicture);
    }

    try {
      const response = await axios.post(userEndpoints.SIGNUP_API, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response of post: ", response);
    } catch (error) {
      console.log("error in submitting form", error);
      const errMsg=error?.response?.data?.message;
      throw new Error(`${error?errMsg:"Connection error"}`);
    }
    console.log("Form Submitted Successfully");
    setFormData({ name: "", email: "", password: "", profilePicture: null });
    navigate("/verify-email");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    validateField("name");
    validateField("email");
    validateField("password");

    // Check if there are any errors before submitting
    if (!errorMessage.name && !errorMessage.email && !errorMessage.password) {
      console.log("Form submitting with data:", formData);

      toast.promise(
        submitForm(formData), // Return the promise from submitForm
        {
          loading: "Signing up...", // This is shown while the promise is pending
          success: "Verify link sent to email!", // Success message after promise resolves
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
          <h1 className="text-2xl font-bold">Get Started</h1>
          <h2 className="opacity-60">Create your account</h2>
        </div>

        {/* Name Field */}
        <div className="flex flex-col relative">
          <label htmlFor="name" className="mb-1 opacity-60">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            //onBlur={handleBlur} // Validate on blur (when focus is lost)
            className="rounded-md bg-inherit outline outline-gray-400 outline-1 focus:outline-indigo-300 p-1 py-2"
          />
          {errorMessage.name && (
            <span className="text-red-600 text-xs italic absolute bg-white -bottom-2 mx-2 Left">
              {errorMessage.name}
            </span>
          )}
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
            //onBlur={handleBlur} // Validate on blur (when focus is lost)
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
            //onBlur={handleBlur} // Validate on blur (when focus is lost)
            className="rounded-lg bg-inherit outline outline-gray-400 outline-1 focus:outline-indigo-300 p-1 py-2"
          />
          {errorMessage.password && (
            <span className="text-red-600 text-xs italic absolute bg-white -bottom-2 mx-2 Left">
              {errorMessage.password}
            </span>
          )}
          {formData.password && (
            <div className="absolute right-2 text-xs top-1">
              {checkPasswordStrength(formData.password)}
            </div>
          )}
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col relative">
          <label htmlFor="profilePicture" className="mb-1 opacity-60">
            Profile Photo:{" "}
            <span className="text-xs opacity-50"> (optional)</span>
          </label>
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg"
            id="profilePicture"
            name="profilePicture"
            onChange={handleFileChange} // Corrected to handle the file change
            className="rounded-lg bg-inherit outline outline-gray-400 outline-1 focus:outline-indigo-300 p-1 py-2"
          />
          {formData.profilePicture && (
            <img
              src={URL.createObjectURL(formData.profilePicture)} // Preview the image before uploading
              alt="Profile Preview"
              className="object-fill outline absolute right-4 text-xs top-2 aspect-square w-16 rounded-full mt-2"
            />
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
        <p className="opacity-60 inline">Have an account? </p>
        <a href="/login">Log in</a>
      </div>
    </div>
  );
};

export default Right;
