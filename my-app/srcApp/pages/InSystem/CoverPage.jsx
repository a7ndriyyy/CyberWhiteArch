// src/pages/CoverPage/CoverPage.jsx
import React, { useState, useEffect } from "react";
import "./CoverPage.css";

import Dialogs from "../../componentsApp/CoverPage/Dialog/Dialogs";
import Center from "../../componentsApp/CoverPage/Center/Center";
import Rightbar from "../../componentsApp/CoverPage/Bar/RightBar";

export default function CoverPage() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("cwh-theme");
    if (saved) setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved || "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("cwh-theme", next);
  };

  useEffect(() => {
    const btn = document.getElementById("themeToggle");
    btn?.addEventListener("click", toggleTheme);
    return () => btn?.removeEventListener("click", toggleTheme);
  }, [theme]);

  return (
    <div className="app" role="application" aria-label="CyberWhiteHat Social">
      <Dialogs />
      <Center />
      <Rightbar />
    </div>
  );
}
