import React, { useMemo } from "react";

export default function DmChatPanel({
  open,
  query,
  setQuery,
  chats = [],
  activeId,
  onSelect,
  onAddFriend,
}) {
  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      chats.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.last || "").toLowerCase().includes(q)
      ),
    [chats, q]
  );

  return (
    <aside className={`dm-panel cw-card ${open ? "is-open" : ""}`}>
      {/* search */}
      <div className="dm-panel-search">
        <svg
          viewBox="0 0 24 24"
          className="cw-icon"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users or chats"
        />
      </div>

      {/* chat list */}
      <div className="dm-panel-list scroller">
        {filtered.map((c) => (
          <button
            key={c.id}
            className={`dm-panel-item ${
              activeId === c.id ? "is-active" : ""
            }`}
            onClick={() => onSelect(c.id)}
            title={c.name}
          >
            <div className={`dm-avatar ${c.mint ? "dm-me" : ""}`}>
              {c.initials}
            </div>
            <div className="dm-item-main">
              <div className="dm-item-top">
                <strong className="dm-ellipsis">{c.name}</strong>
                <span className="dm-muted">{c.time}</span>
              </div>
              <div className="dm-ellipsis dm-muted">{c.last}</div>
            </div>
            {c.unread ? <span className="dm-unread">{c.unread}</span> : null}
          </button>
        ))}
      </div>

      {/* footer row with add-friend button */}
      <div className="dm-panel-footer">
        <button
          className="dm-addfriend-btn dm-addfriend-btn--full"
          type="button"
          onClick={onAddFriend}
        >
          + Find / add friend
        </button>
      </div>
    </aside>
  );
}
