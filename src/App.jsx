import React, { useEffect,useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sideBar";
import Dashboard from "./pages/Dashboard";
import TasksBoard from "./pages/TasksBoard";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import { authListner } from "./firebase/authListner";
import { getRedirectResult, signInWithPopup } from "firebase/auth";
import { useLoadUserTeams } from "./hooks/useLoadTeams";
import { Toaster } from "react-hot-toast";

import { db, auth, provider } from "../src/firebase/firebaseConfig";
import Teams from "./pages/Teams";
import TeamPage from "./components/TeamPage";
import TeamWrapper from "./pages/TeamWrapper";

const App = () => {

  useEffect(() => {
    const unsubscribe = authListner();
    console.log("Auth listener mounted");
    return () => unsubscribe();
    } , [])

    useLoadUserTeams();


  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white dark:bg-zinc-900 transition-colors duration-300">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "green",
              secondary: "white",
            },
          },
        }}
      />
      <Sidebar />
      <div className="flex-grow p-4 md:p-6 overflow-y-auto text-gray-900 dark:text-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/TasksBoard" element={<TasksBoard />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/ChatPage" element={<ChatPage />} />
          <Route path="/Teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamWrapper />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;
