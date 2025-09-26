import React, { useEffect, useMemo, useState } from "react";
import "./ProfilePage.css";

import Shell from "../../../componentsApp/Profile/Shell";
import Header from "../../../componentsApp/Profile/Header";
import SidebarAbout from "../../../componentsApp/Profile/SidebarAbout";
import TabsBar from "../../../componentsApp/Profile/TabsBar";
import GalleryGrid from "../../../componentsApp/Profile/GalleryGrid";
import PostCard from "../../../componentsApp/Profile/PostCard";

export default function ProfilePage() {
  /* ---------------- Theme (keep your behavior) ---------------- */
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

  /* ---------------- Data (fetch me) ---------------- */
  const userId = localStorage.getItem("userId");
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!userId) {
      setErr("No session found");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:5000/users/${userId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json())?.msg || "Failed to load user");
        return r.json();
      })
      .then(setRaw)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  /* ---------------- Map to UI props your components need ---------------- */
  const ui = useMemo(() => {
    if (!raw) return null;

    const username = raw.username || "user";
    const initials = username.slice(0, 2).toUpperCase();

    // Header props
    const user = {
      initials,
      name: username,                       // you can add displayName later
      title: "Security Researcher",         // placeholder until you store it
      tags: ["E2E Advocate", `@${username}`],
      stats: {
        posts: raw.postsCount || 0,
        followers: raw.followers || 0,
        following: raw.following || 0,
      },
      reputation: "Top 5% Reputation",      // placeholder
    };

    // Sidebar
    const about =
      raw.bio ||
      "Privacy-first builder. Threat modeling enjoyer. Open source over everything.";
    const highlights = raw.highlights || ["E2E", "CSP", "Bug Bounty Top 1%", "Open Source Maintainer"];
    const skills =
      raw.skills || ["Web Exploitation", "Reverse Engineering", "Threat Modeling", "Privacy Engineering"];

    // Gallery + Posts (empty until you store them)
    const gallery = raw.gallery || Array.from({ length: 6 }, (_, i) => ({ id: i, label: "IMG" }));
    const posts = raw.posts || [
      {
        id: "demo1",
        author: { initials, name: username },
        meta: "Posted · #bugbounty",
        text:
          "Landed a critical IDOR on a popular SaaS. Write-up soon (sanitized). Stay safe, ship fast.",
        media: [{ label: "PoC" }, { label: "Graph" }],
        actions: { likes: "1.2k", comments: 28 },
      },
    ];

    return { user, about, highlights, skills, gallery, posts };
  }, [raw]);

  /* ---------------- States ---------------- */
  if (loading) return <div style={{ padding: 16 }}>Loading profile…</div>;
  if (err) return <div style={{ padding: 16, color: "#f66" }}>Error: {err}</div>;
  if (!ui) return null;

  /* ---------------- View ---------------- */
  return (
    <div className="cw-profile-page">
      <Shell />

      {/* Cover with gradient banner */}
      <section className="cw-cover cw-card">
        <div className="cw-cover__banner" />
        <div className="cw-cover__footer">
          <Header user={ui.user} />
        </div>
      </section>

      <div className="cw-profile-body">
        <aside className="cw-about cw-card">
          <SidebarAbout about={ui.about} highlights={ui.highlights} skills={ui.skills} />
        </aside>

        <main className="cw-profile-main">
          <div className="cw-tabsbar cw-card">
            <TabsBar tabs={["Posts", "Connections", "Activity", "About"]} active="Posts" />
          </div>

          <section className="cw-gallery cw-card">
            <GalleryGrid items={ui.gallery} />
          </section>

          {ui.posts.map((p) => (
            <article key={p.id} className="cw-post-card cw-card">
              <PostCard
                author={p.author}
                meta={p.meta}
                text={p.text}
                media={p.media}
                actions={p.actions}
              />
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}
