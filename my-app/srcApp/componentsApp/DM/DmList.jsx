import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

function isSameDay(a, b) {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() &&
         da.getMonth() === db.getMonth() &&
         da.getDate() === db.getDate();
}
function dayLabel(ts) {
  const d = new Date(ts);
  const today = new Date();
  const yest = new Date(); yest.setDate(today.getDate() - 1);
  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yest))  return "Yesterday";
  return d.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
}

export default function DmList({ messages = [] }) {
  const scrollerRef = useRef(null);
  const endRef = useRef(null);
  const [following, setFollowing] = useState(true);   // auto-follow enabled?
  const [showJump, setShowJump] = useState(false);    // show “↓ New messages”

  // Build a flat list with date separators
  const items = useMemo(() => {
    const out = [];
    let lastTs = null;
    for (const m of messages) {
      const ts = m.ts ?? Date.now();
      if (!lastTs || !isSameDay(ts, lastTs)) {
        out.push({ _type: "date", id: `d-${ts}`, ts, label: dayLabel(ts) });
      }
      out.push({ _type: "msg", ...m, ts });
      lastTs = ts;
    }
    return out;
  }, [messages]);

  // Helper: are we near the bottom?
  const nearBottom = (el) =>
    el.scrollHeight - el.scrollTop - el.clientHeight < 80;

  // Track user scrolling: pause follow when scrolled up
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const atBottom = nearBottom(el);
      setFollowing(atBottom);
      setShowJump(!atBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialize
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll to bottom when items change and we're following
  useLayoutEffect(() => {
  const el = scrollerRef.current;
  if (!el || !following) return;
  requestAnimationFrame(() => {
    el.scrollTop = el.scrollHeight;   // гарантовано в самий низ
  });
}, [messages, following]);

  const jumpToLatest = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setFollowing(true);
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="dm-scroll" ref={scrollerRef}>
      <div className="dm-scroll-iner">
      {items.map((it) =>
        it._type === "date" ? (
          <div key={it.id} className="dm-date"><span>{it.label}</span></div>
        ) : (
          <div key={it.id} className={`dm-msg ${it.mine ? "mine" : ""}`}>
            {!it.mine && <div className="dm-avatar">{it.from}</div>}
            <div className="dm-bubble">
              <div className="dm-meta">
                <strong>{it.author}</strong>
                <span className="cw-muted"> · {it.time}</span>
              </div>
              <div>{it.text}</div>
              {!it.mine && (it.reactions?.thumbs || it.reactions?.ack) && (
                <div className="dm-reactions">
                  {it.reactions.thumbs ? <span>👍 {it.reactions.thumbs}</span> : null}
                  {it.reactions.ack ? <span>✅ {it.reactions.ack}</span> : null}
                </div>
              )}
            </div>
            {it.mine && <div className="dm-avatar dm-me">U</div>}
          </div>
        )
      )}
       </div>
      <div ref={endRef} />

     {showJump && (
  <button className="dm-jump-latest" onClick={jumpToLatest}>
    ↓ New messages
  </button>
)}
</div>
  );
}
