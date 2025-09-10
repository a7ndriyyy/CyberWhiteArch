import React from "react";
import "./Center.css";

export default function Center() {
  return (
    <main className="cw-center">
      {/* Topbar with tabs */}
      <div className="cw-topbar cw-card">
        <div className="cw-tabs">
          <button className="cw-tab" aria-selected="true">Chat</button>
          <button className="cw-tab">Discover</button>
          <button className="cw-tab">Following</button>
        </div>
        <button className="cw-chip" id="themeToggle">
          <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z"/>
          </svg>
          Theme
        </button>
      </div>

      {/* Conversation thread */}
      <section className="cw-thread cw-card" aria-label="Conversation">
        {/* Telegram-like message */}
        <div className="cw-msg">
          <div className="cw-avatar">AL</div>
          <div className="cw-bubble">
            <div className="cw-meta-row"><strong>Aria Labs</strong><span className="cw-muted">· 2m</span></div>
            Hey team, testing the hybrid timeline. Messages can include embedded posts.
            <div className="cw-reactions">
              <span className="cw-react">👍 4</span>
              <span className="cw-react">🔥 2</span>
            </div>
          </div>
        </div>

        {/* Embedded post */}
        <article className="cw-post">
          <div className="cw-vote">
            <button title="Upvote" aria-label="Upvote">▲</button>
            <div className="cw-score">128</div>
            <button title="Downvote" aria-label="Downvote">▼</button>
          </div>
          <div>
            <div className="cw-meta-row">
              <strong>@cyberwhitehat</strong>
              <span className="cw-muted">· 10m in r/design</span>
            </div>
            <div style={{ marginTop: "6px" }}>
              Building a privacy‑first network that feels like chat but scales like a feed.
            </div>
            <div className="cw-media-grid">
              <div className="cw-media">IMG</div>
              <div className="cw-media">IMG</div>
            </div>
            <div className="cw-actions">
              <button className="cw-action" aria-label="Comment">
                <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>
                </svg> 24
              </button>
              <button className="cw-action" aria-label="Repost">
                <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17 2l4 4-4 4"/>
                  <path d="M3 12v-2a4 4 0 0 1 4-4h14"/>
                  <path d="M7 22l-4-4 4-4"/>
                  <path d="M21 12v2a4 4 0 0 1-4 4H3"/>
                </svg> 18
              </button>
              <button className="cw-action" aria-label="Save">
                <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>
                </svg>
              </button>
              <button className="cw-action" aria-label="Share">
                <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/>
                  <path d="M16 6l-4-4-4 4"/>
                  <path d="M12 2v13"/>
                </svg>
              </button>
            </div>
          </div>
        </article>

        {/* Another message (me) */}
        <div className="cw-msg cw-me">
          <div className="cw-avatar">U</div>
          <div className="cw-bubble">
            Love it. Let’s add message replies that stack like Telegram threads but appear in the feed too.
          </div>
        </div>
      </section>

      {/* Composer at bottom */}
      <div className="cw-composer cw-card">
        <button className="cw-icon-btn" title="Attach" aria-label="Attach">
          <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21.44 11.05 12.66 19.8a5 5 0 0 1-7.07-7.07l8.78-8.75a3 3 0 1 1 4.25 4.25l-8.49 8.46a1 1 0 1 1-1.41-1.41l8.19-8.16"/>
          </svg>
        </button>
        <input placeholder="Message or post…" />
        <button className="cw-icon-btn" title="Emoji" aria-label="Emoji">
          <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9"/>
            <path d="M9 10h.01M15 10h.01"/>
            <path d="M8 15s1.5 2 4 2 4-2 4-2"/>
          </svg>
        </button>
        <button className="cw-btn-primary">
          <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="m22 2-7 20-4-9-9-4Z"/>
          </svg>
          Send
        </button>
      </div>
    </main>
  );
}
