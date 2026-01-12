import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userEndpoints } from "../../utils/apis";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import firebaseapp from "../../firebase/firebase";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
const auth = getAuth(firebaseapp);
const provider = new GoogleAuthProvider();

const Right = () => {
  const navigate = useNavigate();

  // Set the validation mode to 'onChange' so that validation occurs as soon as user types
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange", // validation happens on each change
  });

  const submitForm = async (data) => {
    if (!data.email || !data.password) {
      throw new Error("All fields are required");
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("Credential is ", userCredential);
      const idToken = await userCredential.user.getIdToken();
      const response = await axios.post(
        userEndpoints.LOGIN_API,
        { idToken },
        {
          withCredentials: true,
        }
      );
      console.log("Response of post:", response);
      if (response.data.success) {
        console.log("Form Submitted Successfully");
        navigate("/dashboard");
      } else {
        throw new Error(
          response.data.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error in submitting form:", error);
      const errMsg =
        error?.response?.data?.message || error.message || "Connection error";
      throw new Error(errMsg);
    }
  };

  const onSubmit = (data) => {
    toast.promise(
      submitForm(data), // Return the promise from submitForm
      {
        loading: "Logging in...", // This is shown while the promise is pending
        success: "Login success!", // Success message after promise resolves
        error: (error) => `${error.message}`, // Error message if promise is rejected
      }
    );
  };

  const googleSignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log("credential is ", result);
      const idToken = await result.user.getIdToken();
      console.log("Id token i s", idToken);

      const response = await axios.post(
        userEndpoints.LOGIN_API,
        { idToken },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error while signing with Google: ", error);
    }
  };

  return (
    <div className="flex flex-col w-[90%] md:w-[50%] m-5 p-5 justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center gap-4 rounded-lg Left h-50"
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
            {...register("email", {
              required: "Email is required",
              minLength: {
                value: 3,
                message: "Email must be at least 3 characters long",
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email must be valid",
              },
            })}
            className={`rounded-lg bg-inherit outline outline-gray-400 outline-1 p-1 py-2 ${
              errors.email ? "outline-red-500" : ""
            }`}
          />
          {errors.email && (
            <span className="text-red-600 text-xs italic mx-2 Left absolute -bottom-5">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col relative">
          <label htmlFor="password" className={`mb-1 opacity-60 }`}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            className={`rounded-lg bg-inherit outline outline-gray-400 outline-1 p-1 py-2 ${
              errors.password ? "outline-red-500" : ""
            }`}
          />
          {errors.password && (
            <span className="text-red-600 text-xs italic mx-2 Left absolute -bottom-5">
              {errors.password.message}
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
      <button
        onClick={googleSignin}
        className="bg-darkPurple hover:bg-blue-700 text-white rounded-lg mt-4 py-2 font-semibold"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Right;
