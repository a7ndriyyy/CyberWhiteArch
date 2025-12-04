import React from "react";


export default function DmHeader({
  initials, 
   guard,  setGuard,
  vanishOn, vanishText, onToggleVanish,
  e2eKey,  panelOpen,
  railOpen,
  onTogglePanel,
  onToggleRail,
}) {
  return (
    <header className="dm-top cw-card">
   <div className="dm-top-left">
        {/* TOGGLE A: profile / friends rail */}
        <button
          type="button"
          className="dm-top-chip"
          onClick={onToggleRail}
        >
          ☰ {railOpen ? "Hide menu" : "Menu"}
        </button>

        {/* TOGGLE B: chats list */}
        <button
          type="button"
          className="dm-top-chip"
          onClick={onTogglePanel}
        >
          💬 {panelOpen ? "Hide chats" : "Show chats"}
        </button>

        {/* existing avatar + chat name */}
        <div className="dm-top-chat">
          <div className="dm-avatar dm-me">{initials}</div>
          <div>
            <div>{name}</div>
          </div>
        </div>
      </div>

      <div className="dm-top-right">
        <button className="cw-pill">🔐 E2E</button>
      </div>

      <div className="dm-top-row">
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
