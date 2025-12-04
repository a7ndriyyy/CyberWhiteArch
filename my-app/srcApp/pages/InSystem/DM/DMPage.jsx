import React, { useEffect, useState } from "react";  

import "./DMPage.css";
import DmHeader from "../../../componentsApp/DM/DmHeader.jsx";
import DmList from "../../../componentsApp/DM/DmList.jsx";
import DmComposer from "../../../componentsApp/DM/DmComposer.jsx";
import DmChatPanel from "../../../componentsApp/DM/DmChatPanel.jsx";

const DM_API = import.meta.env.VITE_DM_API || "http://100.107.245.15:8001";

export default function DMPage() {
  // ----- theme -----
  const [theme, setTheme] = useState("dark");
  const myUsername = localStorage.getItem("username"); // username, not id

  useEffect(() => {
    const saved = localStorage.getItem("cwh-theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

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

  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const [addingFriend, setAddingFriend] = useState(false);


  const [typingFrom, setTypingFrom] = useState(null);

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  // ----- UI state -----
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelQuery, setPanelQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState(null); // friend's username

  const [verified, setVerified] = useState(true);
  const [guard, setGuard] = useState(true);
  const [vanish, setVanish] = useState({ on: false, endsAt: null });
  const [vanishText, setVanishText] = useState("Off");





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
    setVanish(prev =>
      prev.on
        ? { on: false, endsAt: null }
        : { on: true, endsAt: Date.now() + 60 * 60 * 1000 }
    );
  };

  // ----- load conversations (and refresh occasionally) -----
  useEffect(() => {
    if (!myUsername) return;

    const loadConversations = async () => {
      try {
        const res = await fetch(`${DM_API}/dm/conversations/${myUsername}`);
        const data = await res.json();

        const uiChats = (data.conversations || []).map(c => ({
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

    // initial load
    loadConversations();
    // optional: refresh every 10s to catch new convs
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, [myUsername, activeChatId]);

  // ----- poll messages for active chat every 2s -----
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
      const other = chats.find(c => c.id === activeChatId);

      const uiMessages = (msgData.messages || []).map(m => {
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
  const interval = setInterval(fetchAll, 100); // 1s polling
  return () => {
    stopped = true;
    clearInterval(interval);
  };
}, [myUsername, activeChatId, chats]);


  // ----- send message -----
  const sendMessage = async payload => {
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
        return;
      }

      // we don't need manual setMessages – poll will pick it up
      // but if you want instant visual echo, you can still add optimistic msg
    } catch (err) {
      console.error("Send error", err);
    }
  };

  // ----- add friend -----
  const onAddFriend = async () => {
    const username = friendUsername.trim();
    if (!username || !myUsername) return;

    setAddingFriend(true);
    try {
      const res = await fetch(
        `${DM_API}/users/${encodeURIComponent(myUsername)}/friends`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ friendUsername: username }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("Add friend failed:", data);
        alert(data?.detail || data?.msg || "Failed to add friend");
        return;
      }

      const searchRes = await fetch(
        `${DM_API}/users/search?q=${encodeURIComponent(username)}`
      );
      const searchData = await searchRes.json();
      const match = (searchData.results || []).find(
        u => u.username.toLowerCase() === username.toLowerCase()
      );
      if (!match) {
        alert("Friend added but could not load profile info.");
        return;
      }

      const friendId = match.username;

      setChats(prev => {
        if (prev.some(c => c.id === friendId)) return prev;
        const now = new Date();
        const newChat = {
          id: friendId,
          initials: match.initials,
          name: match.displayName || match.username,
          last: "Start secure chat",
          time: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: 0,
        };
        return [newChat, ...prev];
      });

      setActiveChatId(friendId);
      setAddFriendOpen(false);
      setFriendUsername("");
    } catch (err) {
      console.error("Add friend error", err);
      alert("Failed to add friend");
    } finally {
      setAddingFriend(false);
    }
  };

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
    chats.find(c => c.id === activeChatId) || { name: "Chat", initials: "U" };

  return (
    <div className={`dm-layout ${panelOpen ? "is-panel-open" : ""}`}>
      {/* LEFT COLUMN: chats list */}
      <DmChatPanel
        open={panelOpen}
        query={panelQuery}
        setQuery={setPanelQuery}
        chats={chats}
        activeId={activeChatId}
        onSelect={id => setActiveChatId(id)}
        onAddFriend={() => setAddFriendOpen(true)}
      />

      {/* RIGHT COLUMN: header + messages + composer */}
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
          onTogglePanel={() => setPanelOpen(v => !v)}
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
    <div className="dm-typing-indicator">
      {typingFrom} is typing…
    </div>
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

      {/* Add-friend modal */}
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
              onChange={e => setFriendUsername(e.target.value)}
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
                {addingFriend ? "Adding…" : "Add & open chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
