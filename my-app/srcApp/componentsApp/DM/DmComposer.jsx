import React, { useEffect, useRef, useState } from "react";
import { useLayoutEffect } from "react";
import DmCodeEditor from "./DmCodeEditor.jsx";

export default function DmComposer({
  vanishOn,
  vanishText,
  onSend,
  onTypingChange,   // ⭐ NEW
}) {
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);

  const [attachments, setAttachments] = useState([]); // [{id,file,url,name,size,type,kind}]
  const fileInputRef = useRef(null);

  const [codeMode, setCodeMode] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");

  const taRef = useRef(null);
  const rootRef = useRef(null);

  // when text/code changes → mark active + fire typing callback
  useEffect(() => {
    const hasText = value.trim().length > 0;
    const hasCode = code.trim().length > 0;

    setActive(
      codeMode
        ? hasCode
        : hasText || document.activeElement === taRef.current
    );

    // ⭐ NEW: tell parent "I am typing" or "I stopped typing"
    if (onTypingChange) {
      const isTyping = codeMode ? hasCode : hasText;
      onTypingChange(isTyping);
    }
  }, [value, code, codeMode, onTypingChange]);

  useLayoutEffect(() => {
    const el = rootRef.current;
    const body = el?.closest(".dm-body");
    if (!el || !body) return;
    const apply = () =>
      body.style.setProperty("--composer-h", `${el.offsetHeight || 0}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- attachments ----
  const addFiles = (files) => {
    const arr = Array.from(files || []);
    if (!arr.length) return;
    const mapped = arr.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
      type: f.type,
      kind: f.type.startsWith("image/") ? "image" : "file",
    }));
    setAttachments((a) => [...a, ...mapped]);
  };

  const removeAttachment = (id) => {
    setAttachments((a) => {
      const x = a.find((v) => v.id === id);
      if (x) URL.revokeObjectURL(x.url);
      return a.filter((v) => v.id !== id);
    });
  };


  const onDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onPaste = (e) => {
    const files = e.clipboardData?.files;
    if (files && files.length) {
      e.preventDefault();
      addFiles(files);
    }
  };

  const send = () => {
    const textPayload = codeMode ? "" : value.trim();
    const codePayload =
      codeMode && code.trim().length
        ? { language: language.trim(), content: code }
        : null;

    if (!textPayload && !codePayload && attachments.length === 0) return;

    onSend({
      text: textPayload,
      attachments,
      code: codePayload,
    });

    // clean
    attachments.forEach((a) => URL.revokeObjectURL(a.url));
    setAttachments([]);
    setValue("");
    setCode("");
    setLanguage("");

    // ⭐ NEW: after sending, you're not typing anymore
    if (onTypingChange) {
      onTypingChange(false);
    }
  };

  const onKeyDown = (e) => {
    if (!codeMode && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
    // in codeMode we keep Enter for code editor
  };

  const themeAttr =
    document.documentElement.getAttribute("data-theme") || "dark";

  // ⭐ OPTIONAL: if you want instant typing on code changes
  const handleCodeChange = (next) => {
    setCode(next);
    // (effect above will also fire, but this makes it feel snappier)
    if (onTypingChange) {
      onTypingChange(next.trim().length > 0);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`dm-composer ${active ? "is-active" : ""}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onPaste={onPaste}
    >
      <div className="dm-vanish">
        {vanishOn ? `Vanish in ${vanishText}` : ""}
      </div>

      {attachments.length > 0 && (
        <div className="dm-attach-row">
          {attachments.map((a) => (
            <div key={a.id} className={`dm-attach ${a.kind}`}>
              {a.kind === "image" ? (
                <img src={a.url} alt={a.name} />
              ) : (
                <div className="dm-file-chip">
                  <span className="dm-file-name" title={a.name}>
                    {a.name}
                  </span>
                  <span className="dm-file-size">
                    {(a.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              )}
              <button
                className="dm-attach-remove"
                onClick={() => removeAttachment(a.id)}
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {!codeMode ? (
        <div className="dm-input">
          <textarea
            ref={taRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(value.trim().length > 0)}
            onKeyDown={onKeyDown}
            placeholder="Write a private message..."
          />
        </div>
      ) : (
        <div className="dm-code-zone">
          <div className="dm-code-bar">
            <select
              className="dm-code-lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">plaintext</option>
              <option value="js">JavaScript</option>
              <option value="ts">TypeScript</option>
              <option value="py">Python</option>
              <option value="bash">Shell</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="cpp">C/C++</option>
              <option value="java">Java</option>
              <option value="cs">C#</option>
              <option value="go">Go</option>
              <option value="rs">Rust</option>
              <option value="php">PHP</option>
              <option value="rb">Ruby</option>
              <option value="kt">Kotlin</option>
              <option value="swift">Swift</option>
              <option value="sql">SQL</option>
              <option value="yaml">YAML</option>
              <option value="md">Markdown</option>
            </select>
            <span className="dm-code-hint">Ctrl/Cmd + Enter — Send</span>
          </div>

          <DmCodeEditor
            value={code}
            language={language}
            theme={themeAttr === "light" ? "light" : "dark"}
            onChange={handleCodeChange}      // ⭐ changed from setCode
            onSendRequested={send}
          />
        </div>
      )}

      {/* action bar */}
      <div className="dm-pad">
        {/* attach files */}
        <button
          className="cw-icon-btn"
          title="Attach"
          onClick={() => fileInputRef.current?.click()}
        >
          ＋
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          accept="image/*,.pdf,.zip,.txt,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
          onChange={(e) => addFiles(e.target.files)}
        />

        {/* emoji placeholder */}
        <button className="cw-icon-btn" title="Emoji">
          ☺
        </button>

        {/* code mode toggle */}
        <button
          className={`cw-icon-btn ${codeMode ? "is-on" : ""}`}
          title="Code block"
          onClick={() => setCodeMode((v) => !v)}
        >
          {"</>"}
        </button>

        <div className="spacer" />
        <button
          className="cw-btn-primary"
          disabled={
            !value.trim() && !code.trim() && attachments.length === 0
          }
          onClick={send}
        >
          Send ⏎
        </button>
      </div>
    </div>
  );
}
