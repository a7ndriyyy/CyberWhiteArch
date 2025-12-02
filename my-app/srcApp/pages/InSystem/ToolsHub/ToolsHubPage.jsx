// srcApp/pages/InSystem/Tools/ToolsHubPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ToolsHubPage.css";

export default function ToolsHubPage() {
  const [tools, setTools] = useState([]);
  const [activeTab, setActiveTab] = useState("explore"); // explore | mine

  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cw_tools") || "[]");
    setTools(saved);
  }, []);

  return (
    <div className="cw-tools">
      {/* ------------------ TOP NAV ------------------ */}
      <header className="cw-tools__topbar">
        <div className="cw-tools__tabs">
          <button
            className={`cw-tools__tab ${
              activeTab === "explore" ? "cw-tools__tab--active" : ""
            }`}
            onClick={() => setActiveTab("explore")}
          >
            Explore tools
          </button>

          <button
            className={`cw-tools__tab ${
              activeTab === "mine" ? "cw-tools__tab--active" : ""
            }`}
            onClick={() => setActiveTab("mine")}
          >
            Your tools
          </button>
        </div>

        <button
          type="button"
          className="cw-btn cw-btn--primary cw-tools__create-btn"
          onClick={() => navigate("/app/tools/new")}
        >
          + Create tool
        </button>
      </header>

      {/* ------------------ MAIN CONTENT ------------------ */}
      <main className="cw-tools__content cw-card">
        {activeTab === "explore" && (
          <div className="cw-tools__grid">
            {tools.length === 0 ? (
              <p>No tools available yet.</p>
            ) : (
              tools.map((tool) => (
                <Link
                  key={tool.id}
                  to={`/app/tools/${tool.id}`}
                  className="cw-tools__item"
                >
                  <div className="cw-tools__avatar">
                    {tool.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="cw-tools__meta">
                    <div className="cw-tools__line">
                      <strong>{tool.name}</strong>
                      <span className="cw-tools__pill">{tool.category}</span>
                    </div>
                    <p className="cw-tools__tagline">
                      {tool.tagline || "No tagline"}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === "mine" && (
          <div className="cw-tools__grid">
            {tools.filter((t) => t.ownerId === currentUserId).length === 0 ? (
              <p>You have not created any tools yet.</p>
            ) : (
              tools
                .filter((t) => t.ownerId === currentUserId)
                .map((tool) => (
                  <Link
                    key={tool.id}
                    to={`/app/tools/${tool.id}`}
                    className="cw-tools__item"
                  >
                    <div className="cw-tools__avatar">
                      {tool.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="cw-tools__meta">
                      <div className="cw-tools__line">
                        <strong>{tool.name}</strong>
                        <span className="cw-tools__pill">{tool.category}</span>
                      </div>
                      <p className="cw-tools__tagline">{tool.tagline}</p>
                    </div>
                  </Link>
                ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
