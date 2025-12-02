import React, { useEffect, useState } from "react";
import "./DMPage.css";
import DmHeader from "../../../componentsApp/DM/DmHeader.jsx";
import DmList from "../../../componentsApp/DM/DmList.jsx";
import DmComposer from "../../../componentsApp/DM/DmComposer.jsx";
import DmChatPanel from "../../../componentsApp/DM/DmChatPanel.jsx";

export default function DMPage() {
  // ----- theme -----
  const [theme, setTheme] = useState("dark");
  const myUserId = localStorage.getItem("cwh-userId");     // adjust key if different
  // const myUsername = localStorage.getItem("cwh-username"); // optional, not required

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
  const [chats, setChats] = useState([]);      // sidebar chats from backend
  const [messages, setMessages] = useState([]); // messages for active chat

  // ----- UI state -----
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelQuery, setPanelQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState(null);

  const [verified, setVerified] = useState(true);
  const [guard, setGuard] = useState(true);
  const [vanish, setVanish] = useState({ on: false, endsAt: null });
  const [vanishText, setVanishText] = useState("Off");

  // vanish countdown text
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

  // toggle vanish mode (1 hour)
  const onToggleVanish = () => {
    setVanish((prev) =>
      prev.on
        ? { on: false, endsAt: null }
        : { on: true, endsAt: Date.now() + 60 * 60 * 1000 }
    );
  };

  // ----- load conversations -----
  useEffect(() => {
    if (!myUserId) return;

    const loadConversations = async () => {
      try {
        const res = await fetch(`http://localhost:5000/dm/conversations/${myUserId}`);
        const data = await res.json();

        const uiChats = (data.conversations || []).map((c) => ({
          id: c.otherUserId,
          initials: c.initials,
          name: c.displayName,
          last: c.lastText,
          time: new Date(c.lastAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
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
  }, [myUserId, activeChatId]);

  // ----- load messages for active chat -----
  useEffect(() => {
    if (!myUserId || !activeChatId) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/dm/messages?user1=${myUserId}&user2=${activeChatId}`
        );
        const data = await res.json();
        const other = chats.find((c) => c.id === activeChatId);

        const uiMessages = (data.messages || []).map((m) => {
          const mine = m.fromUserId === myUserId;
          const ts = Date.parse(m.createdAt);

          return {
            id: m.id,
            ts,
            from: mine ? "ME" : (other?.initials || "U"),
            author: mine ? "You" : (other?.name || m.fromUserId),
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

        setMessages(uiMessages);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    loadMessages();
  }, [myUserId, activeChatId, chats]);

  // ----- send message -----
  const sendMessage = async (payload) => {
    if (!myUserId || !activeChatId) return;

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
      fromUserId: myUserId,
      toUserId: activeChatId,
      text: text.trim(),
      code,
      // attachments: later when you handle upload
    };

    try {
      const res = await fetch("http://localhost:5000/dm/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Send failed:", data);
        return;
      }

      const m = data.message;
      const ts = Date.parse(m.createdAt) || Date.now();

      const next = {
        id: m.id,
        ts,
        from: "ME",
        author: "You",
        time: new Date(ts).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: m.text,
        attachments,
        code: m.code || null,
        mine: true,
      };

      setMessages((prev) => [...prev, next]);
    } catch (err) {
      console.error("Send error", err);
    }
  };

  // handy refs for header
  const activeChat =
    chats.find((c) => c.id === activeChatId) || { name: "Chat", initials: "U" };

  return (
    <div className={`dm-layout ${panelOpen ? "is-panel-open" : ""}`}>
      <DmChatPanel
        open={panelOpen}
        query={panelQuery}
        setQuery={setPanelQuery}
        chats={chats}
        activeId={activeChatId}
        onSelect={(id) => {
          setActiveChatId(id); // messages will be loaded by useEffect
        }}
      />

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
          onTogglePanel={() => setPanelOpen((v) => !v)}
        />

        <div className="dm-body cw-card">
          <DmList messages={messages} />
          <DmComposer
            vanishOn={vanish.on}
            vanishText={vanishText}
            onSend={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
