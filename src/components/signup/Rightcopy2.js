import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { passwordStrength } from "check-password-strength";
import { userEndpoints } from "../../utils/apis";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import firebaseapp from "../../firebase/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
const auth = getAuth(firebaseapp);
const provider = new GoogleAuthProvider();

const Right = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ mode: "onTouched" });
  const [profilePicture, setProfilePicture] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setValue("profilePicture", file);
  };

  const checkPasswordStrength = (password) => {
    const strength = passwordStrength(password, [
      {
        id: 0,
        value: "Weak",
        minDiversity: 1,
        minLength: 3,
      },
      {
        id: 1,
        value: "Medium",
        minDiversity: 2,
        minLength: 5,
      },
      {
        id: 2,
        value: "Strong",
        minDiversity: 3,
        minLength: 6,
      },
    ]).value;
    let colorClass = "";

    if (strength === "Weak" || strength === "Too weak") {
      colorClass = "text-red-500";
    } else if (strength === "Medium") {
      colorClass = "text-yellow-500";
    } else if (strength === "Strong") {
      colorClass = "text-green-500";
    }

    return <span className={colorClass}>{strength}</span>;
  };

  const submitForm = async (data) => {
    if (!data.name || !data.email || !data.password) {
      throw new Error("All fields are required");
    }

    const form = new FormData();
    form.append("name", data.name);
    form.append("email", data.email);
    form.append("password", data.password);
    if (data.profilePicture) {
      form.append("profilePicture", data.profilePicture);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await sendEmailVerification(userCredential.user);

      console.log("User cred ", userCredential);

      // const response = await axios.post(userEndpoints.SIGNUP_API, form, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      // console.log("Response of post: ", response);

      console.log("Form Submitted Successfully");
      navigate("/dashboard"); // Navigate after email is sent
    } catch (error) {
      console.log("Error in submitting form", error);
      const errMsg = error?.response?.data?.message || error.message;
      throw new Error(`${errMsg || "Connection error"}`);
    }
  };

  const onSubmit = (data) => {
    toast.promise(submitForm(data), {
      loading: "Signing up...",
      success: "Verify link sent to email!",
      error: (error) => `${error.message}`,
    });
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
    <div className="flex flex-col w-[90%] md:w-[50%] m-5 p-5 justify-evenly">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center gap-4 rounded-lg Left"
      >
        <div>
          <h1 className="text-2xl font-bold">Get Started</h1>
          <h2 className="opacity-60">Create your account</h2>
        </div>

        {/* Name Field */}
        <div className="flex flex-col relative">
          <label htmlFor="name" className="mb-1 opacity-70">
            Name:
          </label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters long",
              },
            })}
            className={`rounded-lg bg-inherit outline outline-gray-400 outline-1 p-1 py-2 ${
              errors.name ? "outline-red-500" : ""
            }`}
          />
          {errors.name && (
            <span className="text-red-600 text-xs italic mx-2 Left absolute -bottom-5">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col relative">
          <label htmlFor="email" className="mb-1 opacity-70">
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
          <label htmlFor="password" className="mb-1 opacity-70">
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
          {watch("password") && (
            <div className="absolute right-2 text-xs top-1">
              {checkPasswordStrength(watch("password"))}
            </div>
          )}
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col relative">
          <label htmlFor="profilePicture" className="mb-1 opacity-60">
            Profile Photo:{" "}
            <span className="text-xs opacity-80"> (optional)</span>
          </label>
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg"
            id="profilePicture"
            {...register("profilePicture")}
            onChange={handleFileChange}
            className="rounded-lg bg-inherit outline outline-gray-400 outline-1 focus:outline-indigo-300 p-1 py-2"
          />
          {profilePicture && (
            <img
              src={URL.createObjectURL(profilePicture)}
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
