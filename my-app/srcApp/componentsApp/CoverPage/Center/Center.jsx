import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Center.css";

export default function Center() {
  const [user, setUser] = useState(null);
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // UI state
  const [openReactionFor, setOpenReactionFor] = useState(null);
  const [openCommentFor, setOpenCommentFor] = useState(null);
  const [commentText, setCommentText] = useState("");

  // NEW: per-post reply image (blob urls)
  const [replyImageByPost, setReplyImageByPost] = useState({}); // { [postId]: blobUrl }
  const replyFileRef = useRef(null);
  const currentReplyPostIdRef = useRef(null);

  // audience + voting
  const [audience, setAudience] = useState("public"); // 'public' | 'followers'
  const [allowVotes, setAllowVotes] = useState(false);

  // misc refs
  const fileInputRef = useRef(null);
  const longPressTimer = useRef(null);

  // load user
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    axios
      .get(`http://localhost:5000/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load user", err));
  }, []);

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "?";
  const toggleTheme = () => document.body.classList.toggle("cw-dark");

  // -------- Media on new post
  const handleMediaClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (selectedImage) URL.revokeObjectURL(selectedImage);
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
  };

  // -------- Audience + votes
  const toggleAudience = () =>
    setAudience((a) => (a === "public" ? "followers" : "public"));
  const toggleAllowVotes = () => setAllowVotes((v) => !v);

  // -------- Create post
  const handlePost = () => {
    if (!postText.trim() && !selectedImage) return;

    const newPost = {
      id: Date.now(),
      author: user?.username || "Guest",
      initials,
      text: postText,
      time: "just now",
      image: selectedImage || null,
      reaction: null,
      comments: [],
      reposts: 0,
      audience,
      allowVotes,
      score: 0,
      myVote: 0, // -1 | 0 | 1
    };

    setPosts((prev) => [newPost, ...prev]);
    setPostText("");
    if (selectedImage) {
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  // -------- Reactions
  const openReactionPicker = (postId) => setOpenReactionFor(postId);
  const closeReactionPicker = () => setOpenReactionFor(null);
  const setReaction = (postId, emoji) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, reaction: emoji } : p))
    );
    closeReactionPicker();
  };
  const onMsgMouseDown = (postId) => {
    longPressTimer.current = setTimeout(() => openReactionPicker(postId), 400);
  };
  const onMsgMouseUp = () => clearTimeout(longPressTimer.current);
  const onMsgContextMenu = (e, postId) => {
    e.preventDefault();
    openReactionPicker(postId);
  };

  // -------- Comments (with image)
  const toggleCommentBox = (postId) => {
    setOpenCommentFor(openCommentFor === postId ? null : postId);
    setCommentText("");
    // leave any existing image preview as-is; user can change/clear with new pick
  };

  const handleReplyMediaClick = (postId) => {
    currentReplyPostIdRef.current = postId;
    replyFileRef.current?.click();
  };

  const handleReplyFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const pid = currentReplyPostIdRef.current;
    setReplyImageByPost((prev) => {
      if (prev[pid]) URL.revokeObjectURL(prev[pid]);
      return { ...prev, [pid]: url };
    });
    e.target.value = null; // reset input
  };

  const addComment = (postId) => {
    const img = replyImageByPost[postId];
    if (!commentText.trim() && !img) return;

    const newComment = {
      id: Date.now(),
      author: user?.username || "Guest",
      initials,
      text: commentText.trim(),
      time: "now",
      image: img || null,
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p
      )
    );

    setCommentText("");
    // clear image preview for this post
    setReplyImageByPost((prev) => ({ ...prev, [postId]: null }));
    setOpenCommentFor(null);
  };

  // -------- Repost
  const doRepost = (post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, reposts: (p.reposts || 0) + 1 } : p))
    );
    const copy = {
      ...post,
      id: Date.now(),
      author: user?.username || "Guest",
      initials,
      time: "reposted now",
    };
    setPosts((prev) => [copy, ...prev]);
  };

  // -------- Voting (Reddit-like)
  const upvote = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.allowVotes) return p;
        let score = p.score || 0;
        let my = p.myVote || 0;
        if (my === 1) {
          my = 0;
          score -= 1;
        } else if (my === -1) {
          my = 1;
          score += 2;
        } else {
          my = 1;
          score += 1;
        }
        return { ...p, score, myVote: my };
      })
    );
  };

  const downvote = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.allowVotes) return p;
        let score = p.score || 0;
        let my = p.myVote || 0;
        if (my === -1) {
          my = 0;
          score += 1;
        } else if (my === 1) {
          my = -1;
          score -= 2;
        } else {
          my = -1;
          score -= 1;
        }
        return { ...p, score, myVote: my };
      })
    );
  };

  return (
    <main className="cw-center">
      {/* Topbar */}
      <div className="cw-topbar cw-card">
        <div className="cw-tabs">
          <button className="cw-tab" aria-selected="true">Home</button>
          <button className="cw-tab">Explore</button>
          <button className="cw-tab">Following</button>
        </div>
        <button className="cw-chip" onClick={toggleTheme} title="Toggle theme">
          <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z"/>
          </svg>
          Theme
        </button>
      </div>

      {/* Composer */}
      <section className="cw-postbox cw-card" aria-label="Create post">
        <div className="cw-postbox-row">
          <div className="cw-avatar cw-avatar--teal">{initials}</div>
          <div className="cw-postbox-inputWrap">
            <textarea
              className="cw-postbox-input"
              placeholder="What's happening in the lab?"
              rows={3}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
            {selectedImage && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={selectedImage}
                  alt="preview"
                  style={{ display: "block", width: "100%", maxHeight: 240, objectFit: "contain", borderRadius: 8 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Tools + Post */}
        <div className="cw-postbox-actions">
          <div className="cw-postbox-tools">
            {/* Media */}
            <button className="cw-icon-btn" title="Add media" aria-label="Add media" onClick={handleMediaClick}>
              <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M10 13l2-2 4 4M7 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
            </button>
            <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />

            {/* Voting toggle */}
            <button
              className={`cw-icon-btn ${allowVotes ? "is-active" : ""}`}
              title={allowVotes ? "Voting enabled" : "Enable voting"}
              aria-label="Toggle voting"
              onClick={toggleAllowVotes}
            >
              <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 19V5M10 19v-8M16 19V8M22 19V3" />
              </svg>
            </button>

            {/* Audience toggle: globe (public) / lock (followers) */}
            <button
              className={`cw-icon-btn ${audience === "followers" ? "is-active" : ""}`}
              title={audience === "followers" ? "Followers (private)" : "Public"}
              aria-label="Toggle audience"
              onClick={toggleAudience}
            >
              {audience === "followers" ? (
                <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="4" y="11" width="16" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                </svg>
              ) : (
                <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18" />
                  <path d="M12 3a15 15 0 0 1 0 18" />
                  <path d="M12 3a15 15 0 0 0 0 18" />
                </svg>
              )}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="cw-muted">
              {audience === "followers" ? "Followers" : "Public"} • {allowVotes ? "Votes on" : "Votes off"}
            </span>
            <button className="cw-btn-post" onClick={handlePost}>Post</button>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section className="cw-thread cw-card" aria-label="Conversation" style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {posts.length === 0 && <p style={{ padding: 10, color: "#888" }}>No posts yet.</p>}

        {posts.map((p) => (
          <div
            className="cw-msg"
            key={p.id}
            onMouseDown={() => onMsgMouseDown(p.id)}
            onMouseUp={onMsgMouseUp}
            onMouseLeave={onMsgMouseUp}
            onContextMenu={(e) => onMsgContextMenu(e, p.id)}
            style={{ position: "relative" }}
          >
            <div className="cw-avatar">{p.initials}</div>

            <div className="cw-bubble">
              <div className="cw-meta-row">
                <strong>@{p.author}</strong>
                <span className="cw-muted"> · {p.time}</span>
                {p.audience === "followers" && (
                  <span className="cw-muted" style={{ marginLeft: 8,display: "inline-flex",  alignItems: "center", gap: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="11" width="16" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                    </svg>
                    Followers
                  </span>
                )}
                {p.reposts > 0 && <span className="cw-muted" style={{ marginLeft: 8 }}>↻ {p.reposts}</span>}
              </div>

              {p.text && <div>{p.text}</div>}

              {p.image && (
                <div className="cw-media-grid" style={{ marginTop: 8 }}>
                  <img
                    src={p.image}
                    alt="post"
                    style={{ display: "block", width: "100%", maxHeight: 280, objectFit: "contain", borderRadius: 8 }}
                  />
                </div>
              )}

              {/* Action bar */}
              <div className="cw-actions" style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                {/* Voting */}
                {p.allowVotes && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <button className="cw-action" aria-label="Upvote" onClick={() => upvote(p.id)} title="Upvote">▲</button>
                    <span className="cw-muted">{p.score}</span>
                    <button className="cw-action" aria-label="Downvote" onClick={() => downvote(p.id)} title="Downvote">▼</button>
                  </div>
                )}

                {/* Comment */}
                <button className="cw-action" aria-label="Comment" onClick={() => toggleCommentBox(p.id)} title="Comment">
                  <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>
                  </svg>
                  {p.comments.length > 0 ? ` ${p.comments.length}` : ""}
                </button>

                {/* Repost */}
                <button className="cw-action" aria-label="Repost" onClick={() => doRepost(p)} title="Repost">
                  <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17 2l4 4-4 4"/>
                    <path d="M3 12v-2a4 4 0 0 1 4-4h14"/>
                    <path d="M7 22l-4-4 4-4"/>
                    <path d="M21 12v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                </button>

                {/* React */}
                <button
                  className="cw-action"
                  aria-label="Add reaction"
                  onClick={(e) => { e.stopPropagation(); openReactionPicker(p.id); }}
                  title="Add reaction"
                >
                  <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 10h.01M15 10h.01" />
                    <path d="M8 14s2 2 4 2 4-2 4-2" />
                  </svg>
                </button>
              </div>

              {/* Reaction badge */}
              {p.reaction && (
                <div style={{ marginTop: 6, fontSize: 14 }}>
                  <span className="cw-react" style={{ padding: "2px 6px", borderRadius: 12, background: "var(--cw-surface-2,#111)" }}>
                    {p.reaction}
                  </span>
                </div>
              )}

              {/* Reply composer (with image button + preview) */}
              {openCommentFor === p.id && (
                <>
                  <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      className="cw-dialogs__input"
                      placeholder="Write a reply…"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      className="cw-icon-btn"
                      title="Add image to reply"
                      aria-label="Add image to reply"
                      onClick={() => handleReplyMediaClick(p.id)}
                    >
                      <svg className="cw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="M10 13l2-2 4 4M7 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      </svg>
                    </button>
                    <button className="cw-chip" onClick={() => addComment(p.id)}>Reply</button>
                  </div>

                  {replyImageByPost[p.id] && (
                    <div style={{ marginTop: 6 }}>
                      <img
                        src={replyImageByPost[p.id]}
                        alt="reply preview"
                        style={{ maxWidth: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 8 }}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Comments list */}
              {p.comments.length > 0 && (
                <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                  {p.comments.map((c) => (
                    <div key={c.id} style={{ display: "flex", gap: 8 }}>
                      <div className="cw-avatar" style={{ transform: "scale(0.85)" }}>{c.initials}</div>
                      <div className="cw-bubble" style={{ padding: "8px 10px" }}>
                        <div className="cw-meta-row">
                          <strong>@{c.author}</strong>
                          <span className="cw-muted"> · {c.time}</span>
                        </div>
                        {c.text && <div>{c.text}</div>}
                        {c.image && (
                          <img
                            src={c.image}
                            alt="comment"
                            style={{ marginTop: 6, maxWidth: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 8 }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Emoji picker */}
            {openReactionFor === p.id && (
              <div
                style={{
                  position: "absolute",
                  right: 8,
                  top: 40,
                  background: "var(--cw-surface-3,#000)",
                  border: "1px solid var(--cw-border,#333)",
                  borderRadius: 8,
                  padding: 6,
                  display: "flex",
                  gap: 6,
                  zIndex: 10,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {["👍","🔥","😂","😍","😮","😢"].map((emo) => (
                  <button
                    key={emo}
                    onClick={() => setReaction(p.id, emo)}
                    style={{ fontSize: 18, lineHeight: "22px", padding: "4px 6px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}
                  >
                    {emo}
                  </button>
                ))}
                <button
                  onClick={() => setOpenReactionFor(null)}
                  style={{ marginLeft: 4, fontSize: 12, color: "var(--cw-muted,#aaa)", background: "transparent", border: "none", cursor: "pointer" }}
                  title="Close"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Hidden file input for reply images (one global) */}
      <input
        type="file"
        accept="image/*"
        ref={replyFileRef}
        style={{ display: "none" }}
        onChange={handleReplyFileChange}
      />
    </main>
  );
}