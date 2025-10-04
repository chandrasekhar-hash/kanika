import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Card from "../components/Card";
import ChartWrapper from "../components/ChartWrapper";
import LeaderboardRow from "../components/LeaderboardRow";
import TimelinePanel from "../components/TimelinePanel";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  aggregateKpis,
  computeLeaderboard,
  formatActivityForChart,
} from "../lib/computations";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const activityLegend = [
  { label: "PR Reviews", color: "#0F62FE" },
  { label: "Docs Updates", color: "#5A4AE3" },
  { label: "Mentoring", color: "#10B981" },
];

const badgeFilters = ["PR HERO", "DOCS MASTER", "COMMUNITY MENTOR", "ALL-ROUNDER"];

function DashboardPage() {
  const router = useRouter();
  const timeframe = (router.query.timeframe ?? "30d").toString();
  const { data, loading, error } = useDashboardData(timeframe);
  const [stackMode, setStackMode] = useState("stacked");

  const kpis = useMemo(() => {
    if (!data) return [];
    return aggregateKpis(data.contributors);
  }, [data]);

  const leaderboard = useMemo(() => {
    if (!data) return [];
    return computeLeaderboard(data.contributors).slice(0, 5);
  }, [data]);

  const activitySeries = useMemo(() => {
    if (!data) return [];
    const formatted = formatActivityForChart(data.activity_timeline);
    return formatted.map((item) => ({
      date: item.date,
      pr: item.pr_review,
      docs: item.docs_update,
      mentoring: item.mentoring,
    }));
  }, [data]);

  const activityFeed = useMemo(() => {
    if (!data) return [];
    return data.activity_timeline.slice(0, 6).map((entry) => {
      const contributor = data.contributors.find((person) => person.id === entry.contributor);
      return {
        id: `${entry.type}-${entry.date}-${entry.contributor}`,
        title: `${contributor?.name ?? "Contributor"} ${entry.type.replace("_", " ")}`,
        summary: `${entry.count} updates`;
      };
    });
  }, [data]);

  const timelinePreview = useMemo(() => {
    if (!data) return [];
    return data.activity_timeline.slice(0, 4).map((entry, index) => ({
      id: `timeline-${entry.date}-${index}`,
      date: entry.date,
      repo: "builder/maintainer-dashboard",
      title: `Activity: ${entry.type}`,
      summary: `${entry.count} actions recorded`,
      type: entry.type,
      link: "#",
    }));
  }, [data]);

  return (
    <div className="layout-grid">
      <section className="layout-primary">
        {loading && <p>Loading maintainer insights…</p>}
        {error && <p role="alert">Failed to load data.</p>}
        {!loading && !error && (
          <>
            <div className="card-grid">
              {kpis.map((card) => (
                <Card
                  key={card.id}
                  title={card.title}
                  value={card.value}
                  suffixText={card.suffix}
                  trend={card.trend}
                />
              ))}
            </div>
            <ChartWrapper
              title="Weekly activity"
              description="Stacked view of pull requests, docs, and mentoring throughput"
              legend={activityLegend}
              toolbar={
                <div className="toolbar-actions">
                  <button
                    type="button"
                    className={`quick-filter${stackMode === "stacked" ? " active" : ""}`}
                    onClick={() => setStackMode("stacked")}
                  >
                    Stacked
                  </button>
                  <button
                    type="button"
                    className={`quick-filter${stackMode === "grouped" ? " active" : ""}`}
                    onClick={() => setStackMode("grouped")}
                  >
                    Grouped
                  </button>
                </div>
              }
              accessibleSummary="Timeline of maintainer productivity across PRs, documentation, and mentoring"
            >
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={activitySeries} stackOffset={stackMode === "stacked" ? "expand" : "none"}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EE" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="pr" stackId={stackMode === "stacked" ? "activity" : undefined} stroke="#0F62FE" fill="#0F62FE" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="docs" stackId={stackMode === "stacked" ? "activity" : undefined} stroke="#5A4AE3" fill="#5A4AE3" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="mentoring" stackId={stackMode === "stacked" ? "activity" : undefined} stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </>
        )}
      </section>
      <aside className="layout-secondary">
        <section className="section-card">
          <h2 className="section-title">Top Maintainers</h2>
          <div className="leaderboard-preview" role="table" aria-label="Top 5 maintainers">
            {leaderboard.map((row) => (
              <LeaderboardRow
                key={row.contributor.id}
                rank={row.rank}
                avatar={row.contributor.avatar}
                name={row.contributor.name}
                handle={row.contributor.handle}
                prCount={row.contributor.prs_reviewed}
                docsCount={row.contributor.docs_updated}
                mentorCount={row.contributor.mentoring}
                points={row.points}
                badges={row.badges}
              />
            ))}
          </div>
        </section>
        <section className="section-card">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-feed">
            {activityFeed.map((item) => (
              <div key={item.id} className="activity-item">
                <span className="activity-indicator" aria-hidden="true" />
                <div>
                  <p className="activity-title">{item.title}</p>
                  <p className="stat-caption">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="section-card">
          <h2 className="section-title">Quick Filters</h2>
          <div className="quick-filter-group">
            {badgeFilters.map((filter) => (
              <button key={filter} className="quick-filter" type="button">
                {filter}
              </button>
            ))}
          </div>
        </section>
        <TimelinePanel title="Maintainer timeline" items={timelinePreview} />
      </aside>
    </div>
  );
}

export default DashboardPage;