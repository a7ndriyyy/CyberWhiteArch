import React, { useEffect, useRef, useState } from "react";
import { useLayoutEffect } from "react";

export default function DmComposer({ vanishOn, vanishText, onSend }) {
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);
  const taRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    setActive(value.trim().length > 0 || document.activeElement === taRef.current);
  }, [value]);


   useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const body = el.closest(".dm-body");
    if (!body) return;

    const apply = () => {
      const h = el.offsetHeight || 0;
      body.style.setProperty("--composer-h", `${h}px`);
    };
    apply();

    // реагуємо на зміну висоти (textarea росте/зменшується)
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const send = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div ref={rootRef} className={`dm-composer ${active ? "is-active" : ""}`}>
      <div className="dm-vanish">{vanishOn ? `Vanish in ${vanishText}` : ""}</div>

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

      <div className="dm-pad">
        <button className="cw-icon-btn" title="Attach">＋</button>
        <button className="cw-icon-btn" title="Emoji">☺</button>
        <button className="cw-icon-btn" title="Code">{"</>"}</button>
        <div className="spacer" />
        <button className="cw-btn-primary" disabled={!value.trim()} onClick={send}>
          Send ⏎
        </button>
      </div>
    </div>
  );
}
