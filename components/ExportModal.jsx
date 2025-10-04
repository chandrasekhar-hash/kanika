import React, { useEffect, useRef } from "react";

const DEFAULT_FIELDS = [
  { id: "prs_reviewed", label: "PR Reviews" },
  { id: "docs_updated", label: "Docs Updates" },
  { id: "mentoring", label: "Mentoring Sessions" },
  { id: "issues_triaged", label: "Issues Triaged" },
  { id: "usage_impact", label: "Usage Impact" },
];

const ExportModal = ({ isOpen, onClose, onConfirm, selectedRepos, timeframe }) => {
  const dialogRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      confirmRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Export CSV dialog">
      <div className="modal" ref={dialogRef}>
        <div className="modal-header">
          <h3 className="section-title">Export CSV</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            Cancel
          </button>
        </div>
        <div className="modal-body">
          <p className="stat-caption">Selected timeframe: {timeframe.toUpperCase()}</p>
          <p className="stat-caption">Repositories: {selectedRepos.join(", ")}</p>
          <fieldset className="export-fieldset">
            <legend>Fields to include</legend>
            {DEFAULT_FIELDS.map((field) => (
              <label key={field.id} className="quick-filter active">
                <input type="checkbox" checked readOnly />
                <span>{field.label}</span>
              </label>
            ))}
          </fieldset>
          <button
            type="button"
            className="export-button"
            onClick={onConfirm}
            ref={confirmRef}
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
