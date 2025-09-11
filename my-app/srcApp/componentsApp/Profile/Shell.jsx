import React from "react";
import { NavLink } from "react-router-dom";

export default function Shell() {
  return (
    <header className="cw-shell cw-card">
      <div className="cw-shell-left">
        <div className="cw-shell-badge">CW</div>
        <strong>CyberWhiteHat</strong>
      </div>
      <div className="cw-shell-right">
        <button className="cw-chip" id="themeToggle" title="Toggle theme">
          <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z"/>
          </svg>
          Theme
        </button>
     <NavLink className="cw-chip" to="/app" end>
          <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/>
          </svg>
          Back to App
        </NavLink>
      </div>
    </header>
  );
}
