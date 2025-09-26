import React from "react";
import { Link } from "react-router-dom";

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
        
         <Link to="edit" className="cw-chip">Edit</Link>
        <button className="cw-chip">Share</button>
      </div>
    </>
  );
}
