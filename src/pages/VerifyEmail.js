import { useLocation,useNavigate } from "react-router";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";

function VerifyEmail() {
  let location = useLocation();
  let navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      console.log("Token is: ", token);
      if (!token) {
        setVerificationStatus(
          "No token provided. Please verify your email first."
        );
        const timer = setTimeout(() => {
          navigate("/login");
        }, 5000);
        setLoading(false);
        return () => {
          clearTimeout(timer);
        };
      }
      try {
        const response = await axios.get(
          `http://localhost:3002/api/v1/user/verify-email?token=${token}`
        );

        console.log("response: ", response);
        if (response.status === 200) {
          setVerificationStatus("Email successfully verified!");
        } else {
          setVerificationStatus(
            "Failed to verify email. Please try again later."
          );
        }
      } catch (error) {
        console.log("error: ", error);
        setVerificationStatus(
          `Server Error: ${error?.response?.data?.message}`
        );
      } finally {
        setLoading(false);
      }
    };
    verifyEmail();
  }, [token,navigate]);

  if (!token) {
    return (
      <div className="bg-white max-w-4xl rounded-lg m-10 flex justify-center items-center w-11/12 min-h-[50vh]">
        <h1 className="text-2xl font-semibold">
          Please verify your email first
        </h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white max-w-4xl rounded-lg m-10 flex justify-center items-center w-11/12 min-h-[50vh]">
        <HashLoader
          color={"red"}
          loading={true}
          cssOverride={{
            display: "block",
            margin: "0 auto",
            borderColor: "red",
          }}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="bg-white max-w-4xl rounded-lg m-10 flex justify-center items-center w-11/12 min-h-[50vh]">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{verificationStatus}</h2>
      </div>
    </div>
  );
}

export default VerifyEmail;
