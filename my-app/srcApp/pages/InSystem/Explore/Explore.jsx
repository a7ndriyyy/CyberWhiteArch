import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";

const Explore = () => {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("trending");
  const [search, setSearch] = useState("");
  const [trendingTags, setTrendingTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);


  // load from backend when filter/search changes
  useEffect(() => {
    const controller = new AbortController();

    async function loadExplore() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          filter: activeFilter,
          q: search,
        });
        const res = await fetch(`/explore?${params.toString()}`);
        const data = await res.json();
        setTrendingTags(data.trending || []);
        setPosts(data.posts || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Explore load error", err);
        }
      } finally {
        setLoading(false);
      }
    }

    loadExplore();
    return () => controller.abort();
  }, [activeFilter, search]);

  return (
    <div className="explore-root">
      {/* header + back button + filter buttons */}
      <div className="explore-header">
        <div>
          <h2>Explore</h2>
          <p className="explore-subtitle">
            See what the lab is watching in real-time.
          </p>
        </div>

        <div className="explore-header-right">
          <button className="explore-back-btn" onClick={() => navigate("/app/")}>
            ← Back home
          </button>

          <div className="explore-toggle-group">
            <button
              className={
                "explore-toggle " +
                (activeFilter === "trending" ? "explore-toggle-active" : "")
              }
              onClick={() => setActiveFilter("trending")}
            >
              Trending
            </button>
            <button
              className={
                "explore-toggle " +
                (activeFilter === "latest" ? "explore-toggle-active" : "")
              }
              onClick={() => setActiveFilter("latest")}
            >
              Latest
            </button>
            <button
              className={
                "explore-toggle " +
                (activeFilter === "critical" ? "explore-toggle-active" : "")
              }
              onClick={() => setActiveFilter("critical")}
            >
              Critical only
            </button>
          </div>
        </div>
      </div>

      {/* search */}
      <div className="explore-search-card">
        <input
          className="explore-search-input"
          placeholder="Search threats, tools, CVEs, or hackers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <div className="explore-empty">Loading…</div>}

      <div className="explore-grid">
        {/* LEFT: trending tags from backend */}
        <section className="explore-card">
          <div className="explore-card-header">
            <h3>Trending in cyber</h3>
          </div>
          <ul className="explore-list">
            {trendingTags.length === 0 && !loading && (
              <li className="explore-empty">No trends yet.</li>
            )}
            {trendingTags.map((t, i) => (
              <li key={i} className="explore-list-item">
                <div className="explore-tag-main">
                  <span className="explore-tag-hash">{t.tag}</span>
                  <p className="explore-tag-label">Tagged in {t.volume}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* RIGHT: posts list (latest / critical etc) */}
        <section className="explore-column">
          <div className="explore-card">
            <div className="explore-card-header">
              <h3>From the lab</h3>
            </div>

            <ul className="explore-post-list">
              {posts.length === 0 && !loading && (
                <li className="explore-empty">No posts match yet.</li>
              )}

              {posts.map((post) => (
                <li key={post.id} className="explore-post">
                  <div className="explore-post-header">
                    <div className="explore-avatar-circle">AN</div>
                    <div>
                      <span className="explore-handle">
                        {post.handle || "@anon"}
                      </span>
                    </div>
                  </div>
                  <p className="explore-post-title">{post.text}</p>
                  {post.tags && (
                    <p className="explore-post-snippet">
                      {post.tags.join(" ")}
                    </p>
                  )}
                  <div className="explore-post-actions">
                    <button>▲</button>
                    <button>💬</button>
                    <button>↻</button>
                    <button>🔗</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;
