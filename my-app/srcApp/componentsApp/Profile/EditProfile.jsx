// srcApp/componentsApp/Profile/EditProfile.jsx
import React, { useEffect, useState } from "react";

function splitCsv(s) {
  return s.trim() ? s.split(",").map(v => v.trim()).filter(Boolean) : [];
}
function joinCsv(a) {
  return Array.isArray(a) ? a.join(", ") : "";
}

export default function EditProfile({ open, initial, onClose, onSaved }) {
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState("");
  const [highlights, setHighlights] = useState("");
  const [skills, setSkills] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!open || !initial) return;
    setDisplayName(initial.displayName || initial.name || initial.username);
    setTitle(initial.title || "");
    setBio(initial.bio || "");
    setTags(joinCsv(initial.tags || []));
    setHighlights(joinCsv(initial.highlights || []));
    setSkills(joinCsv(initial.skills || []));
    setBannerUrl(initial.bannerUrl || "");
    setAvatarUrl(initial.avatarUrl || "");
  }, [open, initial]);

  if (!open) return null;

  const save = async () => {
    const userId = localStorage.getItem("userId");
    const payload = {
      displayName,
      title,
      bio,
      tags: splitCsv(tags),
      highlights: splitCsv(highlights),
      skills: splitCsv(skills),
      bannerUrl: bannerUrl.trim(),
      avatarUrl: avatarUrl.trim(),
    };
    const r = await fetch(`http://localhost:5000/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const e = await r.json().catch(()=>({msg:"Update failed"}));
      alert(e.msg || "Update failed");
      return;
    }
    const updated = await r.json(); // includes merged user
    onSaved(updated);     // bubble up to ProfilePage
    onClose();
  };

  return (
    <div className="ep-backdrop" onClick={onClose}>
      <div className="ep-sheet" onClick={(e)=>e.stopPropagation()}>
        <h3>Edit profile</h3>

        <label>Display name</label>
        <input value={displayName} onChange={e=>setDisplayName(e.target.value)} />

        <label>Title</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} />

        <label>Bio</label>
        <textarea rows={3} value={bio} onChange={e=>setBio(e.target.value)} />

        <label>Tags (comma separated)</label>
        <input value={tags} onChange={e=>setTags(e.target.value)} />

        <label>Highlights (comma separated)</label>
        <input value={highlights} onChange={e=>setHighlights(e.target.value)} />

        <label>Skills (comma separated)</label>
        <input value={skills} onChange={e=>setSkills(e.target.value)} />

        <label>Banner URL</label>
        <input value={bannerUrl} onChange={e=>setBannerUrl(e.target.value)} />

        <label>Avatar URL</label>
        <input value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} />

        <div className="ep-actions">
          <button className="ep-btn" onClick={onClose}>Cancel</button>
          <button className="ep-btn ep-primary" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
