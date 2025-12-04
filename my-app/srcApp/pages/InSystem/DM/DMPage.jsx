import React, { useEffect, useState } from "react";

import "./DMPage.css";
import DmHeader from "../../../componentsApp/DM/DmHeader.jsx";
import DmList from "../../../componentsApp/DM/DmList.jsx";
import DmComposer from "../../../componentsApp/DM/DmComposer.jsx";
import DmChatPanel from "../../../componentsApp/DM/DmChatPanel.jsx";
import FriendsFindTab from "../../../componentsApp/DM/FriendsFindTab.jsx";

const DM_API = import.meta.env.VITE_DM_API || "http://100.107.245.15:8001";

export default function DMPage() {
  // ----- theme -----
  const [theme, setTheme] = useState("dark");

  // ---- layout toggles ----
  const [railOpen, setRailOpen] = useState(false); // profile/friends rail
  const [panelOpen, setPanelOpen] = useState(true); // chats column

  // grid layout (3 columns: rail | chats | main)
  const gridTemplateColumns = (() => {
    // rail + chats + main
    if (railOpen && panelOpen) return "200px 280px 1fr";
    // rail + main
    if (railOpen && !panelOpen) return "200px 0 1fr";
    // chats + main (default)
    if (!railOpen && panelOpen) return "0 280px 1fr";
    // only main
    return "0 0 1fr";
  })();

  const myUsername = localStorage.getItem("username"); // username, not id

  // theme init
  useEffect(() => {
    const saved = localStorage.getItem("cwh-theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // theme toggle button
  useEffect(() => {
    const btn = document.getElementById("themeToggle");
    const toggle = () => {
      const next = theme === "dark" ? "light" : "dark";
      setTheme(next);
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("cwh-theme", next);
    };
    btn?.addEventListener("click", toggle);
    return () => btn?.removeEventListener("click", toggle);
  }, [theme]);

  // ----- DM data -----
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  // quick invite modal (from + Add friend)
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const [addingFriend, setAddingFriend] = useState(false);

  // full friends window (overlay)
  const [friends, setFriends] = useState([]);
  const [friendsWindowOpen, setFriendsWindowOpen] = useState(false);
  const [friendsTab, setFriendsTab] = useState("friends"); // "friends" | "requests" | "find"

  const [typingFrom, setTypingFrom] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  // ----- UI state -----
  const [panelQuery, setPanelQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState(null); // friend's username

  const [verified, setVerified] = useState(true);
  const [guard, setGuard] = useState(true);
  const [vanish, setVanish] = useState({ on: false, endsAt: null });
  const [vanishText, setVanishText] = useState("Off");

  // ----- friend requests polling -----
  useEffect(() => {
    if (!myUsername) return;

    const fetchRequests = async () => {
      try {
        const res = await fetch(
          `${DM_API}/friends/requests/${encodeURIComponent(myUsername)}`
        );
        const data = await res.json();
        setIncomingRequests(data.incoming || []);
        setOutgoingRequests(data.outgoing || []);
      } catch (err) {
        console.error("friend requests error", err);
      }
    };

    fetchRequests();
    const id = setInterval(fetchRequests, 3000); // every 3s
    return () => clearInterval(id);
  }, [myUsername]);

  // ----- friends list polling -----
  useEffect(() => {
    if (!myUsername) return;

    const loadFriends = async () => {
      try {
        const res = await fetch(
          `${DM_API}/users/${encodeURIComponent(myUsername)}/friends`
        );
        const data = await res.json();
        setFriends(data.friends || []);
      } catch (err) {
        console.error("friends load error", err);
      }
    };

    loadFriends();
    const id = setInterval(loadFriends, 10000);
    return () => clearInterval(id);
  }, [myUsername]);

  // ----- vanish countdown -----
  useEffect(() => {
    if (!vanish.on || !vanish.endsAt) {
      setVanishText("Off");
      return;
    }
    const tick = () => {
      const left = Math.max(0, vanish.endsAt - Date.now());
      const h = Math.floor(left / 3600000);
      const m = Math.floor((left % 3600000) / 60000);
      const s = Math.floor((left % 60000) / 1000);
      setVanishText(`${h ? `${h}h ` : ""}${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [vanish]);

  const onToggleVanish = () => {
    setVanish((prev) =>
      prev.on
        ? { on: false, endsAt: null }
        : { on: true, endsAt: Date.now() + 60 * 60 * 1000 }
    );
  };

  // ----- load conversations (poll) -----
  useEffect(() => {
    if (!myUsername) return;

    const loadConversations = async () => {
      try {
        const res = await fetch(`${DM_API}/dm/conversations/${myUsername}`);
        const data = await res.json();

        const uiChats = (data.conversations || []).map((c) => ({
          id: c.otherUserId, // username
          initials: c.initials,
          name: c.displayName,
          last: c.lastText,
          time: c.lastAt
            ? new Date(c.lastAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          unread: 0,
        }));

        setChats(uiChats);

        if (!activeChatId && uiChats.length > 0) {
          setActiveChatId(uiChats[0].id);
        }
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };

    loadConversations();
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, [myUsername, activeChatId]);

  // ----- poll messages + typing for active chat -----
  useEffect(() => {
    if (!myUsername || !activeChatId) return;

    let stopped = false;

    const fetchAll = async () => {
      try {
        const [msgRes, typingRes] = await Promise.all([
          fetch(
            `${DM_API}/dm/messages?user1=${encodeURIComponent(
              myUsername
            )}&user2=${encodeURIComponent(activeChatId)}`
          ),
          fetch(
            `${DM_API}/dm/typing-status?user1=${encodeURIComponent(
              myUsername
            )}&user2=${encodeURIComponent(activeChatId)}`
          ),
        ]);

        const msgData = await msgRes.json();
        const typingData = await typingRes.json();
        const other = chats.find((c) => c.id === activeChatId);

        const uiMessages = (msgData.messages || []).map((m) => {
          const mine = m.fromUserId === myUsername;
          const ts = Date.parse(m.createdAt);

          return {
            id: m._id || m.id,
            ts,
            from: mine ? "ME" : other?.initials || "YOU",
            author: mine ? "You" : other?.name || m.fromUserId,
            time: new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            text: m.text,
            mine,
            attachments: m.attachments || [],
            code: m.code || null,
          };
        });

        if (!stopped) {
          setMessages(uiMessages);
          setTypingFrom(typingData.typing ? typingData.fromUser : null);
        }
      } catch (err) {
        console.error("Failed to load messages / typing", err);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 1000); // 1s polling
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [myUsername, activeChatId, chats]);

  // ----- send message -----
  const sendMessage = async (payload) => {
    if (!myUsername || !activeChatId) return;

    let text = "";
    let attachments = [];
    let code = null;

    if (typeof payload === "string") {
      text = payload;
    } else if (payload && typeof payload === "object") {
      text = payload.text || "";
      attachments = payload.attachments || [];
      code = payload.code || null;
    }

    if (!text.trim() && !code && attachments.length === 0) return;

    const body = {
      fromUserId: myUsername,
      toUserId: activeChatId,
      text: text.trim(),
      code,
    };

    try {
      const res = await fetch(`${DM_API}/dm/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Send failed:", data);
      }
      // poller will refresh messages
    } catch (err) {
      console.error("Send error", err);
    }
  };

  // ----- quick "Add friend" modal -> send invite -----
  const onAddFriend = async () => {
    const username = friendUsername.trim();
    if (!username || !myUsername) return;

    setAddingFriend(true);
    try {
      const res = await fetch(`${DM_API}/friends/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUser: myUsername, toUser: username }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Add friend failed:", data);
        alert(data?.detail || data?.msg || "Failed to send invite");
        return;
      }

      alert("Invite sent!");
      setFriendUsername("");
      setAddFriendOpen(false);
    } catch (err) {
      console.error("Add friend error", err);
      alert("Failed to send invite");
    } finally {
      setAddingFriend(false);
    }
  };

  // ----- typing status -----
  const handleTypingChange = async (isTyping) => {
    if (!myUsername || !activeChatId) return;
    try {
      await fetch(`${DM_API}/dm/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUser: myUsername,
          toUser: activeChatId,
          isTyping,
        }),
      });
    } catch (err) {
      console.error("typing error", err);
    }
  };

  const activeChat =
    chats.find((c) => c.id === activeChatId) || { name: "Chat", initials: "U" };

  return (
    <div className="dm-layout" style={{ gridTemplateColumns }}>
      {/* LEFT RAIL – profile / friends / settings */}
      <aside
        className="dm-rail"
        style={{ visibility: railOpen ? "visible" : "hidden" }}
      >
        <div className="dm-rail-profile">
          <div className="dm-rail-avatar">
            {(myUsername || "?").slice(0, 2).toUpperCase()}
          </div>
          <div className="dm-rail-name">{myUsername || "Guest"}</div>
          <div className="dm-rail-sub">Set status</div>
        </div>

        <nav className="dm-rail-menu">
          <button
            className="dm-rail-item"
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
          >
            <span className="dm-rail-icon">💬</span>
            <span>{panelOpen ? "Hide chats" : "Show chats"}</span>
          </button>

          <button className="dm-rail-item" type="button">
            <span className="dm-rail-icon">👤</span>
            <span>My profile</span>
          </button>

          <button
            className="dm-rail-item"
            type="button"
            onClick={() => {
              setFriendsTab("friends");
              setFriendsWindowOpen(true);
            }}
          >
            <span className="dm-rail-icon">👥</span>
            <span>Friends</span>
          </button>

          <button className="dm-rail-item" type="button">
            <span className="dm-rail-icon">🔖</span>
            <span>Saved messages</span>
          </button>

          <button className="dm-rail-item" type="button">
            <span className="dm-rail-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className="dm-rail-footer">
          <button
            id="themeToggle"
            className="dm-rail-item dm-rail-item--pill"
            type="button"
          >
            <span className="dm-rail-icon">🌙</span>
            <span>Theme</span>
          </button>
        </div>
      </aside>

      {/* CHATS COLUMN */}
      <DmChatPanel
        open={panelOpen}
        query={panelQuery}
        setQuery={setPanelQuery}
        chats={chats}
        activeId={activeChatId}
        onSelect={(id) => setActiveChatId(id)}
        onAddFriend={() => setAddFriendOpen(true)}
      />

      {/* MAIN COLUMN: header + messages + composer */}
      <div className="dm-page">
        <DmHeader
          name={activeChat.name}
          initials={activeChat.initials}
          lastSeen="just now"
          verified={verified}
          guard={guard}
          setVerified={setVerified}
          setGuard={setGuard}
          vanishOn={vanish.on}
          vanishText={vanishText}
          onToggleVanish={onToggleVanish}
          e2eKey="A1C9-7F2E-B4D1-88AA"
          panelOpen={panelOpen}
          railOpen={railOpen}
          onTogglePanel={() => setPanelOpen((v) => !v)} // show/hide chats
          onToggleRail={() => setRailOpen((v) => !v)} // show/hide rail
        />

        {(incomingRequests.length > 0 || outgoingRequests.length > 0) && (
          <div className="dm-requests-bar">
            {incomingRequests.length > 0 && (
              <span className="dm-requests-pill">
                {incomingRequests.length} incoming request
                {incomingRequests.length > 1 ? "s" : ""}
              </span>
            )}
            {outgoingRequests.length > 0 && (
              <span className="dm-requests-pill dm-requests-pill--out">
                {outgoingRequests.length} pending invite
                {outgoingRequests.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {typingFrom && (
          <div className="dm-typing-indicator">{typingFrom} is typing…</div>
        )}

        <div className="dm-body cw-card">
          <DmList messages={messages} />

          {messages.length === 0 && (
            <div className="dm-empty">
              <p>No messages yet.</p>
              <p className="dm-empty-sub">
                Use “+ Find / add friend” to start a secure chat.
              </p>
            </div>
          )}

          <DmComposer
            vanishOn={vanish.on}
            vanishText={vanishText}
            onSend={sendMessage}
            onTypingChange={handleTypingChange}
          />
        </div>
      </div>

      {/* Quick Add-friend modal (from + button in chat panel) */}
      {addFriendOpen && (
        <div className="dm-modal-backdrop">
          <div className="dm-modal">
            <h3>Add friend</h3>
            <p className="dm-modal-sub">
              Type your friend's username exactly as they use it to login.
            </p>
            <input
              className="dm-input-text"
              placeholder="username (without @)"
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
            />
            <div className="dm-modal-actions">
              <button
                className="dm-btn"
                type="button"
                onClick={() => {
                  setAddFriendOpen(false);
                  setFriendUsername("");
                }}
              >
                Cancel
              </button>
              <button
                className="dm-btn dm-btn-primary"
                type="button"
                disabled={addingFriend || !friendUsername.trim()}
                onClick={onAddFriend}
              >
                {addingFriend ? "Adding…" : "Send invite"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Friends overlay window */}
      {friendsWindowOpen && (
        <div className="friends-backdrop">
          <div className="friends-window">
            <div className="friends-header">
              <div className="friends-title">Friends</div>
              <button
                className="friends-close"
                type="button"
                onClick={() => setFriendsWindowOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="friends-tabs">
              <button
                className={`friends-tab ${
                  friendsTab === "friends" ? "is-active" : ""
                }`}
                onClick={() => setFriendsTab("friends")}
              >
                Friends
              </button>
              <button
                className={`friends-tab ${
                  friendsTab === "requests" ? "is-active" : ""
                }`}
                onClick={() => setFriendsTab("requests")}
              >
                Requests
              </button>
              <button
                className={`friends-tab ${
                  friendsTab === "find" ? "is-active" : ""
                }`}
                onClick={() => setFriendsTab("find")}
              >
                Find friend
              </button>
            </div>

            {/* TAB: FRIENDS LIST */}
            {friendsTab === "friends" && (
              <div className="friends-body">
                {friends.length === 0 ? (
                  <div className="friends-empty">You have no friends yet.</div>
                ) : (
                  <ul className="friends-list">
                    {friends.map((f) => (
                      <li key={f.username} className="friends-item">
                        <div className="friends-avatar">
                          {(f.initials || f.username.slice(0, 2)).toUpperCase()}
                        </div>
                        <div className="friends-main">
                          <div className="friends-name">
                            {f.displayName || f.username}
                          </div>
                          <div className="friends-username">@{f.username}</div>
                        </div>
                        <div className="friends-actions">
                          <button
                            className="friends-btn"
                            type="button"
                            onClick={() => {
                              setActiveChatId(f.username);
                              setFriendsWindowOpen(false);
                              setPanelOpen(true);
                            }}
                          >
                            Message
                          </button>
                          <button
                            className="friends-btn friends-btn-danger"
                            type="button"
                            onClick={async () => {
                              if (!window.confirm(`Remove ${f.username}?`))
                                return;
                              try {
                                const res = await fetch(
                                  `${DM_API}/users/${encodeURIComponent(
                                    myUsername
                                  )}/friends/${encodeURIComponent(f.username)}`,
                                  { method: "DELETE" }
                                );
                                const data = await res.json();
                                if (!res.ok) {
                                  console.error("remove friend error", data);
                                  alert(
                                    data?.detail ||
                                      data?.msg ||
                                      "Failed to remove"
                                  );
                                  return;
                                }
                                setFriends((prev) =>
                                  prev.filter(
                                    (x) => x.username !== f.username
                                  )
                                );
                              } catch (err) {
                                console.error("remove friend error", err);
                              }
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* TAB: REQUESTS */}
            {friendsTab === "requests" && (
              <div className="friends-body friends-requests">
                <div>
                  <div className="friends-section-title">Incoming</div>
                  {incomingRequests.length === 0 ? (
                    <div className="friends-empty">No incoming requests.</div>
                  ) : (
                    <ul className="friends-list">
                      {incomingRequests.map((r) => (
                        <li key={r.username} className="friends-item">
                          <div className="friends-avatar">
                            {(r.initials || r.username.slice(0, 2)).toUpperCase()}
                          </div>
                          <div className="friends-main">
                            <div className="friends-name">
                              {r.displayName || r.username}
                            </div>
                            <div className="friends-username">
                              @{r.username}
                            </div>
                          </div>
                          <div className="friends-actions">
                            <button
                              className="friends-btn"
                              type="button"
                              onClick={async () => {
                                try {
                                  const res = await fetch(
                                    `${DM_API}/friends/respond`,
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        toUser: myUsername,
                                        fromUser: r.username,
                                        accept: true,
                                      }),
                                    }
                                  );
                                  const data = await res.json();
                                  if (!res.ok) {
                                    console.error("accept error", data);
                                    alert(
                                      data?.detail ||
                                        data?.msg ||
                                        "Accept failed"
                                    );
                                    return;
                                  }
                                  setIncomingRequests((prev) =>
                                    prev.filter(
                                      (x) => x.username !== r.username
                                    )
                                  );
                                  setFriends((prev) => [
                                    ...prev,
                                    {
                                      username: r.username,
                                      displayName: r.displayName,
                                      initials: r.initials,
                                    },
                                  ]);
                                } catch (err) {
                                  console.error("accept error", err);
                                }
                              }}
                            >
                              Accept
                            </button>
                            <button
                              className="friends-btn friends-btn-danger"
                              type="button"
                              onClick={async () => {
                                try {
                                  const res = await fetch(
                                    `${DM_API}/friends/respond`,
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        toUser: myUsername,
                                        fromUser: r.username,
                                        accept: false,
                                      }),
                                    }
                                  );
                                  const data = await res.json();
                                  if (!res.ok) {
                                    console.error("decline error", data);
                                    alert(
                                      data?.detail ||
                                        data?.msg ||
                                        "Decline failed"
                                    );
                                    return;
                                  }
                                  setIncomingRequests((prev) =>
                                    prev.filter(
                                      (x) => x.username !== r.username
                                    )
                                  );
                                } catch (err) {
                                  console.error("decline error", err);
                                }
                              }}
                            >
                              Decline
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <div className="friends-section-title">Outgoing</div>
                  {outgoingRequests.length === 0 ? (
                    <div className="friends-empty">No pending invites.</div>
                  ) : (
                    <ul className="friends-list">
                      {outgoingRequests.map((r) => (
                        <li key={r.username} className="friends-item">
                          <div className="friends-avatar">
                            {(r.initials || r.username.slice(0, 2)).toUpperCase()}
                          </div>
                          <div className="friends-main">
                            <div className="friends-name">
                              {r.displayName || r.username}
                            </div>
                            <div className="friends-username">
                              Invite pending @ {r.username}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* TAB: FIND FRIEND */}
            {friendsTab === "find" && (
              <FriendsFindTab
                myUsername={myUsername}
                DM_API={DM_API}
                onSent={() => {
                  setFriendsTab("requests");
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
