import React from "react";
import "./Rightbar.css";

export default function Rightbar() {
  return (
    <aside className="cw-rightbar">
      {/* Communities */}
      <section className="cw-panel cw-card">
        <h3 className="cw-panel-title">Communities</h3>
        <div className="cw-row">
          <div className="cw-community">
            <div className="cw-avatar">DS</div>
            <div>
              <strong>r/design</strong>
              <div className="cw-muted">45k members</div>
            </div>
          </div>
          <button className="cw-pill">Join</button>
        </div>
        <div className="cw-row">
          <div className="cw-community">
            <div className="cw-avatar">PR</div>
            <div>
              <strong>r/privacy</strong>
              <div className="cw-muted">80k members</div>
            </div>
          </div>
          <button className="cw-pill">Join</button>
        </div>
        <div className="cw-row">
          <div className="cw-community">
            <div className="cw-avatar">SE</div>
            <div>
              <strong>r/securedev</strong>
              <div className="cw-muted">12k members</div>
            </div>
          </div>
          <button className="cw-pill">Join</button>
        </div>
      </section>

      {/* Trends */}
      <section className="cw-panel cw-card">
        <h3 className="cw-panel-title">Trends</h3>
        <div className="cw-row">
          <div>
            <div className="cw-muted">#cybersec</div>
            <strong>New zero‑day patched</strong>
          </div>
          <button className="cw-pill">Follow</button>
        </div>
        <div className="cw-row">
          <div>
            <div className="cw-muted">#privacy</div>
            <strong>E2E by default</strong>
          </div>
          <button className="cw-pill">Follow</button>
        </div>
        <div className="cw-row">
          <div>
            <div className="cw-muted">#ux</div>
            <strong>Feed‑as‑chat</strong>
          </div>
          <button className="cw-pill">Follow</button>
        </div>
      </section>
    </aside>
  );
}
