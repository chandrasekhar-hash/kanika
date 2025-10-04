import React, { useEffect, useRef } from "react";
import TimelinePanel from "./TimelinePanel";

const ContributorModal = ({ contributor, timeline, onClose, onCompare }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  if (!contributor) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`${contributor.name} details`}>
      <div className="modal contributor-modal">
        <div className="modal-header">
          <div className="contributor-modal-header">
            <img src={contributor.avatar} alt={`${contributor.name} avatar`} width="64" height="64" className="contributor-avatar" />
            <div>
              <h3 className="section-title">{contributor.name}</h3>
              <p className="stat-caption">@{contributor.handle}</p>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} ref={closeButtonRef}>
            Close
          </button>
        </div>
        <div className="modal-body">
          <div className="contributor-stats">
            <div>
              <p className="stat-caption">PR reviews</p>
              <p className="metric-value">{contributor.prs_reviewed}</p>
            </div>
            <div>
              <p className="stat-caption">Docs updates</p>
              <p className="metric-value">{contributor.docs_updated}</p>
            </div>
            <div>
              <p className="stat-caption">Mentoring</p>
              <p className="metric-value">{contributor.mentoring}</p>
            </div>
          </div>
          <TimelinePanel
            title="Review timeline"
            description="Paginated feed of pull request reviews"
            items={timeline}
            hasMore={false}
            onCompare={onCompare}
          />
        </div>
      </div>
    </div>
  );
};

export default ContributorModal;
