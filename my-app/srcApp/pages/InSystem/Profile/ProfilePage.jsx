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
  // ---------- theme ----------
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

  // ---------- data / state ----------
  // make sure this matches what you store in login/register
  const userId = localStorage.getItem("cwh-userId") || localStorage.getItem("userId");

  const [raw, setRaw] = useState(null);   // raw doc from backend
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Posts");
  const [newPost, setNewPost] = useState("");

  const isMe = true; // /app/profile is always "me"

  // ---------- load profile ----------
  useEffect(() => {
    if (!userId) {
      setErr("No session found (missing userId in localStorage)");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/users/${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.msg || "Failed to load profile");
        setRaw(data);
        setErr("");
      } catch (e) {
        console.error("Profile load error", e);
        setErr(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  // ---------- UI mapping ----------
  const ui = useMemo(() => {
    if (!raw) return null;

    const username = raw.username || "user";
    const displayName = raw.displayName || username;
    const initials = displayName.slice(0, 2).toUpperCase();

    const user = {
      initials,
      name: displayName,
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
      raw,
    };
  }, [raw]);

  if (loading) {
    return <div style={{ padding: 16 }}>Loading profile…</div>;
  }

  if (err) {
    return (
      <div style={{ padding: 16, color: "#f66" }}>
        Error: {err}
      </div>
    );
  }

  if (!ui) return null;

  const onSaved = (updated) => {
    // PATCH /users/<id> returns full user; merge into raw
    setRaw((prev) => ({ ...(prev || {}), ...(updated || {}) }));
  };

  // ---------- rendering ----------
  return (
    <div className="cw-profile-page">
      <Shell />

      {/* Cover / banner */}
      <section className="cw-cover cw-card">
        <div
          className="cw-cover__banner"
          style={
            ui.raw.bannerUrl
              ? { backgroundImage: `url(${ui.raw.bannerUrl})` }
              : undefined
          }
        />
        <div className="cw-cover__footer">
          <Header
            user={ui.user}
            isMe={isMe}
            onEdit={() => setEditing(true)}   // <- important so Header can open editor
          />
          {isMe && (
            <div className="cw-cover__edit">
              {/* you can later hook this to open a banner upload dialog instead of link */}
              <button
                type="button"
                className="cw-chip"
                onClick={() => setEditing(true)}
              >
                Change banner
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="cw-profile-body">
        {/* left sidebar */}
        <aside className="cw-about cw-card">
          <SidebarAbout
            about={ui.about || (isMe ? "Add a bio…" : "")}
            highlights={ui.highlights}
            skills={ui.skills}
          />
        </aside>

        {/* main content */}
        <main className="cw-profile-main">
          {/* tabs */}
          <div className="cw-tabsbar cw-card">
            <TabsBar
              tabs={["Posts", "Connections", "Activity", "About"]}
              active={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {/* optional gallery */}
          {ui.gallery.length > 0 && (
            <section className="cw-gallery cw-card">
              <GalleryGrid items={ui.gallery} />
            </section>
          )}

          {/* POSTS TAB */}
          {activeTab === "Posts" && (
            <>
              {/* new post box for owner */}
              {isMe && (
                <div
                  className="cw-card"
                  style={{ padding: 12, display: "grid", gap: 8 }}
                >
                  <textarea
                    className="cw-postbox-input"
                    placeholder="Share something…"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={3}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      className="cw-chip"
                      onClick={() => setNewPost("")}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      className="cw-btn-post"
                      onClick={async () => {
                        const text = newPost.trim();
                        if (!text) return;

                        try {
                          const res = await fetch(
                            `http://localhost:5000/users/${userId}/posts`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ text }),
                            }
                          );
                          const data = await res.json();
                          if (!res.ok) {
                            alert(data?.msg || "Failed to post");
                            return;
                          }
                          // backend create_post returns full user (serialize_user)
                          setRaw(data);
                          setNewPost("");
                          setActiveTab("Posts");
                        } catch (e) {
                          console.error("Post create error", e);
                          alert("Failed to create post");
                        }
                      }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

              {/* post list */}
              {ui.posts.length === 0 && !isMe && (
                <div
                  className="cw-card"
                  style={{ padding: 16, color: "var(--muted)" }}
                >
                  No posts yet.
                </div>
              )}
              {ui.posts.length === 0 && isMe && (
                <div
                  className="cw-card"
                  style={{ padding: 16, color: "var(--muted)" }}
                >
                  No posts yet. Share your first update!
                </div>
              )}

              {ui.posts.map((p) => {
                const created =
                  (p.createdAt && new Date(p.createdAt)) || new Date();
                const mediaArray = Array.isArray(p.media) ? p.media : [];

                return (
                  <article
                    key={p.id || created.getTime()}
                    className="cw-post-card cw-card"
                  >
                    <PostCard
                      author={{
                        initials: ui.user.initials,
                        name: ui.user.name,
                      }}
                      meta={created.toLocaleString()}
                      text={p.text}
                      media={mediaArray.map((m) => ({
                        label: m.url || "media",
                        url: m.url,
                      }))}
                      actions={{
                        likes: p.likes || 0,
                        comments: p.comments || 0,
                      }}
                    />
                  </article>
                );
              })}
            </>
          )}

          {/* CONNECTIONS TAB */}
          {activeTab === "Connections" && (
            <div className="cw-card" style={{ padding: 16 }}>
              <strong>Connections</strong>
              <p className="cw-muted">
                Coming soon. Show followers &amp; following lists.
              </p>
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === "Activity" && (
            <div className="cw-card" style={{ padding: 16 }}>
              <strong>Activity</strong>
              <p className="cw-muted">
                Recent posts, comments, and reactions will appear here.
              </p>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === "About" && (
            <div className="cw-card" style={{ padding: 16 }}>
              <strong>About</strong>
              <p className="cw-bio">{ui.about || "No bio yet."}</p>

              {!!ui.highlights.length && (
                <div
                  className="cw-highlights"
                  style={{ marginTop: 10 }}
                >
                  {ui.highlights.map((h) => (
                    <span key={h} className="cw-chip">
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {!!ui.skills.length && (
                <div className="cw-skills" style={{ marginTop: 10 }}>
                  {ui.skills.map((s) => (
                    <span key={s} className="cw-chip">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

            <footer className="cw-profile-footer">
        <div className="cw-profile-footer-inner">
          <span>© {new Date().getFullYear()} CyberWhiteHat</span>
          <span className="cw-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
          </span>
        </div>
      </footer>


      {/* edit profile modal / panel */}
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
          username: raw.username,
        }}
        onClose={() => setEditing(false)}
        onSaved={(updated) => {
          onSaved(updated);
          setEditing(false);
        }}
      />
    </div>
  );
}
