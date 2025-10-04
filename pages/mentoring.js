import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Card from "../components/Card";
import ChartWrapper from "../components/ChartWrapper";
import TimelinePanel from "../components/TimelinePanel";
import { useDashboardData } from "../hooks/useDashboardData";
import { aggregateKpis, mentorshipTable } from "../lib/computations";

const verificationMessages = [
  {
    id: "thread-1",
    mentor: "Chandrasekhar",
    mentee: "@newContributor",
    summary: "Guided through first PR review checklist",
    time: "2025-09-05",
  },
  {
    id: "thread-2",
    mentor: "Kanika",
    mentee: "@docwriter",
    summary: "Improved documentation contribution standards",
    time: "2025-09-07",
  },
  {
    id: "thread-3",
    mentor: "Maya",
    mentee: "@junior-dev",
    summary: "Supported triage process setup",
    time: "2025-09-09",
  },
];

function MentoringPage() {
  const router = useRouter();
  const timeframe = (router.query.timeframe ?? "30d").toString();
  const { data, loading, error } = useDashboardData(timeframe);
  const [verifiedThreads, setVerifiedThreads] = useState(new Set());

  const cards = useMemo(() => {
    if (!data) return [];
    return aggregateKpis(data.contributors).filter((card) => ["mentorship", "impact"].includes(card.id));
  }, [data]);

  const mentoringRows = useMemo(() => {
    if (!data) return [];
    return mentorshipTable(data.contributors);
  }, [data]);

  const mentoringTimeline = useMemo(() => {
    if (!data) return [];
    return data.activity_timeline
      .filter((item) => item.type === "mentoring")
      .slice(0, 6)
      .map((item, index) => ({
        id: `mentoring-${item.date}-${index}`,
        date: item.date,
        repo: "Guidance",
        title: `Mentoring session with ${item.contributor}`,
        summary: `${item.count} mentees supported`,
        type: "Mentoring",
        link: "#",
      }));
  }, [data]);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h1 className="section-title">Mentoring / Guidance</h1>
          <p className="stat-caption">Timeframe: {timeframe.toUpperCase()}</p>
        </div>
      </header>
      {loading && <p>Loading mentoring metrics…</p>}
      {error && <p role="alert">Unable to load mentoring data.</p>}
      {!loading && !error && data && (
        <div className="layout-grid">
          <section className="layout-primary">
            <div className="card-grid">
              {cards.map((card) => (
                <Card key={card.id} title={card.title} value={card.value} suffixText={card.suffix} trend={card.trend} />
              ))}
            </div>
            <section className="section-card">
              <h2 className="section-title">Mentorship interactions</h2>
              <table className="data-table" role="grid">
                <thead>
                  <tr>
                    <th scope="col">Mentor</th>
                    <th scope="col">Mentees Helped</th>
                    <th scope="col">Avg Response</th>
                    <th scope="col">Last Activity</th>
                    <th scope="col">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {mentoringRows.map((row) => (
                    <tr key={row.mentor}>
                      <td>{row.mentor}</td>
                      <td>{row.mentees}</td>
                      <td>{row.averageResponse}</td>
                      <td>{row.lastActivity}</td>
                      <td>
                        <label className="quick-filter">
                          <input
                            type="checkbox"
                            checked={verifiedThreads.has(row.mentor)}
                            onChange={(event) => {
                              setVerifiedThreads((prev) => {
                                const next = new Set(prev);
                                if (event.target.checked) {
                                  next.add(row.mentor);
                                } else {
                                  next.delete(row.mentor);
                                }
                                return next;
                              });
                            }}
                          />
                          <span>{verifiedThreads.has(row.mentor) ? "Verified" : "Verify"}</span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </section>
          <aside className="layout-secondary">
            <section className="section-card">
              <h2 className="section-title">Support threads</h2>
              <ul className="mentoring-thread-list">
                {verificationMessages.map((thread) => (
                  <li key={thread.id} className="mentoring-thread">
                    <div className="thread-header">
                      <span className="thread-mentor">{thread.mentor}</span>
                      <time dateTime={thread.time} className="stat-caption">
                        {thread.time}
                      </time>
                    </div>
                    <p className="thread-summary">{thread.summary}</p>
                    <span className="thread-mentee">Mentee {thread.mentee}</span>
                  </li>
                ))}
              </ul>
            </section>
            <TimelinePanel
              title="Mentoring timeline"
              description="Recent mentoring sessions"
              items={mentoringTimeline}
              hasMore={false}
            />
          </aside>
        </div>
      )}
    </div>
  );
}

export default MentoringPage;
