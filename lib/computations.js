export function aggregateKpis(contributors) {
  const totals = contributors.reduce(
    (acc, contributor) => {
      acc.prReviews += contributor.prs_reviewed;
      acc.docsUpdates += contributor.docs_updated;
      acc.mentorship += contributor.mentoring;
      acc.impactedUsers += contributor.usage_impact;
      return acc;
    },
    { prReviews: 0, docsUpdates: 0, mentorship: 0, impactedUsers: 0 }
  );

  return [
    {
      id: "prReviews",
      title: "Total PR Reviews",
      value: totals.prReviews,
      suffix: "30d",
      trend: { direction: "increase", value: 12.3 },
    },
    {
      id: "docsUpdates",
      title: "Total Docs Updates",
      value: totals.docsUpdates,
      suffix: "30d",
      trend: { direction: "increase", value: 5.1 },
    },
    {
      id: "mentorship",
      title: "Mentorship Sessions",
      value: totals.mentorship,
      suffix: "Verified",
      trend: { direction: "increase", value: 8.6 },
    },
    {
      id: "impact",
      title: "Total Impacted Users",
      value: totals.impactedUsers,
      suffix: "Across repos",
      trend: { direction: "decrease", value: 2.4 },
    },
  ];
}

export function computeLeaderboard(contributors) {
  return contributors
    .map((contributor, index) => {
      const points =
        contributor.prs_reviewed * 3 +
        contributor.issues_triaged * 2 +
        contributor.docs_updated * 2.5 +
        contributor.mentoring * 4;
      const badges = buildBadges(contributor);
      return {
        rank: index + 1,
        points,
        badges,
        contributor,
      };
    })
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function buildBadges(contributor) {
  const badges = [];
  if (contributor.prs_reviewed >= 20) badges.push("PR HERO");
  if (contributor.docs_updated >= 15) badges.push("DOCS MASTER");
  if (contributor.mentoring >= 10) badges.push("COMMUNITY MENTOR");
  const points =
    contributor.prs_reviewed * 3 +
    contributor.issues_triaged * 2 +
    contributor.docs_updated * 2.5 +
    contributor.mentoring * 4;
  if (points >= 100) badges.push("ALL-ROUNDER");
  return badges;
}

export function weeklyActivityTimeline(activityTimeline) {
  return activityTimeline.reduce((acc, item) => {
    const existing = acc[item.date] ?? { date: item.date, pr_review: 0, docs_update: 0, mentoring: 0 };
    if (item.type === "pr_review") {
      existing.pr_review += item.count;
    } else if (item.type === "docs_update") {
      existing.docs_update += item.count;
    } else if (item.type === "mentoring") {
      existing.mentoring += item.count;
    }
    return { ...acc, [item.date]: existing };
  }, {});
}

export function formatActivityForChart(activityTimeline) {
  const combined = weeklyActivityTimeline(activityTimeline);
  return Object.values(combined).sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function docsDistribution(contributors) {
  const total = contributors.reduce((sum, contributor) => sum + contributor.docs_updated, 0);
  return contributors.map((contributor) => ({
    name: contributor.name,
    value: contributor.docs_updated,
    percent: total ? Number(((contributor.docs_updated / total) * 100).toFixed(1)) : 0,
  }));
}

export function mentorshipTable(contributors) {
  return contributors.map((contributor) => ({
    mentor: contributor.name,
    mentees: contributor.mentoring * 2,
    averageResponse: `${Math.max(1, 24 - contributor.mentoring)} hrs`,
    lastActivity: "2025-09-02",
  }));
}

export function regionImpactData(regions) {
  return regions.map((region) => ({
    code: region.region,
    users: region.users,
  }));
}

export function contributorReviewRows(contributors) {
  return contributors.map((contributor) => ({
    contributor,
    avgReviewTime: `${Math.max(1, 24 - contributor.prs_reviewed / 2)} hrs`,
    approvals: Math.round(contributor.prs_reviewed * 0.6),
    comments: Math.round(contributor.prs_reviewed * 1.4),
  }));
}

export function buildReviewTimeline(contributorId, activityTimeline) {
  return activityTimeline
    .filter((item) => item.type === "pr_review" && item.contributor === contributorId)
    .map((item, index) => ({
      id: `${contributorId}-pr-${index}`,
      date: item.date,
      title: `Reviewed PR batch (${item.count})`,
      summary: `${item.count} approvals and comments delivered`,
      repo: "builder/maintainer-dashboard",
      type: "PR review",
      link: "#",
    }));
}
