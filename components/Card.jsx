import React, { useMemo } from "react";
import { buildSparklinePath, SPARKLINE_BOUNDS } from "../utils/sparkline";

/**
 * @typedef {Object} CardTrend
 * @property {number} value Percentage change value.
 * @property {"increase"|"decrease"} direction Direction of the trend.
 */

/**
 * Metric card component with optional sparkline and trend indicator.
 * @param {Object} props
 * @param {string} props.title
 * @param {string|number} props.value
 * @param {number[]} [props.sparklineData]
 * @param {string} [props.suffixText]
 * @param {CardTrend} [props.trend]
 * @param {Function} [props.onClick]
 */
const Card = ({
  title,
  value,
  sparklineData = [],
  suffixText,
  trend,
  onClick,
}) => {
  const paths = useMemo(() => buildSparklinePath(sparklineData), [sparklineData]);
  const hasSparkline = Boolean(paths.linePath);
  const trendClassName = trend?.direction === "decrease" ? "trend-negative" : "trend-positive";
  const trendLabel = trend?.direction === "decrease" ? "Decrease" : "Increase";

  return (
    <article
      className="metric-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      aria-pressed="false"
      aria-label={`${title} card`}
    >
      <div className="card-header">
        <h3>{title}</h3>
        {trend && (
          <span className={trendClassName} aria-label={`${trendLabel} of ${trend.value}%`}>
            {trend.direction === "decrease" ? "▼" : "▲"}
            {Math.abs(trend.value).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="metric-value" aria-live="polite">
        {value}
      </div>
      {suffixText && <p className="stat-caption">{suffixText}</p>}
      {hasSparkline && (
        <svg
          className="sparkline"
          role="img"
          aria-label={`${title} trend sparkline`}
          focusable="false"
          viewBox={`0 0 ${SPARKLINE_BOUNDS.width} ${SPARKLINE_BOUNDS.height}`}
        >
          <path className="sparkline-area" d={paths.areaPath} />
          <path className="sparkline-line" d={paths.linePath} />
        </svg>
      )}
    </article>
  );
};

export default Card;
