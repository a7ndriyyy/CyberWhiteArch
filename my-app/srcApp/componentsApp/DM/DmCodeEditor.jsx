import React, { useMemo } from "react";
import Editor from "@monaco-editor/react";

export default function DmCodeEditor({
  value,
  language = "",
  theme = "dark",                // "dark" | "light"
  onChange,
  onSendRequested,               // викличемо на Ctrl/Cmd+Enter
}) {
  const monacoLang = useMemo(() => mapLang(language), [language]);

  return (
    <div className="dm-code-monaco">
      <Editor
        value={value}
        language={monacoLang}
        onChange={(v) => onChange?.(v ?? "")}
        theme={theme === "light" ? "vs" : "vs-dark"}
        height="220px"                 // можна збільшити або зробити проп
        options={{
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontSize: 13,
          lineNumbers: "on",
          tabSize: 2,
          insertSpaces: true,
        }}
        onMount={(editor, monaco) => {
          // Ctrl/Cmd + Enter -> відправити
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            onSendRequested?.();
          });
        }}
      />
    </div>
  );
}

function mapLang(x = "") {
  const k = x.trim().toLowerCase();
  const map = {
    js: "javascript", jsx: "javascript",
    ts: "typescript", tsx: "typescript",
    py: "python", py3: "python",
    sh: "shell", bash: "shell", zsh: "shell",
    html: "html", css: "css",
    json: "json", sql: "sql",
    c: "c", h: "cpp", cpp: "cpp", cc: "cpp",
    java: "java", cs: "csharp",
    go: "go", rs: "rust",
    php: "php", rb: "ruby",
    kt: "kotlin", swift: "swift",
    yaml: "yaml", yml: "yaml",
    md: "markdown",
  };
  return map[k] || (k || "plaintext");
}
