import React, { useEffect, useState } from "react";
import "./HackerLoader.css";

const DEFAULT_DURATION = 7000; // ms

export default function HackerLoader({ durationMs = DEFAULT_DURATION, onFinish }) {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const charset = "01@#$%&*<>[]{}()=+-/\\|abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const linesCount = 1;

    const genLine = () => {
      const len = Math.floor(Math.random() * 60) + 20;
      let s = "";
      for (let i = 0; i < len; i++) {
        s += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return s;
    };

    // initial lines
    setLines(Array.from({ length: linesCount }, genLine));

    const iv = setInterval(() => {
      setLines(prev =>
        prev.map(line => {
          // with some probability generate entirely new line
          if (Math.random() < 0.25) return genLine();
          // otherwise mutate a few chars
          const arr = line.split("");
          const changes = Math.max(1, Math.floor(arr.length * 0.06));
          for (let i = 0; i < changes; i++) {
            const idx = Math.floor(Math.random() * arr.length);
            arr[idx] = charset.charAt(Math.floor(Math.random() * charset.length));
          }
          return arr.join("");
        })
      );
    }, 70);

    const to = setTimeout(() => {
      clearInterval(iv);
      // невелика пауза для плавності
      setTimeout(() => onFinish && onFinish(), 120);
    }, durationMs);

    return () => {
      clearInterval(iv);
      clearTimeout(to);
    };
  }, [durationMs, onFinish]);

  return (
    <div className="hacker-loader">
      <div className="hacker-box" role="status" aria-live="polite">
        {lines.map((l, i) => (
          <pre key={i}>{l}</pre>
        ))}
      </div>
    </div>
  );
}

