import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import LostPage from "./pages/LostPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="bg-lightBlack min-h-screen flex justify-center">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Dashboard/*" element={<Dashboard />} />
          <Route path="*" element={<LostPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
