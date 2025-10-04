import React, { useMemo } from "react";
import { buildSparklinePath } from "../utils/sparkline";

/**
 * Leaderboard row rendering contributor stats.
 * @param {Object} props
 * @param {number} props.rank
 * @param {string} props.avatar
 * @param {string} props.name
 * @param {string} props.handle
 * @param {number} props.prCount
 * @param {number} props.docsCount
 * @param {number} props.mentorCount
 * @param {number} props.points
 * @param {string[]} props.badges
 * @param {number[]} [props.trendData]
 * @param {boolean} [props.selectedForCompare]
 * @param {function} [props.onToggleCompare]
 * @param {function} [props.onViewTimeline]
 * @param {function} [props.onAwardBadge]
 */
const LeaderboardRow = ({
  rank,
  avatar,
  name,
  handle,
  prCount,
  docsCount,
  mentorCount,
  points,
  badges,
  trendData = [],
  selectedForCompare = false,
  onToggleCompare,
  onViewTimeline,
  onAwardBadge,
}) => {
  const medalClass = rank === 1 ? "" : rank === 2 ? " silver" : rank === 3 ? " bronze" : " neutral";
  const trendPaths = useMemo(() => buildSparklinePath(trendData, 120, 40), [trendData]);

  return (
    <div className="leaderboard-row" role="row">
      <div className="leaderboard-cell rank">
        <span className={`rank-medal${medalClass}`} aria-label={`Rank ${rank}`}>
          {rank}
        </span>
      </div>
      <div className="leaderboard-cell contributor">
        <div className="contributor-identity">
          <img src={avatar} alt={`${name} avatar`} className="contributor-avatar" width="40" height="40" />
          <div className="contributor-copy">
            <span className="contributor-name">{name}</span>
            <span className="contributor-handle">@{handle}</span>
          </div>
        </div>
      </div>
      <div className="leaderboard-cell stat" aria-label="PR reviews count">
        {prCount}
      </div>
      <div className="leaderboard-cell stat" aria-label="Docs updates count">
        {docsCount}
      </div>
      <div className="leaderboard-cell stat" aria-label="Mentoring sessions">
        {mentorCount}
      </div>
      <div className="leaderboard-cell stat" aria-label="Total points">
        {points.toFixed(1)}
      </div>
      <div className="leaderboard-cell badges" aria-label="Badges earned">
        <ul className="badge-list" aria-label={`${name} badges`}>
          {badges.map((badge) => (
            <li key={badge} className="badge-chip">
              {badge}
            </li>
          ))}
        </ul>
      </div>
      <div className="leaderboard-cell trend">
        {trendPaths.linePath ? (
          <svg className="trend-sparkline" viewBox="0 0 120 40" role="img" aria-label={`${name} points trend`}>
            <path className="sparkline-area" d={trendPaths.areaPath} />
            <path className="sparkline-line" d={trendPaths.linePath} />
          </svg>
        ) : (
          <span className="stat-caption">No trend</span>
        )}
      </div>
      <div className="leaderboard-cell actions" role="cell">
        <label className="compare-checkbox">
          <input
            type="checkbox"
            checked={selectedForCompare}
            onChange={() => onToggleCompare?.()}
            aria-label={`Compare ${name}`}
          />
          <span>Compare</span>
        </label>
        <div className="row-actions">
          <button type="button" onClick={onViewTimeline} aria-label={`View ${name} timeline`}>
            View timeline
          </button>
          <button type="button" onClick={onAwardBadge} aria-label={`Award badge to ${name}`}>
            Award badge
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardRow;
