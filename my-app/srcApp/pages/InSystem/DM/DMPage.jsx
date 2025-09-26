import React, { useEffect, useState } from "react";
import "./DMPage.css"; // rename to "./DM.css" if that's your file name
import DmHeader from "../../../componentsApp/DM/DmHeader.jsx";
import DmList from "../../../componentsApp/DM/DmList.jsx";
import DmComposer from "../../../componentsApp/DM/DmComposer.jsx";
import DmChatPanel from "../../../componentsApp/DM/DmChatPanel.jsx";

export default function DMPage() {
  // ----- theme -----
  const [theme, setTheme] = useState("dark");
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

  // ----- data -----
  
  const initialMessages = [
    { id: 1,ts: Date.now() - 1000 * 60 * 60 * 2, from: "AL", author: "Aria Labs", time: "09:20",
      text: "Hey — invite is live. DM here for the disclosure checklist.",
      reactions: { thumbs: 2, ack: 1 } },
    { id: 2, ts: Date.now() - 1000 * 60 * 60 * 2 + 60_000, from: "ME", author: "You", time: "09:21",
      text: "Great. Also enabling vanish for 1h to discuss the PoC details.", mine: true },
  ];
  const [messages, setMessages] = useState(initialMessages);

  const chats = [
    { id:"al", initials:"AL", name:"Aria Labs",       last:"Invite is live. DM here…", time:"09:20", unread:0 },
    { id:"an", initials:"AN", name:"Anonymous",       last:"Vanish for 1h?",           time:"09:21", unread:2, mint:true },
    { id:"tg", initials:"TG", name:"Threat Guild",    last:"IOC list updated",        time:"07:03", unread:0 },
    { id:"re", initials:"RE", name:"Research Exchange", last:"Paper draft",           time:"Mon",   unread:3 },
  ];

  const messagesByChat = {
    al: initialMessages,
    an: [{ id: 901,ts: Date.now() - 1000 * 60 * 30, from:"AN", author:"Anonymous", time:"09:19", text:"Ping when free." }],
    tg: [{ id: 902,ts: Date.now() - 1000 * 60 * 30, from:"TG", author:"Threat Guild", time:"07:03", text:"IOC list updated." }],
    re: [{ id: 903,ts: Date.now() - 1000 * 60 * 30, from:"RE", author:"Research Exchange", time:"Mon", text:"Draft is ready." }],
  };

  // ----- UI state -----
  const [panelOpen, setPanelOpen] = useState(true); // <— boolean!
  const [panelQuery, setPanelQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState("al");

  const [verified, setVerified] = useState(true);
  const [guard, setGuard] = useState(true);
  const [vanish, setVanish] = useState({ on: false, endsAt: null });
  const [vanishText, setVanishText] = useState("Off");

  useEffect(() => {
    if (!vanish.on || !vanish.endsAt) { setVanishText("Off"); return; }
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
    setVanish(vanish.on
      ? { on: false, endsAt: null }
      : { on: true, endsAt: Date.now() + 60 * 60 * 1000 });
  };



const sendMessage = (payload) => {
   // підтримка і старого рядкового виклику, і нового об’єкта
   let text = "", attachments = [], code = null;
   if (typeof payload === "string") {
     text = payload;
   } else if (payload && typeof payload === "object") {
     text = payload.text || "";
     attachments = payload.attachments || [];
     code = payload.code || null;
 }
    const next = {
      id: Date.now(),
      ts: Date.now(),
      from: "ME",
      author: "You",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text,
      attachments,
      code,
      mine: true
    };
    setMessages((m) => [...m, next]);
  };

  // handy refs for header
  const activeChat = chats.find(c => c.id === activeChatId) || { name: "Chat", initials: "U" };

  return (
    <div className={`dm-layout ${panelOpen ? "is-panel-open" : ""}`}>

      <DmChatPanel
        open={panelOpen}
        query={panelQuery}
        setQuery={setPanelQuery}
        chats={chats}
        activeId={activeChatId}
        onSelect={(id) => {
          setActiveChatId(id);
          setMessages(messagesByChat[id] || []);
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
          onTogglePanel={() => setPanelOpen(v => !v)}
        />

        <div className="dm-body cw-card">
          <DmList messages={messages} />
          <DmComposer vanishOn={vanish.on} vanishText={vanishText} onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}
