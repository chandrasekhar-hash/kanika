import React from "react";

/**
 * Generic chart container with toolbar, legend, and accessible description.
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {{label: string, color: string, active?: boolean}[]} [props.legend]
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.toolbar]
 * @param {string} [props.accessibleSummary]
 */
const ChartWrapper = ({ title, description, legend = [], children, toolbar, accessibleSummary }) => {
  return (
    <section className="chart-wrapper" aria-labelledby={`${title.replace(/\s+/g, "-").toLowerCase()}-heading`}>
      <div className="chart-toolbar">
        <div className="chart-heading">
          <h3 id={`${title.replace(/\s+/g, "-").toLowerCase()}-heading`} className="section-title">
            {title}
          </h3>
          {description && <p className="stat-caption">{description}</p>}
        </div>
        {toolbar && <div className="toolbar-actions">{toolbar}</div>}
      </div>
      {accessibleSummary && (
        <p className="sr-only" role="note">
          {accessibleSummary}
        </p>
      )}
      <div className="chart-canvas" role="img" aria-label={`${title} visualization`}>
        {children}
      </div>
      {legend.length > 0 && (
        <div className="chart-legend" role="list">
          {legend.map((item) => (
            <span key={item.label} className="legend-item" role="listitem">
              <span
                className="legend-swatch"
                style={{ background: item.color, opacity: item.active === false ? 0.4 : 1 }}
              />
              <span>{item.label}</span>
            </span>
          ))}
        </div>
      )}
    </section>
  );
};

export default ChartWrapper;
