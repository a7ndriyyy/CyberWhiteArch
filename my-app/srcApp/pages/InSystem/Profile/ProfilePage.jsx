import React, { useEffect, useState } from "react";
import "./ProfilePage.css";

import Shell from "../../../componentsApp/Profile/Shell";
import Header from "../../../componentsApp/Profile/Header";
import SidebarAbout from "../../../componentsApp/Profile/SidebarAbout";
import TabsBar from "../../../componentsApp/Profile/TabsBar";
import GalleryGrid from "../../../componentsApp/Profile/GalleryGrid";
import PostCard from "../../../componentsApp/Profile/PostCard";


export default function ProfilePage() {
  // keep the same theme behavior as your CoverPage
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

  // demo data – easy to replace with API later
  const user = {
    initials: "AN",
    name: "Anonymous",
    title: "Security Researcher",
    tags: ["E2E Advocate", "@cyberwhitehat"],
    stats: { posts: 24, followers: 1204, following: 180 },
    reputation: "Top 5% Reputation",
  };

  const about = `Privacy-first builder. Threat modeling enjoyer. Open source over everything. Hiring for red/blue/purple.`;
  const highlights = ["E2E", "CSP", "Bug Bounty Top 1%", "Open Source Maintainer"];
  const skills = ["Web Exploitation", "Reverse Engineering", "Threat Modeling", "Privacy Engineering", "Rust · Go · TS"];

  const gallery = Array.from({ length: 6 }, (_, i) => ({ id: i, label: "IMG" }));

  return (
    <div className="cw-profile-page">
      <Shell />

       {/* Cover with gradient banner */}
    <section className="cw-cover cw-card">
      <div className="cw-cover__banner" />
      <div className="cw-cover__footer">
        <Header user={user} />
      </div>
    </section>

      {/* <section className="cw-profile-header cw-card">
        <Header user={user} />
      </section> */}

      <div className="cw-profile-body">
        <aside className="cw-about cw-card">
          <SidebarAbout about={about} highlights={highlights} skills={skills} />
        </aside>

        <main className="cw-profile-main">
          <div className="cw-tabsbar cw-card">
            <TabsBar tabs={["Posts", "Connections", "Activity", "About"]} active="Posts" />
          </div>

          <section className="cw-gallery cw-card">
            <GalleryGrid items={gallery} />
          </section>

          <article className="cw-post-card cw-card">
            <PostCard
              author={{ initials: "AN", name: "Anonymous" }}
              meta="Posted · #bugbounty"
              text="Landed a critical IDOR on a popular SaaS. Write-up soon (sanitized). Stay safe, ship fast."
              media={[{ label: "PoC" }, { label: "Graph" }]}
              actions={{ likes: "1.2k", comments: 28 }}
            />
          </article>
        </main>
      </div>
    </div>
  );
}
