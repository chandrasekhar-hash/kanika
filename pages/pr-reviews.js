import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartWrapper from "../components/ChartWrapper";
import ContributorModal from "../components/ContributorModal";
import { useDashboardData } from "../hooks/useDashboardData";
import { buildReviewTimeline, contributorReviewRows } from "../lib/computations";

const sorters = {
  prs_reviewed: (a, b) => b.contributor.prs_reviewed - a.contributor.prs_reviewed,
  avg_time: (a, b) => parseFloat(a.avgReviewTime) - parseFloat(b.avgReviewTime),
  approvals: (a, b) => b.approvals - a.approvals,
};

function PrReviewsPage() {
  const router = useRouter();
  const timeframe = (router.query.timeframe ?? "30d").toString();
  const { data, loading, error } = useDashboardData(timeframe);
  const [sortKey, setSortKey] = useState("prs_reviewed");
  const [activeContributor, setActiveContributor] = useState(null);

  const reviewRows = useMemo(() => {
    if (!data) return [];
    const rows = contributorReviewRows(data.contributors);
    return [...rows].sort(sorters[sortKey] ?? sorters.prs_reviewed);
  }, [data, sortKey]);

  const barData = useMemo(() => {
    if (!data) return [];
    return data.contributors
      .map((contributor) => ({
        name: contributor.name,
        reviews: contributor.prs_reviewed,
        lastReview: data.activity_timeline
          .filter((item) => item.type === "pr_review" && item.contributor === contributor.id)
          .slice(-1)[0]?.date,
      }))
      .sort((a, b) => b.reviews - a.reviews);
  }, [data]);

  const activeTimeline = useMemo(() => {
    if (!data || !activeContributor) return [];
    return buildReviewTimeline(activeContributor.id, data.activity_timeline);
  }, [activeContributor, data]);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h1 className="section-title">PR Reviews</h1>
          <p className="stat-caption">Timeframe: {timeframe.toUpperCase()}</p>
        </div>
        <div className="toolbar-actions">
          <label htmlFor="sort-key" className="stat-caption">
            Sort by
          </label>
          <select id="sort-key" value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
            <option value="prs_reviewed">PRs Reviewed</option>
            <option value="avg_time">Avg Review Time</option>
            <option value="approvals">Approvals</option>
          </select>
        </div>
      </header>
      {loading && <p>Loading PR review analytics…</p>}
      {error && <p role="alert">Unable to load PR review data.</p>}
      {!loading && !error && data && (
        <div className="layout-grid">
          <section className="layout-primary">
            <ChartWrapper
              title="Reviews per contributor"
              description="Interactive bar chart with hover tooltips"
              legend={[{ label: "PR Reviews", color: "#0F62FE" }]}
              accessibleSummary="Bar chart listing each contributor and the total number of pull request reviews they completed"
            >
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={barData} margin={{ top: 16, right: 16, left: 16, bottom: 32 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EE" />
                  <XAxis dataKey="name" angle={-30} textAnchor="end" height={80} />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    formatter={(value, name, props) => [value, "PR Reviews"]}
                    labelFormatter={(label, payload) => {
                      const last = payload[0]?.payload?.lastReview;
                      return `${label} — Last review ${last ?? "No data"}`;
                    }}
                  />
                  <Bar dataKey="reviews" fill="#0F62FE" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </section>
          <aside className="layout-secondary">
            <div className="section-card">
              <h2 className="section-title">Review Table</h2>
              <table className="data-table" role="grid">
                <thead>
                  <tr>
                    <th scope="col">Contributor</th>
                    <th scope="col">PRs Reviewed</th>
                    <th scope="col">Avg Review Time</th>
                    <th scope="col">Approvals</th>
                    <th scope="col">Comments</th>
                    <th scope="col" aria-label="Actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reviewRows.map((row) => (
                    <tr key={row.contributor.id}>
                      <td>
                        <div className="contributor-identity">
                          <img
                            src={row.contributor.avatar}
                            alt={`${row.contributor.name} avatar`}
                            className="contributor-avatar"
                            width="40"
                            height="40"
                          />
                          <div className="contributor-copy">
                            <span className="contributor-name">{row.contributor.name}</span>
                            <span className="contributor-handle">@{row.contributor.handle}</span>
                          </div>
                        </div>
                      </td>
                      <td>{row.contributor.prs_reviewed}</td>
                      <td>{row.avgReviewTime}</td>
                      <td>{row.approvals}</td>
                      <td>{row.comments}</td>
                      <td>
                        <div className="table-actions">
                          <button type="button" onClick={() => setActiveContributor(row.contributor)}>
                            View detail
                          </button>
                          <button type="button">Open repo</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      )}
      <ContributorModal
        contributor={activeContributor}
        timeline={activeTimeline}
        onClose={() => setActiveContributor(null)}
        onCompare={() => router.push(`/leaderboard?compare=${activeContributor?.id ?? ""}`)}
      />
    </div>
  );
}

export default PrReviewsPage;
