// srcApp/pages/InSystem/Tools/ToolsHubPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ToolsHubPage.css";

export default function ToolsHubPage() {
  const [tools, setTools] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cw_tools") || "[]");
    setTools(stored);
  }, []);

  return (
    <div className="cw-tools">
      <header className="cw-tools__topbar">
        <div className="cw-tools__tabs">
          <button className="cw-tools__tab cw-tools__tab--active">
            Explore tools
          </button>
        </div>

        <button
          type="button"
          className="cw-btn cw-btn--primary cw-tools__create-btn"
          onClick={() => navigate("/app/tools/new")}
        >
          + Create a tool
        </button>
      </header>

      <main className="cw-tools__content cw-card">
        {tools.length === 0 ? (
          <div className="cw-tools__empty">
            <h2>No tools yet</h2>
            <p>Once you create a tool, it will appear here.</p>
            <button
              type="button"
              className="cw-btn cw-btn--ghost"
              onClick={() => navigate("/app/tools/new")}
            >
              Create your first tool
            </button>
          </div>
        ) : (
          <div className="cw-tools__grid">
            {tools.map((tool) => (
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
                    {tool.tagline || "No tagline yet."}
                  </p>
                  {tool.fileName && (
                    <p className="cw-ct-hint">File: {tool.fileName}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
