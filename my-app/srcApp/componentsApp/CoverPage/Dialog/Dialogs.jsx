// src/pages/CoverPage/components/Dialogs.jsx
import React from "react";
import "./Dialogs.css";

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

      <div className="cw-dialogs__folders">
        <button className="cw-dialogs__chip" aria-current="page">All</button>
        <button className="cw-dialogs__chip">Personal</button>
        <button className="cw-dialogs__chip">Groups</button>
        <button className="cw-dialogs__chip">Channels</button>
        <button className="cw-dialogs__chip">Bots</button>
      </div>

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
