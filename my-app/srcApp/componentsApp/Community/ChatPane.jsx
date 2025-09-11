import React from "react";

export default function ChatPane({ title }) {
  return (
    <section className="cw-chat cw-card">
      {/* header */}
      <div className="cw-chat-head">
        <div className="cw-chat-title">{title}</div>
        <div className="cw-badges">
          <span className="cw-badge">E2E Enabled</span>
          <span className="cw-badge">Slow-mode: off</span>
          <button className="cw-pill">📌 Pinned</button>
          <button className="cw-pill">🧵 Threads</button>
        </div>
      </div>

      {/* timeline */}
      <div className="cw-chat-scroll scroller">
        <div className="cw-msg-card">
          <div className="cw-author">
            <div className="cw-circle cw-circle--mint">AL</div>
            <strong>Aria Labs</strong>
            <span className="cw-muted"> · 09:41</span>
            <span className="cw-mod">mod</span>
          </div>
          <p className="cw-text">
            Morning folks! Ship your PoCs in threads. Links auto-expand and code blocks are syntax-safe.
          </p>
          <div className="cw-row-actions">
            <span>👍 12</span>
            <button className="cw-link">Reply</button>
          </div>
        </div>

        <div className="cw-msg-card">
          <div className="cw-author">
            <div className="cw-circle cw-circle--mint">AN</div>
            <strong>Anonymous</strong>
            <span className="cw-muted"> · 09:44</span>
          </div>

          <p className="cw-text">
            Dropping a sanitized repro. TL;DR: missing auth check on export endpoint.
          </p>

          <div className="cw-replybar">
            Replying to <b>Aria Labs</b>: "Ship your PoCs in threads..."
          </div>

          <div className="cw-asset">
            <div>
              <strong>export-repro.txt</strong> · <span className="cw-muted">3.1 KB</span>
            </div>
            <button className="cw-pill">Download</button>
          </div>

          {/* Use String.raw so JSX never parses the contents */}
          <pre className="cw-code">
            {String.raw`curl -s -H "Authorization: Bearer <redacted>" \
"https://acme.example/api/v1/export?userId=123"`}
          </pre>

          <div className="cw-row-actions">
            <span>👍 7</span>
            <button className="cw-link">🧵 Open thread (4)</button>
          </div>
        </div>

        <div className="cw-msg-card">
          <div className="cw-author">
            <div className="cw-circle cw-circle--mint">U</div>
            <strong>You</strong>
            <span className="cw-muted"> · 09:46</span>
          </div>
          <div className="cw-note">
            Nice catch. I'll write a patch proposal and attach diffs.
            <div className="cw-row-actions">
              <button className="cw-link">✏️ Edit</button>
              <button className="cw-link">🗑️ Delete</button>
            </div>
          </div>
        </div>
      </div>

      {/* composer */}
      <div className="cw-composer">
        <div className="cw-input-wrap">
          <input placeholder="Write a message to @someone or #channel..." />
        </div>
        <button className="cw-icon-btn" title="Attach">＋</button>
        <button className="cw-btn-primary">Send</button>
      </div>
    </section>
  );
}
