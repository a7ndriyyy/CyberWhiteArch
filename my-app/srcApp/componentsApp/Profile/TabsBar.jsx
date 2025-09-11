import React from "react";

export default function TabsBar({ tabs = [], active, onChange }) {
  return (
    <>
      <div className="cw-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className="cw-tab"
            aria-selected={String(t === active)}
            onClick={() => onChange?.(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="cw-right-actions">
        <button className="cw-chip">Edit</button>
        <button className="cw-chip">Share</button>
      </div>
    </>
  );
}
