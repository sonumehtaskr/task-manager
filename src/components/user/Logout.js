import React from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { userEndpoints } from "../../utils/apis";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    try{
      axios.get(userEndpoints.LOGOUT_API, {
        withCredentials: true,
      });
    } catch{
      console.log("Unable to logout")
    }
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white p-2 rounded-md mb-4 self-end"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
