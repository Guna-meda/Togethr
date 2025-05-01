import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sideBar";
import Dashboard from "./pages/Dashboard";
import TasksBoard from "./pages/TasksBoard";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import AuthRedirect from "./features/authRedirect"

const App = () => {

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white dark:bg-zinc-900 transition-colors duration-300">
      <AuthRedirect/>
      <Sidebar />
      <div className="flex-grow p-4 md:p-6 overflow-y-auto text-gray-900 dark:text-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/TasksBoard" element={<TasksBoard />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/ChatPage" element={<ChatPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
