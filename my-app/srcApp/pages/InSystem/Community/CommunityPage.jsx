import React, { useEffect, useState } from "react";
import "./CommunityPage.css";

import LeftRail from "../../../componentsApp/Community/LeftRail";
import SidebarList from "../../../componentsApp/Community/SidebarList";
import ChatPane from "../../../componentsApp/Community/ChatPane";
import ThreadPane from "../../../componentsApp/Community/ThreadPane";

export default function CommunityPage() {
  // keep theme behavior consistent
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

  // demo data
  const channels = [
    { id: "general", name: "general", desc: "Chat about anything" },
    { id: "security", name: "security", desc: "CVEs, patches, advisories" },
    { id: "design", name: "design", desc: "UX · UI · motion" },
  ];
  const dms = [
    { id: "al", name: "Aria Labs", status: "typing…" },
    { id: "tg", name: "Threat Guild", status: "last seen 2h" },
  ];

  const [active, setActive] = useState({ type: "channel", id: "general" });
  const [query, setQuery] = useState("");

  return (
    <div className="cw-comm">
      <LeftRail
        items={["CW", "PR", "DS", "TL", "DM"]}
        activeIndex={0}
      />

      <SidebarList
        query={query}
        setQuery={setQuery}
        channels={channels}
        dms={dms}
        active={active}
        onSelect={setActive}
      />

      <ChatPane
        active={active}
        title={active.type === "channel" ? `# ${active.id}` : dms.find(d => d.id === active.id)?.name}
      />

      <ThreadPane />
    </div>
  );
}
