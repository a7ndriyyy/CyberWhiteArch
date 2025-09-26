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
  const [following, setFollowing] = useState(true);
  const [showJump, setShowJump] = useState(false);

  // Готуємо список з датами
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

  const nearBottom = (el) => el.scrollHeight - el.scrollTop - el.clientHeight < 80;

  // Відстежуємо скрол — якщо користувач не внизу, паузимо follow
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const atBottom = nearBottom(el);
      setFollowing(atBottom);
      setShowJump(!atBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Автопрокрутка донизу, коли з’являються нові елементи і ми "following"
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el || !following) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [items, following]); // ← залежимо від items

  const jumpToLatest = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setFollowing(true);
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="dm-scroll" ref={scrollerRef}>
      <div className="dm-scroll-inner">{/* ВНУТРІШНІЙ flex-контейнер */}
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

                {it.text ? <div>{it.text}</div> : null}

                {/* вкладення: зображення */}
                {it.attachments?.some(a => a.kind === "image") && (
                  <div className="dm-att-grid">
                    {it.attachments.filter(a => a.kind === "image").map(a => (
                      <img key={a.id} className="dm-att-img" src={a.url} alt={a.name} />
                    ))}
                  </div>
                )}

                {/* вкладення: файли */}
                {it.attachments?.some(a => a.kind === "file") && (
                  <div className="dm-att-files">
                    {it.attachments.filter(a => a.kind === "file").map(a => (
                      <a key={a.id} href={a.url} download={a.name} className="dm-file-chip">
                        📎 <span className="dm-file-name">{a.name}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* код-сніпет */}
                {it.code?.content && (
                  <div className="dm-code-block">
                    {it.code.language && <div className="dm-code-tag">{it.code.language}</div>}
                    <pre><code>{it.code.content}</code></pre>
                  </div>
                )}

                {/* реакції тільки для не-mine і якщо є що показати */}
                {!it.mine && (it.reactions?.thumbs || it.reactions?.ack) && (
                  <div className="dm-reactions">
                    {it.reactions?.thumbs ? <span>👍 {it.reactions.thumbs}</span> : null}
                    {it.reactions?.ack ? <span>✅ {it.reactions.ack}</span> : null}
                  </div>
                )}
              </div>

              {it.mine && <div className="dm-avatar dm-me">U</div>}
            </div>
          )
        )}
      </div>

      {showJump && (
        <button className="dm-jump-latest" onClick={jumpToLatest}>
          ↓ New messages
        </button>
      )}
    </div>
  );
}
