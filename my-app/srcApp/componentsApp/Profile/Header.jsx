import React from "react";

export default function Header({ user }) {
  return (
    <>
      <div className="cw-ph-left">
        <div className="cw-avatar cw-avatar--lg cw-avatar--teal">{user.initials}</div>
        <div>
          <div className="cw-title">{user.name}</div>
          <div className="cw-subtitle">{user.title}</div>

          <div className="cw-tags">
            {user.tags.map((t, i) => (
              <span className="cw-tag" key={i}>{t}</span>
            ))}
          </div>

          <div className="cw-stats">
            <span><strong>{user.stats.posts}</strong> Posts</span>
            <span><strong>{user.stats.followers.toLocaleString()}</strong> Followers</span>
            <span><strong>{user.stats.following}</strong> Following</span>
          </div>

          <div className="cw-badge-line">
            <span className="cw-mini">{user.reputation}</span>
          </div>
        </div>
      </div>

      <div className="cw-ph-actions">
        <button className="cw-btn-primary">
          <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Track
        </button>
        <button className="cw-chip">
          <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 8h18"/>
          </svg>
          Message
        </button>
        <button className="cw-icon-btn" title="More" aria-label="More">
          <svg className="cw-icon" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>
          </svg>
        </button>
      </div>
    </>
  );
}
