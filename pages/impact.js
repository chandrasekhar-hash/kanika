import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Card from "../components/Card";
import ChartWrapper from "../components/ChartWrapper";
import { useDashboardData } from "../hooks/useDashboardData";
import { impactSummary, projectImpactList, regionImpactData } from "../lib/computations";

const REGION_COLORS = {
  IN: "#0F62FE",
  US: "#5A4AE3",
  EU: "#10B981",
};

const testimonials = [
  {
    id: "impact-1",
    project: "Builder Runtime",
    quote: "Our docs updates reduced onboarding time for new maintainers by 30%.",
  },
  {
    id: "impact-2",
    project: "Design System",
    quote: "Mentoring sessions clarified contribution guidelines for external teams.",
  },
];

function ImpactPage() {
  const router = useRouter();
  const timeframe = (router.query.timeframe ?? "30d").toString();
  const { data, loading, error } = useDashboardData(timeframe);

  const summary = useMemo(() => {
    if (!data) return null;
    return impactSummary(data.contributors, data.impact_by_region);
  }, [data]);

  const projectList = useMemo(() => {
    if (!data) return [];
    return projectImpactList(data.contributors);
  }, [data]);

  const regions = useMemo(() => {
    if (!data) return [];
    return regionImpactData(data.impact_by_region);
  }, [data]);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h1 className="section-title">Usage Impact</h1>
          <p className="stat-caption">Timeframe: {timeframe.toUpperCase()}</p>
        </div>
      </header>
      {loading && <p>Loading usage impact…</p>}
      {error && <p role="alert">Unable to load impact data.</p>}
      {!loading && !error && summary && (
        <>
          <div className="card-grid">
            <Card title="Total Users Impacted" value={summary.totalUsers} suffixText="Across all repos" />
            <Card title="Projects Helped" value={summary.projectsHelped} suffixText="During timeframe" />
            <Card title="Avg Impact / Contributor" value={summary.avgImpact} suffixText="Users each" />
          </div>
          <div className="layout-grid">
            <section className="layout-primary">
              <ChartWrapper
                title="Impact by region"
                description="Regional breakdown of users receiving support"
                legend={regions.map((region) => ({ label: region.code, color: REGION_COLORS[region.code] ?? "#6B7280" }))}
                accessibleSummary="Map visualization highlighting regions IN, US, and EU with corresponding impacted user counts."
              >
                <svg className="impact-map" viewBox="0 0 600 320" role="img" aria-label="Regional impact map">
                  <rect x="0" y="0" width="600" height="320" rx="24" fill="rgba(15, 98, 254, 0.05)" />
                  {regions.map((region, index) => {
                    const position = [
                      { x: 160, y: 140 },
                      { x: 320, y: 120 },
                      { x: 440, y: 150 },
                    ][index] ?? { x: 300, y: 160 };
                    const radius = Math.max(16, Math.sqrt(region.users) / 6);
                    const color = REGION_COLORS[region.code] ?? "#6B7280";
                    return (
                      <g key={region.code}>
                        <circle cx={position.x} cy={position.y} r={radius} fill={color} opacity="0.6" />
                        <text x={position.x} y={position.y} dy={radius + 18} textAnchor="middle" fill="#111827" fontSize="14">
                          {region.code} • {region.users.toLocaleString()} users
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </ChartWrapper>
              <section className="section-card">
                <h2 className="section-title">Affected projects</h2>
                <ul className="project-impact-list">
                  {projectList.map((item) => (
                    <li key={item.id} className="project-impact-item">
                      <h3>{item.project}</h3>
                      <p className="stat-caption">{item.summary}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </section>
            <aside className="layout-secondary">
              <section className="section-card">
                <h2 className="section-title">Testimonials</h2>
                <ul className="testimonial-list">
                  {testimonials.map((item) => (
                    <li key={item.id} className="testimonial-card">
                      <h3>{item.project}</h3>
                      <p className="docs-update-summary">“{item.quote}”</p>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

export default ImpactPage;
