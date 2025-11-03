// src/pages/CoverPage/components/Dialogs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, Link } from "react-router-dom";
import "./Dialogs.css";

const dialogsData = [
  { id: 1, avatar: "TG", title: "Core Devs", time: "14:22", lastMsg: "Yuki: Ship the thread prototype tonight?", badge: 3 },
  { id: 2, avatar: "AN", title: "Announcements", time: "12:03", lastMsg: "New build is live · 0.4.2" },
  { id: 3, avatar: "PR", title: "Privacy Group", time: "Yesterday", lastMsg: "Aria: E2E by default, right?", badge: 12 },
];

export default function Dialogs() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // saved at login
    if (!userId) return;

    axios
      .get(`http://localhost:5000/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load user", err));
  }, []);

  const username = user?.username || "Guest";
  const avatar = username.slice(0, 2).toUpperCase();

  // Keep your "is-active" class in sync with current route
  const linkClass = ({ isActive }) =>
    `cw-sidenav__item ${isActive ? "is-active" : ""}`;

  return (
    <aside className="cw-dialogs">
      <div className="cw-dialogs__head">
        {/* avatar initials from username */}
        <div className="cw-dialogs__logo">{avatar}</div>
        {/* username from Mongo */}
        <div className="cw-dialogs__brand">@{username}</div>
      </div>

      <nav className="cw-sidenav cw-card" aria-label="Primary">
        {/* ABSOLUTE /app/... paths so you stay inside the protected app */}
        <NavLink to="/app" end className={linkClass}>
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5 10.5V20h14v-9.5" />
          </svg>
          Home
        </NavLink>

        {/* These two require you to have routes at /app/explore and /app/create (optional) */}
        <NavLink to="/app/explore" className={linkClass}>
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          Explore
        </NavLink>

        <NavLink to="/app/dm" className={linkClass}>
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 8h18" />
          </svg>
          Messages
        </NavLink>

        <NavLink to="/app/community" className={linkClass}>
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
          </svg>
          Community
        </NavLink>

        <NavLink to="/app/profile" className={linkClass}>
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
            <path d="M2 22a10 10 0 0 1 20 0" />
          </svg>
          Profile
        </NavLink>

        <NavLink to="/app/create" className={linkClass}>
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create Tool
        </NavLink>
      </nav>

      <div className="cw-dialogs__card">
        <div className="cw-dialogs__search">
          <svg className="cw-dialogs__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input className="cw-dialogs__input" placeholder="Search chats" />
        </div>

        <div className="cw-dialogs__list">
          {dialogsData.map((d) => (
            <Link to={`/app/dm?chat=${d.id}`} className="cw-dialogs__item" key={d.id}>
              <div className="cw-dialogs__avatar">{d.avatar}</div>
              <div className="cw-dialogs__meta">
                <div className="cw-dialogs__line">
                  <strong>{d.title}</strong>
                  <span className="cw-dialogs__muted">{d.time}</span>
                </div>
                <div className="cw-dialogs__line">
                  <span className="cw-dialogs__muted">{d.lastMsg}</span>
                  {d.badge && <span className="cw-dialogs__badge">{d.badge}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
