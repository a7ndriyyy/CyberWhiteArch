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
  const [activeTab, setActiveTab] = useState("Posts");
  const [newPost, setNewPost] = useState("");

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
      <div
    className="cw-cover__banner"
    style={{
      backgroundImage: ui.raw.bannerUrl ? `url(${ui.raw.bannerUrl})` : undefined
    }}
  />
  <div className="cw-cover__footer">
    <Header user={ui.user} isMe={isMe} />
    {isMe && (
      <div className="cw-cover__edit">
        <a className="cw-chip" href="/app/profile/edit#banner">Change banner</a>
      </div>
    )}
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
  <TabsBar
    tabs={["Posts", "Connections", "Activity", "About"]}
    active={activeTab}
    onChange={setActiveTab}
  />
</div>

          {/* Gallery (hide if empty for new user) */}
          {ui.gallery.length > 0 && (
            <section className="cw-gallery cw-card">
              <GalleryGrid items={ui.gallery} />
            </section>
          )}

          {/* Posts (clean for new user) */}
          {activeTab === "Posts" && (
  <>
    {isMe && (
      <div className="cw-card" style={{ padding:12, display:"grid", gap:8 }}>
        <textarea
          className="cw-postbox-input"
          placeholder="Share something…"
          value={newPost}
          onChange={(e)=>setNewPost(e.target.value)}
          rows={3}
        />
        <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
          <button className="cw-chip" onClick={()=>setNewPost("")}>Clear</button>
          <button
            className="cw-btn-post"
            onClick={async ()=>{
              const text = newPost.trim();
              if(!text) return;
              const r = await fetch(`http://localhost:5000/users/${userId}/posts`, {
                method:"POST",
                headers: { "Content-Type":"application/json" },
                body: JSON.stringify({ text })
              });
              if (!r.ok) { alert("Failed to post"); return; }
              const updated = await r.json();
              setRaw(prev => ({ ...prev, ...updated }));
              setNewPost("");
              setActiveTab("Posts");
            }}
          >Post</button>
        </div>
      </div>
    )}

    {/* posts list */}
    { (ui.posts.length === 0 && !isMe) && (
      <div className="cw-card" style={{ padding:16, color:"var(--muted)" }}>
        No posts yet.
      </div>
    )}
    {ui.posts.length === 0 && isMe && (
      <div className="cw-card" style={{ padding:16, color:"var(--muted)" }}>
        No posts yet. Share your first update!
      </div>
    )}
    {ui.posts.map(p => (
      <article key={p.id} className="cw-post-card cw-card">
        <PostCard
          author={{ initials: ui.user.initials, name: ui.user.name }}
          meta={new Date(p.createdAt).toLocaleString()}
          text={p.text}
          media={p.media?.map(m => ({ label: m.url || "media" }))}
          actions={{ likes: p.likes || 0, comments: p.comments || 0 }}
        />
      </article>
    ))}
  </>
)}

{activeTab === "Connections" && (
  <div className="cw-card" style={{ padding:16 }}>
    <strong>Connections</strong>
    <p className="cw-muted">Coming soon. Show followers & following lists.</p>
  </div>
)}

{activeTab === "Activity" && (
  <div className="cw-card" style={{ padding:16 }}>
    <strong>Activity</strong>
    <p className="cw-muted">Recent posts, comments, and reactions will appear here.</p>
  </div>
)}

{activeTab === "About" && (
  <div className="cw-card" style={{ padding:16 }}>
    <strong>About</strong>
    <p className="cw-bio">{ui.about || "No bio yet."}</p>
    {!!ui.highlights.length && (
      <div className="cw-highlights" style={{ marginTop:10 }}>
        {ui.highlights.map(h => <span key={h} className="cw-chip">{h}</span>)}
      </div>
    )}
    {!!ui.skills.length && (
      <div className="cw-skills" style={{ marginTop:10 }}>
        {ui.skills.map(s => <span key={s} className="cw-chip">{s}</span>)}
      </div>
    )}
  </div>
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
