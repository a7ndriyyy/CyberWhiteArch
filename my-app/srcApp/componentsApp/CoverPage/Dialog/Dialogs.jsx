// src/pages/CoverPage/components/Dialogs.jsx
import React from "react";
import "./Dialogs.css";
import { NavLink } from "react-router-dom";

const dialogsData = [
  {
    id: 1,
    avatar: "TG",
    title: "Core Devs",
    time: "14:22",
    lastMsg: "Yuki: Ship the thread prototype tonight?",
    badge: 3,
  },
  {
    id: 2,
    avatar: "AN",
    title: "Announcements",
    time: "12:03",
    lastMsg: "New build is live · 0.4.2",
  },
  {
    id: 3,
    avatar: "PR",
    title: "Privacy Group",
    time: "Yesterday",
    lastMsg: "Aria: E2E by default, right?",
    badge: 12,
  },
];

export default function Dialogs() {
  return (
    <aside className="cw-dialogs">
      <div className="cw-dialogs__head">
        <div className="cw-dialogs__logo">CW</div>
        <div className="cw-dialogs__brand">CyberWhiteHat</div>
      </div>

        {/* NEW — Sidebar menu card */}

      <nav className="cw-sidenav cw-card" aria-label="Primary">
        <a className="cw-sidenav__item is-active" href="#">
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5 10.5V20h14v-9.5" />
          </svg>
          Home
        </a>

        <NavLink to="explore" className="cw-sidenav__item">
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          Explore
        </NavLink>

        <NavLink to="/app/dm" className="cw-sidenav__item">
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 8h18" />
          </svg>
          Messages
        </NavLink>

       <NavLink to="/app/community" className="cw-sidenav__item">
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
          </svg>
          Community
        </NavLink>

       <NavLink to="/app/profile" className="cw-sidenav__item">
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z"/><path d="M2 22a10 10 0 0 1 20 0"/>
          </svg>
          Profile
        </NavLink>

        <a className="cw-sidenav__item" href="#">
          <svg viewBox="0 0 24 24" className="cw-sidenav__icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create Tool
        </a>
      </nav>



      <div className="cw-dialogs__card">
        <div className="cw-dialogs__search">
          <svg className="cw-dialogs__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7"/>
            <path d="M20 20l-3.5-3.5"/>
          </svg>
          <input className="cw-dialogs__input" placeholder="Search chats"/>
        </div>

        <div className="cw-dialogs__list">
          {dialogsData.map(d => (
            <a href="#" className="cw-dialogs__item" key={d.id}>
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
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
