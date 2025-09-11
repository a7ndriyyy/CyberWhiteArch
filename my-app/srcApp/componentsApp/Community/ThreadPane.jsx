import React from "react";

export default function ThreadPane() {
  return (
    <aside className="cw-thread cw-card">
      <div className="cw-thread-head">
        <div>Thread / Members</div>
        <button className="cw-pill">Hide</button>
      </div>

      <div className="cw-pinned">
        <span className="cw-file">pinned: disclosure-template.md</span>
        <button className="cw-pill">Open</button>
      </div>

      <div className="cw-members scroller">
        {["AL","AN","TG","RE"].map(m => (
          <div key={m} className="cw-member">
            <div className="cw-circle cw-circle--mint">{m}</div>
          </div>
        ))}
      </div>

      <div className="cw-typing">Typing: Aria Labs…</div>
    </aside>
  );
}
