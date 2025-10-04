import React, { useMemo } from "react";
import { useRouter } from "next/router";
import BadgeGrid from "../components/BadgeGrid";
import { useDashboardData } from "../hooks/useDashboardData";
import { computeLeaderboard } from "../lib/computations";

const BADGE_DEFINITIONS = [
  {
    id: "pr-hero",
    title: "PR HERO",
    description: "Awarded for reviewing at least 20 pull requests within the selected timeframe.",
    threshold: "≥ 20 PR reviews",
  },
  {
    id: "docs-master",
    title: "DOCS MASTER",
    description: "Awarded for completing 15 or more documentation updates.",
    threshold: "≥ 15 docs updates",
  },
  {
    id: "community-mentor",
    title: "COMMUNITY MENTOR",
    description: "Awarded for contributing 10 mentorship sessions.",
    threshold: "≥ 10 mentorship sessions",
  },
  {
    id: "all-rounder",
    title: "ALL-ROUNDER",
    description: "Awarded for reaching 100 total contribution points.",
    threshold: "≥ 100 total points",
  },
];

function BadgesPage() {
  const router = useRouter();
  const timeframe = (router.query.timeframe ?? "30d").toString();
  const { data, loading, error } = useDashboardData(timeframe);

  const badgeData = useMemo(() => {
    if (!data) return [];
    const leaderboard = computeLeaderboard(data.contributors);
    return BADGE_DEFINITIONS.map((badge) => {
      const earnedBy = leaderboard
        .filter((entry) => entry.badges.includes(badge.title))
        .map((entry) => ({
          name: entry.contributor.name,
          handle: entry.contributor.handle,
          evidence: [
            {
              link: "#",
              date: "2025-09-12",
              summary: `${badge.title} performance confirmed`,
            },
          ],
        }));
      return {
        ...badge,
        threshold: badge.threshold,
        earnedBy,
      };
    });
  }, [data]);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h1 className="section-title">Badges / Recognition</h1>
          <p className="stat-caption">Timeframe: {timeframe.toUpperCase()}</p>
        </div>
      </header>
      {loading && <p>Loading badge achievements…</p>}
      {error && <p role="alert">Unable to load badge data.</p>}
      {!loading && !error && data && (
        <section className="section-card">
          <BadgeGrid badges={badgeData} />
        </section>
      )}
    </div>
  );
}

export default BadgesPage;
