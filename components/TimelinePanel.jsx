import React from "react";

const TimelinePanel = ({ title, description, items = [], onPaginate, hasMore, onCompare }) => {
  return (
    <aside className="timeline-panel" aria-label={`${title} timeline`}>
      <header>
        <h2 className="timeline-title">{title}</h2>
        {description && <p className="timeline-description">{description}</p>}
      </header>
      <div className="timeline-list" role="list">
        {items.map((item) => (
          <article key={item.id} className="timeline-item" role="listitem">
            <div className="timeline-marker" aria-hidden="true" />
            <div className="timeline-content">
              <div className="timeline-meta">
                <time dateTime={item.date}>{item.date}</time>
                <span>{item.repo}</span>
              </div>
              <h3 className="timeline-title">{item.title}</h3>
              <p className="timeline-description">{item.summary}</p>
              <div className="timeline-footer">
                <a href={item.link} className="timeline-link" target="_blank" rel="noreferrer">
                  Open item
                </a>
                <span className="timeline-tag">{item.type}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <footer className="timeline-footer">
        {onCompare && (
          <button type="button" onClick={onCompare} className="quick-filter">
            Compare contributors
          </button>
        )}
        {hasMore && (
          <button type="button" onClick={onPaginate} className="quick-filter">
            Load more
          </button>
        )}
      </footer>
    </aside>
  );
};

export default TimelinePanel;
