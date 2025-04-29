import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sideBar";
import Dashboard from "./pages/Dashboard";
import TasksBoard from "./pages/TasksBoard";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import { useAppStore } from "./store/useAppStore";

const App = () => {
  const setdarkTheme = useAppStore((state) => state.setdarkTheme);
  const darkTheme = useAppStore((state) => state.darkTheme);
  const isThemeLoaded = useAppStore((state) => state.isThemeLoaded);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark";
    console.log(" Stored theme:", storedTheme, "→ isDark:", isDark);
    setdarkTheme(isDark);
  }, [setdarkTheme]);

  useEffect(() => {
    console.log("🌓 darkTheme changed to:", darkTheme);
    const html = document.documentElement;
    if (darkTheme) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkTheme, setdarkTheme]);

  if (!isThemeLoaded) return null;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white dark:bg-zinc-900 transition-colors duration-300">
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
