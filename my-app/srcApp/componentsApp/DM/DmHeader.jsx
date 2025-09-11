import React from "react";


export default function DmHeader({
  name, initials, lastSeen,
  verified, guard, setVerified, setGuard,
  vanishOn, vanishText, onToggleVanish,
  e2eKey,onTogglePanel,
}) {
  return (
    <header className="dm-top cw-card">
      <div className="dm-top-left">
        <button className="cw-chip" onClick={onTogglePanel}>☰ Chats</button>
        <div className="pair">
          <div className="badge">CW</div>
          <div className="badge badge--mint">{initials}</div>
        </div>
        <div>
          <strong>{name}</strong>
          <div className="cw-muted">Last seen · {lastSeen}</div>
        </div>
      </div>

      <div className="dm-top-right">
        <button className="cw-pill">🔐 E2E</button>
      </div>

      <div className="dm-top-row">
        <button className="cw-pill" onClick={() => setVerified(!verified)}>
          {verified ? "Verified Contact" : "Verify Contact"}
        </button>
        <button className="cw-pill" onClick={onToggleVanish}>
          Vanish: {vanishOn ? vanishText : "Off"}
        </button>
        <button className="cw-pill" onClick={() => setGuard(!guard)}>
          Screenshot Guard: {guard ? "On" : "Off"}
        </button>

        <div className="e2e-key">Key: {e2eKey}</div>
      </div>
    </header>
  );
}
