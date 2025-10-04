import React, { useEffect, useMemo, useRef, useState } from "react";

const ICONS = {
  pr: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3a4 4 0 0 1 1.5 7.71v2.58a4.01 4.01 0 1 1-3 0V10.7A4 4 0 0 1 7 3Zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 7 5Zm10-2a4 4 0 0 1 1.94 7.49 4 4 0 0 1-2.94 5.94V19h1.5a1 1 0 1 1 0 2H9.5a1 1 0 1 1 0-2H11v-2.57a4.01 4.01 0 0 1-2.94-5.94A4 4 0 0 1 17 3Zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 17 5Z" />
    </svg>
  ),
  docs: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2h7.4a1 1 0 0 1 .7.29l4.6 4.59a1 1 0 0 1 .3.71V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.41V7h3.59ZM7 20h10V9a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1Zm2.5-8h5a1 1 0 1 1 0 2h-5a1 1 0 0 1 0-2Zm0 4h3a1 1 0 1 1 0 2h-3a1 1 0 1 1 0-2Z" />
    </svg>
  ),
  mentor: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a5 5 0 0 1 4.78 6.53 4.001 4.001 0 0 1-2.44 6.91A6.99 6.99 0 0 1 19 21a1 1 0 1 1-2 0 5 5 0 0 0-10 0 1 1 0 1 1-2 0 6.99 6.99 0 0 1 4.66-6.56 4 4 0 0 1-2.44-6.91A5 5 0 0 1 12 2Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  ),
  allRounder: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11.73a4.5 4.5 0 1 1-2 3.77V12h-3.05a4 4 0 1 1-5.9 0H5Zm2 2v5h3.05a4 4 0 0 1 4.9 0H18V4H7Zm10 14a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
    </svg>
  ),
};

const defaultIconFor = (id) => {
  if (id.includes("pr")) return ICONS.pr;
  if (id.includes("docs")) return ICONS.docs;
  if (id.includes("mentor")) return ICONS.mentor;
  return ICONS.allRounder;
};

const BadgeGrid = ({ badges, onBadgeSelect }) => {
  const [activeBadge, setActiveBadge] = useState(null);
  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (activeBadge) {
      closeButtonRef.current?.focus();
    }
  }, [activeBadge]);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        setActiveBadge(null);
      }
    }
    if (activeBadge) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
    return undefined;
  }, [activeBadge]);

  const modalRecipients = useMemo(() => {
    if (!activeBadge) return [];
    return activeBadge.earnedBy || [];
  }, [activeBadge]);

  return (
    <>
      <div className="badge-grid" role="list">
        {badges.map((badge) => (
          <button
            type="button"
            key={badge.id}
            className="badge-card"
            onClick={() => {
              setActiveBadge(badge);
              onBadgeSelect?.(badge);
            }}
            aria-label={`${badge.title} badge details`}
          >
            <div className="badge-icon">{badge.icon ?? defaultIconFor(badge.id)}</div>
            <div className="badge-content">
              <h3 className="badge-title">{badge.title}</h3>
              <p className="badge-threshold">Threshold: {badge.threshold}</p>
              <p className="badge-description">{badge.description}</p>
            </div>
          </button>
        ))}
      </div>
      {activeBadge && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`${activeBadge.title} recipients`}>
          <div className="modal" ref={modalRef}>
            <div className="modal-header">
              <div>
                <h3 className="section-title">{activeBadge.title}</h3>
                <p className="stat-caption">Threshold: {activeBadge.threshold}</p>
              </div>
              <button
                type="button"
                ref={closeButtonRef}
                className="modal-close"
                onClick={() => setActiveBadge(null)}
              >
                Close
              </button>
            </div>
            <div className="modal-body">
              <p className="badge-description">{activeBadge.description}</p>
              <ul className="recipient-list">
                {modalRecipients.map((recipient) => (
                  <li key={recipient.handle} className="recipient-item">
                    <div className="recipient-meta">
                      <span className="recipient-name">{recipient.name}</span>
                      <span className="recipient-handle">@{recipient.handle}</span>
                    </div>
                    <ul className="evidence-list">
                      {recipient.evidence.map((item) => (
                        <li key={item.link}>
                          <a href={item.link} target="_blank" rel="noreferrer" className="timeline-link">
                            {item.date} — {item.summary}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BadgeGrid;
