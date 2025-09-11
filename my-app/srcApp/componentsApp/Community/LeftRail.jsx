import React from "react";

export default function LeftRail({ items = [], activeIndex = 0 }) {
  return (
    <aside className="cw-comm-rail">
      {items.map((it, i) => (
        <button key={i} className={`cw-rail-pill ${i === activeIndex ? "is-active" : ""}`}>
          {it}
        </button>
      ))}
    </aside>
  );
}
