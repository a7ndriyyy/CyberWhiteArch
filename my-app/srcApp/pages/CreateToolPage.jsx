// srcApp/pages/CreateToolPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateToolPage.css";

export default function CreateToolPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Recon");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("Public");

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [fileName, setFileName] = useState("");

  const [agreeSafe, setAgreeSafe] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setFileName(f.name);

    const ext = f.name.split(".").pop().toLowerCase();
    const previewable = ["txt", "py", "js", "sh", "json", "md", "yaml", "yml"];

    if (previewable.includes(ext)) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFilePreview(ev.target.result);
      };
      reader.readAsText(f);
    } else {
      setFilePreview("// This file type cannot be previewed here.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreeSafe) {
      alert("You must confirm the tool is not malware / backdoored.");
      return;
    }

    if (!name.trim()) {
      alert("Please give your tool a name.");
      return;
    }

    const newTool = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      tags: tags.trim(),
      visibility,
      fileName: fileName || null,
      filePreview: filePreview || "",
    };

    const existing = JSON.parse(localStorage.getItem("cw_tools") || "[]");
    existing.push(newTool);
    localStorage.setItem("cw_tools", JSON.stringify(existing));

    navigate("/app/tools");
  };

  return (
    <div className="cw-ct-layout">
      <header className="cw-ct-header">
        <div>
          <h1 className="cw-ct-title">Create a new tool</h1>
          <p className="cw-ct-subtitle">
            Upload a safe tool and let others inspect the script before downloading it.
          </p>
        </div>

        {/* 🔴 RED WARNING PILL */}
        <div className="cw-ct-rule-pill">
          <span className="cw-ct-dot"></span>
          No malware · No backdoor · Permanent ban for abuse
        </div>
      </header>

      <main className="cw-ct-main">
        {/* LEFT: FORM */}
        <section className="cw-card cw-ct-card">
          <h2 className="cw-ct-section-title">Tool details</h2>

          <form className="cw-ct-form" onSubmit={handleSubmit}>
            <div className="cw-ct-field">
              <label className="cw-ct-label">Tool name *</label>
              <input
                className="cw-ct-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PortScanner Pro"
                required
              />
            </div>

            <div className="cw-ct-field">
              <label className="cw-ct-label">Short tagline</label>
              <input
                className="cw-ct-input"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Fast TCP/UDP port scanner"
              />
            </div>

            <div className="cw-ct-field">
              <label className="cw-ct-label">Description *</label>
              <textarea
                className="cw-ct-textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what your tool does, how to use it, and any requirements."
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
                  <option>Recon</option>
                  <option>Analysis</option>
                  <option>Exploitation</option>
                  <option>Post-exploitation</option>
                  <option>Utility</option>
                </select>
              </div>

              <div className="cw-ct-field">
                <label className="cw-ct-label">Visibility</label>
                <select
                  className="cw-ct-select"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  <option>Public</option>
                  <option>Unlisted</option>
                  <option>Private</option>
                </select>
              </div>
            </div>

            <div className="cw-ct-field">
              <label className="cw-ct-label">Tags</label>
              <input
                className="cw-ct-input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ports, tcp, scanner"
              />
              <p className="cw-ct-hint">Comma separated. Example: recon, http, dns</p>
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
              <button
                type="button"
                className="cw-btn cw-btn--ghost"
                onClick={() => navigate("/app/tools")}
              >
                Cancel
              </button>
              <button type="submit" className="cw-btn cw-btn--primary">
                Save tool
              </button>
            </div>
          </form>
        </section>

        {/* RIGHT: FILE DROP + LIVE PREVIEW */}
        <aside className="cw-ct-sidebar">
          <div className="cw-card cw-ct-upload-card">
            <h2 className="cw-ct-section-title">Upload & AV notice</h2>
            <p className="cw-ct-text">
              Drop your script or binary here. Files are subject to antivirus and security analysis.
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
                  {fileName ? (
                    <>
                      <strong>{fileName}</strong>
                      <span className="cw-ct-hint">
                        Selected · preview shown below if supported
                      </span>
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
              <li>No malware, no RATs, no loaders.</li>
              <li>No intentionally infected files or backdoors.</li>
              <li>Violations may result in a permanent ban.</li>
            </ul>
          </div>

          <div className="cw-card cw-ct-preview-card">
            <h2 className="cw-ct-section-title">Script preview</h2>
            <pre className="tool-code-block">
              <code>
                {filePreview ||
                  "// Paste a script or upload a previewable file to see it here."}
              </code>
            </pre>
          </div>
        </aside>
      </main>
    </div>
  );
}
