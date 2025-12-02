// src/pages/Tools/CreateToolPage.jsx
import React, { useState } from "react";
import "./CreateToolPage.css";

export default function CreateToolPage() {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("recon");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [file, setFile] = useState(null);
  const [agreeSafe, setAgreeSafe] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeSafe) {
      alert("You must confirm the tool is not malware.");
      return;
    }

    // TODO: send data + file to backend
    // const formData = new FormData();
    // formData.append("name", name);
    // formData.append("tagline", tagline);
    // formData.append("description", description);
    // formData.append("category", category);
    // formData.append("tags", tags);
    // formData.append("visibility", visibility);
    // formData.append("file", file);

    console.log("Create tool payload:", {
      name,
      tagline,
      description,
      category,
      tags,
      visibility,
      file,
    });

    alert("Tool submitted! (Hook this up to your API)");
  };

  return (
    <div className="cw-ct-layout">
      <header className="cw-ct-header">
        <div>
          <h1 className="cw-ct-title">Create a new tool</h1>
          <p className="cw-ct-subtitle">
            Publish safe offensive-security utilities for the community. All uploads are scanned by AV.
          </p>
        </div>

        <div className="cw-ct-rule-pill">
          <span className="cw-ct-dot"></span>
          No malware · No infected files · Permanent ban for abuse
        </div>
      </header>

      <main className="cw-ct-main">
        {/* LEFT: FORM */}
        <section className="cw-card cw-ct-card">
          <h2 className="cw-ct-section-title">Tool details</h2>

          <form className="cw-ct-form" onSubmit={handleSubmit}>
            <div className="cw-ct-field">
              <label className="cw-ct-label">
                Tool name <span className="cw-ct-required">*</span>
              </label>
              <input
                className="cw-ct-input"
                placeholder="e.g. PortScanner Pro"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="cw-ct-field">
              <label className="cw-ct-label">Short tagline</label>
              <input
                className="cw-ct-input"
                placeholder="Quick TCP port scanner with banners"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>

            <div className="cw-ct-field">
              <label className="cw-ct-label">
                Description <span className="cw-ct-required">*</span>
              </label>
              <textarea
                className="cw-ct-textarea"
                rows={6}
                placeholder="Explain what the tool does, how to use it, and any requirements."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="cw-ct-grid">
              <div className="cw-ct-field">
                <label className="cw-ct-label">Category</label>
                <select
                  className="cw-ct-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="recon">Recon / Discovery</option>
                  <option value="analysis">Analysis / Forensics</option>
                  <option value="exploitation">Exploitation helpers</option>
                  <option value="post">Post-exploitation helpers</option>
                  <option value="utility">Utility / Misc</option>
                </select>
              </div>

              <div className="cw-ct-field">
                <label className="cw-ct-label">Visibility</label>
                <select
                  className="cw-ct-select"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private (only you)</option>
                </select>
              </div>
            </div>

            <div className="cw-ct-field">
              <label className="cw-ct-label">Tags</label>
              <input
                className="cw-ct-input"
                placeholder="nmap, tcp, scanner"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="cw-ct-hint">Comma-separated. Example: recon, http, dns</p>
            </div>

            <div className="cw-ct-safe-row">
              <label className="cw-ct-checkbox">
                <input
                  type="checkbox"
                  checked={agreeSafe}
                  onChange={(e) => setAgreeSafe(e.target.checked)}
                />
                <span>
                  I confirm this tool does not contain malware, backdoors, or intentionally harmful payloads.
                </span>
              </label>
            </div>

            <div className="cw-ct-actions">
              <button type="button" className="cw-btn cw-btn--ghost">
                Cancel
              </button>
              <button type="submit" className="cw-btn cw-btn--primary">
                Submit tool
              </button>
            </div>
          </form>
        </section>

        {/* RIGHT: UPLOAD + PREVIEW */}
        <aside className="cw-ct-sidebar">
          <div className="cw-card cw-ct-upload-card">
            <h2 className="cw-ct-section-title">Upload & scan</h2>
            <p className="cw-ct-text">
              Upload your binary, script, or archive. We&apos;ll run it through our antivirus and security pipeline.
            </p>

            <label className="cw-ct-dropzone">
              <input
                type="file"
                className="cw-ct-dropzone-input"
                onChange={handleFileChange}
              />
              <div className="cw-ct-dropzone-inner">
                <div className="cw-ct-dropzone-icon">⬆</div>
                <div className="cw-ct-dropzone-text">
                  {file ? (
                    <>
                      <strong>{file.name}</strong>
                      <span className="cw-ct-hint">Selected · will be scanned on submit</span>
                    </>
                  ) : (
                    <>
                      <strong>Drop a file here</strong>
                      <span className="cw-ct-hint">or click to browse</span>
                    </>
                  )}
                </div>
              </div>
            </label>

            <ul className="cw-ct-list">
              <li>Max size: 50 MB (example)</li>
              <li>Allowed formats: zip, tar.gz, exe, bin, sh, py, etc. (adjust as you want)</li>
              <li>Every upload is scanned before being visible to others.</li>
            </ul>
          </div>

          <div className="cw-card cw-ct-preview-card">
            <h2 className="cw-ct-section-title">Preview</h2>
            <div className="cw-ct-tool-preview">
              <div className="cw-ct-tool-avatar">
                {name ? name.slice(0, 2).toUpperCase() : "TL"}
              </div>
              <div className="cw-ct-tool-main">
                <div className="cw-ct-tool-line">
                  <strong>{name || "Your tool name"}</strong>
                  <span className="cw-ct-pill">
                    {category === "recon" && "Recon"}
                    {category === "analysis" && "Analysis"}
                    {category === "exploitation" && "Exploitation"}
                    {category === "post" && "Post-exploitation"}
                    {category === "utility" && "Utility"}
                  </span>
                </div>
                <p className="cw-ct-tool-tagline">
                  {tagline || "A short tagline for your tool will appear here."}
                </p>
                <p className="cw-ct-tool-description">
                  {description
                    ? description.slice(0, 160) + (description.length > 160 ? "…" : "")
                    : "Once you write a description, a short preview of it will be shown to users here."}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
