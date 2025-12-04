import React, { useState } from "react";

export function FriendsFindTab({ myUsername, DM_API, onSent }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const search = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${DM_API}/users/search?q=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("find friend error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="friends-body">
      <div className="friends-find-row">
        <input
          className="friends-input"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button className="friends-btn" type="button" onClick={search}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {results.length === 0 ? (
        <div className="friends-empty">No results yet.</div>
      ) : (
        <ul className="friends-list">
          {results.map((u) => (
            <li key={u.username} className="friends-item">
              <div className="friends-avatar">
                {(u.initials || u.username.slice(0, 2)).toUpperCase()}
              </div>
              <div className="friends-main">
                <div className="friends-name">
                  {u.displayName || u.username}
                </div>
                <div className="friends-username">@{u.username}</div>
              </div>
              <div className="friends-actions">
                <button
                  className="friends-btn"
                  type="button"
                  onClick={async () => {
                    if (!myUsername) return;
                    try {
                      const res = await fetch(`${DM_API}/friends/request`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          fromUser: myUsername,
                          toUser: u.username,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        console.error("invite error", data);
                        alert(
                          data?.detail || data?.msg || "Failed to send invite"
                        );
                        return;
                      }
                      alert("Invite sent!");
                      onSent?.(u.username);
                    } catch (err) {
                      console.error("invite error", err);
                    }
                  }}
                >
                  Invite
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
