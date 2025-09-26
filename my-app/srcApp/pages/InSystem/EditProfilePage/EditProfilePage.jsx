import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfile from "../../../componentsApp/Profile/EditProfile"; // <-- your modal

export default function EditProfilePage() {
  const userId = localStorage.getItem("userId");
  const nav = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!userId) { nav("/login", { replace: true }); return; }
    setLoading(true);
    fetch(`http://localhost:5000/users/${userId}`)
      .then(async r => {
        if (!r.ok) throw new Error((await r.json())?.msg || "Failed to load");
        return r.json();
      })
      .then(u => setInitial({
        displayName: u.displayName || u.username,
        title: u.title || "",
        bio: u.bio || "",
        tags: u.tags || [],
        highlights: u.highlights || [],
        skills: u.skills || [],
        bannerUrl: u.bannerUrl || "",
        avatarUrl: u.avatarUrl || "",
        username: u.username,
      }))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [userId, nav]);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (err) return <div style={{ padding: 16, color: "#f66" }}>Error: {err}</div>;

  // Render your modal as a page: always open; close => go back to profile
  return (
    <EditProfile
      open={true}
      initial={initial}
      onClose={() => nav("/app/profile", { replace: true })}
      onSaved={() => { /* optional toast or state */ }}
    />
  );
}
