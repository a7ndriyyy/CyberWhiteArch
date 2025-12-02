// src/pages/CoverPage/components/CreateToolModal.jsx
import React from "react";
import "./CreateToolModal.css";

export default function CreateToolModal({ open, onClose, onContinue }) {
  if (!open) return null;

  return (
    <div className="cw-modal__backdrop" onClick={onClose}>
      <div
        className="cw-modal cw-card"
        onClick={(e) => e.stopPropagation()} // don't close when clicking inside
      >
        <h2 className="cw-modal__title">Before you create a tool</h2>
        <p className="cw-modal__text">
          Tools are scanned by our antivirus pipeline. Creating or uploading
          malicious content will get you banned.
        </p>

        <ul className="cw-modal__list">
          <li>Do <strong>not</strong> create malware, botnets, RATs, or loaders.</li>
          <li>Do <strong>not</strong> upload intentionally infected files or backdoored binaries.</li>
          <li>All uploads may be analysed by our AV and security systems.</li>
          <li>Violations can result in a <strong>permanent ban</strong> from the site.</li>
        </ul>

        <div className="cw-modal__actions">
          <button
            type="button"
            className="cw-btn cw-btn--ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cw-btn cw-btn--primary"
            onClick={onContinue}
          >
            I understand, continue
          </button>
        </div>
      </div>
    </div>
  );
}
