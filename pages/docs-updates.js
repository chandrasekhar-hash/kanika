import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Card from "../components/Card";
import ChartWrapper from "../components/ChartWrapper";
import { useDashboardData } from "../hooks/useDashboardData";
import { aggregateKpis, docsDistribution, docsHighlight, docsUpdateCards } from "../lib/computations";

const DOC_COLORS = ["#0F62FE", "#5A4AE3", "#10B981", "#F59E0B", "#6B7280", "#EF4444"];

function DocsUpdatesPage() {
  const router = useRouter();
  const timeframe = (router.query.timeframe ?? "30d").toString();
  const { data, loading, error } = useDashboardData(timeframe);

  const cards = useMemo(() => {
    if (!data) return [];
    const totals = aggregateKpis(data.contributors);
    return totals.filter((card) => ["docsUpdates", "mentorship", "impact"].includes(card.id));
  }, [data]);

  const distribution = useMemo(() => {
    if (!data) return [];
    return docsDistribution(data.contributors);
  }, [data]);

  const highlight = useMemo(() => {
    if (!data) return null;
    return docsHighlight(data.contributors);
  }, [data]);

  const updateCards = useMemo(() => {
    if (!data) return [];
    return docsUpdateCards(data.activity_timeline, data.contributors);
  }, [data]);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h1 className="section-title">Docs Updates</h1>
          <p className="stat-caption">Timeframe: {timeframe.toUpperCase()}</p>
        </div>
      </header>
      {loading && <p>Loading docs analytics…</p>}
      {error && <p role="alert">Unable to load docs updates.</p>}
      {!loading && !error && data && (
        <div className="layout-grid">
          <section className="layout-primary">
            <div className="card-grid">
              {cards.map((card) => (
                <Card key={card.id} title={card.title} value={card.value} suffixText={card.suffix} trend={card.trend} />
              ))}
            </div>
            <ChartWrapper
              title="Docs contribution share"
              description="Distribution of documentation updates by contributor"
              legend={distribution.map((item, index) => ({ label: `${item.name} (${item.percent}%)`, color: DOC_COLORS[index % DOC_COLORS.length] }))}
              accessibleSummary="Donut chart depicting the percentage share of documentation updates for each contributor"
            >
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={4}
                  >
                    {distribution.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={DOC_COLORS[index % DOC_COLORS.length]}
                        aria-label={`${entry.name}: ${entry.value} updates (${entry.percent} percent)`}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} updates`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
            <section className="section-card">
              <h2 className="section-title">Update log</h2>
              <div className="docs-update-grid">
                {updateCards.map((item) => (
                  <article key={item.id} className="docs-update-card">
                    <header>
                      <h3 className="docs-update-title">{item.title}</h3>
                      <time className="stat-caption" dateTime={item.date}>
                        {item.date}
                      </time>
                    </header>
                    <p className="docs-update-summary">{item.summary}</p>
                    <footer className="docs-update-footer">
                      <span className="stat-caption">by {item.contributor?.name ?? "Unknown"}</span>
                      <a href={item.link} className="timeline-link">
                        View diff
                      </a>
                    </footer>
                  </article>
                ))}
              </div>
            </section>
          </section>
          <aside className="layout-secondary">
            <section className="section-card highlight-card">
              <h2 className="section-title">Most Active Docs Maintainer</h2>
              {highlight ? (
                <div className="highlight-body">
                  <div className="contributor-identity">
                    <img src={highlight.avatar} alt={`${highlight.name} avatar`} className="contributor-avatar" width="48" height="48" />
                    <div className="contributor-copy">
                      <span className="contributor-name">{highlight.name}</span>
                      <span className="contributor-handle">@{highlight.handle}</span>
                    </div>
                  </div>
                  <p className="highlight-metric">
                    {highlight.docsUpdated} updates <span>• {highlight.share}% share</span>
                  </p>
                  <span className="badge-chip">DOCS MASTER</span>
                </div>
              ) : (
                <p className="stat-caption">No documentation activity recorded.</p>
              )}
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}

export default DocsUpdatesPage;
