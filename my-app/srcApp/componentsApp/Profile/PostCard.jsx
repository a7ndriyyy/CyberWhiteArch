import React from "react";

export default function PostCard({ author, meta, text, media = [], actions }) {
  return (
    <div className="cw-postcard-inner">
      <div className="cw-post-head">
        <div className="cw-avatar cw-avatar--sm cw-avatar--teal">{author.initials}</div>
        <div>
          <strong>{author.name}</strong>
          <div className="cw-muted">{meta}</div>
        </div>
      </div>

      <p className="cw-post-text">{text}</p>

      <div className="cw-media-pair">
        {media.slice(0, 2).map((m, i) => (
          <div key={i} className="cw-tile">{m.label}</div>
        ))}
      </div>

      <div className="cw-post-actions">
        <button className="cw-pill">
          <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
          </svg>
          {actions?.likes ?? 0}
        </button>
        <button className="cw-pill">{actions?.comments ?? 0}</button>
        <button className="cw-pill">Share</button>
      </div>
    </div>
  );
}
