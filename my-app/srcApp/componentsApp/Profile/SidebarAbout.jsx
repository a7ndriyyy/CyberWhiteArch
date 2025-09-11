import React from "react";

export default function SidebarAbout({ about, highlights = [], skills = [] }) {
  return (
    <div className="cw-about-inner">
      <h4 className="cw-section-title">About</h4>
      <p className="cw-muted">{about}</p>

      <div className="cw-rows">
        <button className="cw-pill">Anyverse</button>
        <button className="cw-pill">profile</button>
      </div>

      <h4 className="cw-section-title">Highlights</h4>
      <div className="cw-chipline">
        {highlights.map((h, i) => (
          <span className="cw-bubble cw-bubble--mint" key={i}>{h}</span>
        ))}
      </div>

      <h4 className="cw-section-title">Skills</h4>
      <div className="cw-chipgrid">
        {skills.map((s, i) => (
          <span className="cw-chip-soft" key={i}>{s}</span>
        ))}
      </div>
    </div>
  );
}
