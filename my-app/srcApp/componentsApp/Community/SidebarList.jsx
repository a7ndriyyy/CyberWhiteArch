import React, { useMemo } from "react";

export default function SidebarList({ query, setQuery, channels = [], dms = [], active, onSelect }) {
  const q = query.trim().toLowerCase();

  const filteredCh = useMemo(
    () => channels.filter(c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)),
    [channels, q]
  );
  const filteredDM = useMemo(
    () => dms.filter(d => d.name.toLowerCase().includes(q) || (d.status || "").toLowerCase().includes(q)),
    [dms, q]
  );

  return (
    <aside className="cw-comm-sidebar cw-card">
      <div className="cw-sidebar-head">
        <div className="cw-sidebar-title">{active.type === "channel" ? `# ${active.id}` : "DMs"}</div>
        <button className="cw-chip" id="themeToggle">Theme</button>
      </div>

      <div className="cw-search">
        <svg viewBox="0 0 24 24" className="cw-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search channels or DMs"
        />
      </div>

      <div className="cw-list scroller">
        <div className="cw-list-section">Channels</div>
        {filteredCh.map(ch => (
          <button
            key={ch.id}
            className={`cw-list-item ${active.type === "channel" && active.id === ch.id ? "is-active" : ""}`}
            onClick={() => onSelect({ type: "channel", id: ch.id })}
          >
            <div className="cw-circle">#</div>
            <div>
              <strong>{ch.name}</strong>
              <div className="cw-muted">{ch.desc}</div>
            </div>
          </button>
        ))}

        <div className="cw-list-section">Direct messages</div>
        {filteredDM.map(dm => (
          <button
            key={dm.id}
            className={`cw-list-item ${active.type === "dm" && active.id === dm.id ? "is-active" : ""}`}
            onClick={() => onSelect({ type: "dm", id: dm.id })}
          >
            <div className="cw-circle cw-circle--mint">{dm.name.slice(0,2).toUpperCase()}</div>
            <div>
              <strong>{dm.name}</strong>
              <div className="cw-muted">{dm.status}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
