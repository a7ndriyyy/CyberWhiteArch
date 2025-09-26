// srcApp/pages/InSystem/Profile/ProfilePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./ProfilePage.css";
import Shell from "../../../componentsApp/Profile/Shell";
import Header from "../../../componentsApp/Profile/Header";
import SidebarAbout from "../../../componentsApp/Profile/SidebarAbout";
import TabsBar from "../../../componentsApp/Profile/TabsBar";
import GalleryGrid from "../../../componentsApp/Profile/GalleryGrid";
import PostCard from "../../../componentsApp/Profile/PostCard";
import EditProfile from "../../../componentsApp/Profile/EditProfile";

export default function ProfilePage() {
  /* theme same as before ... */  // (keep your theme code)

  const userId = localStorage.getItem("userId");
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState(false);

  const isMe = true; // this /app/profile is always "me"

  useEffect(() => {
    if (!userId) { setErr("No session found"); setLoading(false); return; }
    setLoading(true);
    fetch(`http://localhost:5000/users/${userId}`)
      .then(async r => { if(!r.ok) throw new Error((await r.json())?.msg || "Failed"); return r.json(); })
      .then(setRaw)
      .catch(e => setErr(e.message))
      .finally(()=>setLoading(false));
  }, [userId]);

  const ui = useMemo(() => {
    if (!raw) return null;
    const username = raw.username || "user";
    const initials = (raw.displayName || username).slice(0,2).toUpperCase();

    const user = {
      initials,
      name: raw.displayName || username,
      title: raw.title || "",
      tags: raw.tags?.length ? raw.tags : [`@${username}`],
      stats: {
        posts: raw.posts?.length || 0,
        followers: raw.followers || 0,
        following: raw.following || 0,
      },
      reputation: "Top 5% Reputation",
    };

    return {
      user,
      about: raw.bio || "",
      highlights: raw.highlights || [],
      skills: raw.skills || [],
      gallery: raw.gallery || [],
      posts: raw.posts || [],
      raw, // pass-through if editor needs it
    };
  }, [raw]);

  if (loading) return <div style={{ padding:16 }}>Loading profile…</div>;
  if (err) return <div style={{ padding:16, color:"#f66" }}>Error: {err}</div>;
  if (!ui) return null;

  const onSaved = (updated) => {
    // updated contains merged doc as returned by PATCH route
    setRaw(prev => ({ ...prev, ...updated }));
  };

  return (
    <div className="cw-profile-page">
      <Shell />

      {/* Cover */}
      <section className="cw-cover cw-card">
        <div className="cw-cover__banner" style={{
          backgroundImage: ui.raw.bannerUrl ? `url(${ui.raw.bannerUrl})` : undefined
        }}/>
        <div className="cw-cover__footer">
          <Header user={ui.user} isMe={isMe} onEdit={() => setEditing(true)} />
        </div>
      </section>

      <div className="cw-profile-body">
        <aside className="cw-about cw-card">
          <SidebarAbout
            about={ui.about || (isMe ? "Add a bio…" : "")}
            highlights={ui.highlights}
            skills={ui.skills}
          />
        </aside>

        <main className="cw-profile-main">
          <div className="cw-tabsbar cw-card">
            <TabsBar tabs={["Posts","Connections","Activity","About"]} active="Posts" />
          </div>

          {/* Gallery (hide if empty for new user) */}
          {ui.gallery.length > 0 && (
            <section className="cw-gallery cw-card">
              <GalleryGrid items={ui.gallery} />
            </section>
          )}

          {/* Posts (clean for new user) */}
          {ui.posts.length === 0 ? (
            <div className="cw-card" style={{ padding:16, color:"var(--muted)" }}>
              {isMe ? "No posts yet. Share your first update!" : "No posts yet."}
            </div>
          ) : (
            ui.posts.map(p => (
              <article key={p.id} className="cw-post-card cw-card">
                <PostCard {...p} />
              </article>
            ))
          )}
        </main>
      </div>

      <EditProfile
        open={editing}
        initial={{
          displayName: ui.user.name,
          title: ui.user.title,
          bio: ui.about,
          tags: ui.user.tags,
          highlights: ui.highlights,
          skills: ui.skills,
          bannerUrl: ui.raw.bannerUrl,
          avatarUrl: ui.raw.avatarUrl,
          username: raw.username
        }}
        onClose={() => setEditing(false)}
        onSaved={onSaved}
      />
    </div>
  );
}
