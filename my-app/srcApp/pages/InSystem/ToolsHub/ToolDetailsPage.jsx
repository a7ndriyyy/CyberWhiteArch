// srcApp/pages/InSystem/Tools/ToolDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ToolDetailsPage.css";

export default function ToolDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cw_tools") || "[]");
    const found = stored.find((t) => t.id === id);
    setTool(found || null);
  }, [id]);

  if (!tool) {
    return (
      <div className="tool-view-page">
        <p>Tool not found.</p>
        <button
          type="button"
          className="cw-btn cw-btn--ghost"
          onClick={() => navigate("/app/tools")}
        >
          ← Back to tools
        </button>
      </div>
    );
  }

  return (
    <div className="tool-view-page">
      {/* RED WARNING BANNER */}
      <div className="tool-view-warning">
        ⚠ No malware · No backdoor · Permanent ban for abuse
      </div>

      <header className="tool-view-header">
        <div>
          <h1 className="tool-view-title">{tool.name}</h1>
          <p className="tool-view-tagline">{tool.tagline}</p>
        </div>

        <button
          type="button"
          className="cw-btn cw-btn--ghost"
          onClick={() => navigate("/app/tools")}
        >
          ← Back to tools
        </button>
      </header>

      <div className="tool-view-meta">
        <span className="tool-view-pill">{tool.category}</span>
        {tool.visibility && (
          <span className="tool-view-pill tool-view-pill--muted">
            {tool.visibility}
          </span>
        )}
        {tool.tags && (
          <span className="tool-view-tags">Tags: {tool.tags}</span>
        )}
        {tool.fileName && (
          <span className="tool-view-tags">File: {tool.fileName}</span>
        )}
      </div>

      <section className="tool-view-section">
        <h2>Description</h2>
        <p className="tool-view-description">{tool.description}</p>
      </section>

      <section className="tool-view-section">
        <h2>Script preview</h2>
        <pre className="tool-code-block">
          <code>
            {tool.filePreview || "// No script preview provided for this tool."}
          </code>
        </pre>
      </section>

      <div className="tool-view-actions">
        <button
          type="button"
          className="cw-btn cw-btn--primary"
          onClick={() => alert("Download will be implemented with the backend")}
        >
          Download tool
        </button>
      </div>
    </div>
  );
}
