import React from "react";

export default function GalleryGrid({ items = [] }) {
  return (
    <div className="cw-gallery-grid">
      {items.map((it) => (
        <div key={it.id} className="cw-tile">{it.label}</div>
      ))}
    </div>
  );
}
