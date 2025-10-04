import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import LeaderboardRow from "../components/LeaderboardRow";
import ChartWrapper from "../components/ChartWrapper";
import { useDashboardData } from "../hooks/useDashboardData";
import { computeLeaderboard } from "../lib/computations";

function LeaderboardPage() {
  const router = useRouter();
  const timeframe = (router.query.timeframe ?? "30d").toString();
  const { data, loading, error } = useDashboardData(timeframe);
  const [compare, setCompare] = useState([]);

  const leaderboardEntries = useMemo(() => {
    if (!data) return [];
    return computeLeaderboard(data.contributors).map((entry) => ({
      ...entry,
      trendData: [
        entry.contributor.prs_reviewed,
        entry.contributor.docs_updated,
        entry.contributor.mentoring,
        entry.contributor.issues_triaged,
        entry.contributor.usage_impact / 10,
      ],
    }));
  }, [data]);

  const comparisonSummary = useMemo(() => {
    if (compare.length !== 2 || !data) return null;
    const [firstId, secondId] = compare;
    const first = leaderboardEntries.find((entry) => entry.contributor.id === firstId);
    const second = leaderboardEntries.find((entry) => entry.contributor.id === secondId);
    if (!first || !second) return null;
    return {
      first,
      second,
      delta: (first.points - second.points).toFixed(1),
    };
  }, [compare, data, leaderboardEntries]);

  const handleToggleCompare = (id) => {
    setCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length === 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h1 className="section-title">Leaderboard</h1>
          <p className="stat-caption">Points = PR_reviews × 3 + Issues_triaged × 2 + Docs_updates × 2.5 + Mentoring × 4</p>
        </div>
      </header>
      {loading && <p>Loading leaderboard…</p>}
      {error && <p role="alert">Unable to load ranking data.</p>}
      {!loading && !error && data && (
        <>
          <section className="section-card">
            <div className="leaderboard-table" role="table">
              <div className="leaderboard-header" role="row">
                <span role="columnheader">Rank</span>
                <span role="columnheader">Contributor</span>
                <span role="columnheader">PR Reviews</span>
                <span role="columnheader">Docs Updates</span>
                <span role="columnheader">Mentoring</span>
                <span role="columnheader">Points</span>
                <span role="columnheader">Badges</span>
                <span role="columnheader">Trend</span>
                <span role="columnheader">Actions</span>
              </div>
              {leaderboardEntries.map((entry) => (
                <LeaderboardRow
                  key={entry.contributor.id}
                  rank={entry.rank}
                  avatar={entry.contributor.avatar}
                  name={entry.contributor.name}
                  handle={entry.contributor.handle}
                  prCount={entry.contributor.prs_reviewed}
                  docsCount={entry.contributor.docs_updated}
                  mentorCount={entry.contributor.mentoring}
                  points={entry.points}
                  badges={entry.badges}
                  trendData={entry.trendData}
                  selectedForCompare={compare.includes(entry.contributor.id)}
                  onToggleCompare={() => handleToggleCompare(entry.contributor.id)}
                  onViewTimeline={() => router.push(`/pr-reviews?contributor=${entry.contributor.id}`)}
                  onAwardBadge={() => router.push(`/badges?highlight=${entry.contributor.id}`)}
                />
              ))}
            </div>
          </section>
          {comparisonSummary && (
            <ChartWrapper
              title="Compare contributors"
              description="Quick comparison of contribution points"
              legend={[
                { label: comparisonSummary.first.contributor.name, color: "#0F62FE" },
                { label: comparisonSummary.second.contributor.name, color: "#5A4AE3" },
              ]}
              accessibleSummary={`Comparison shows ${comparisonSummary.first.contributor.name} leading by ${comparisonSummary.delta} points over ${comparisonSummary.second.contributor.name}.`}
            >
              <div className="comparison-grid">
                <div className="comparison-card">
                  <h3>{comparisonSummary.first.contributor.name}</h3>
                  <p className="metric-value">{comparisonSummary.first.points.toFixed(1)}</p>
                </div>
                <div className="comparison-card">
                  <h3>{comparisonSummary.second.contributor.name}</h3>
                  <p className="metric-value">{comparisonSummary.second.points.toFixed(1)}</p>
                </div>
                <div className="comparison-delta">
                  <span className="stat-caption">Point difference</span>
                  <p className="metric-value">{comparisonSummary.delta}</p>
                </div>
              </div>
            </ChartWrapper>
          )}
        </>
      )}
    </div>
  );
}

export default LeaderboardPage;
