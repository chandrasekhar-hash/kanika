import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ExportModal from "./ExportModal";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "home" },
  { href: "/pr-reviews", label: "PR Reviews", icon: "git-pull-request" },
  { href: "/docs-updates", label: "Docs Updates", icon: "book-open" },
  { href: "/mentoring", label: "Mentoring", icon: "users" },
  { href: "/badges", label: "Badges", icon: "award" },
  { href: "/leaderboard", label: "Leaderboard", icon: "trophy" },
  { href: "/impact", label: "Usage Impact", icon: "globe" },
];

const ICON_PATHS = {
  home: "M3 12.75V9.58a1 1 0 0 1 .35-.76l7.5-6.33a1 1 0 0 1 1.3 0l7.5 6.33a1 1 0 0 1 .35.76v3.17a1 1 0 0 1-1 1H16v6.25a1 1 0 0 1-1 1h-3v-5h-2v5H7a1 1 0 0 1-1-1V13.75H4a1 1 0 0 1-1-1Z",
  "git-pull-request": "M7 3a3 3 0 0 1 1 5.83v6.34a3 3 0 1 1-2 0V8.83A3 3 0 0 1 7 3Zm10 0a3 3 0 0 1 1 5.83V14a4 4 0 0 1-4 4h-1v-2h1a2 2 0 0 0 2-2V8.83A3 3 0 0 1 17 3Zm-10 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  "book-open": "M4 4a2 2 0 0 1 2-2h4.5a3.5 3.5 0 0 1 3.11 1.87A3.5 3.5 0 0 1 16.72 2H20a2 2 0 0 1 2 2v14a1 1 0 0 1-1.38.92L16.28 16H12a2 2 0 0 0-2 2v2H6a2 2 0 0 1-2-2Z",
  users: "M6 9a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm12 0a3 3 0 1 1 3-3 3 3 0 0 1-3 3ZM3 17a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v3H3Zm12 3v-3a5.94 5.94 0 0 0-1-3.33 5 5 0 0 1 6 0A5.94 5.94 0 0 0 19 17v3Z",
  award: "M12 2a5 5 0 0 1 1 .1 5 5 0 0 1 4 4.9A5 5 0 1 1 7 7a5 5 0 0 1 4-4.9A5 5 0 0 1 12 2Zm0 7a2 2 0 1 0-2-2 2 2 0 0 0 2 2Zm5.66 5 3.11.62a1 1 0 0 1 .77.74 1 1 0 0 1-.3.94l-2.25 2a1 1 0 0 0-.32.95l.59 3.16a1 1 0 0 1-1.47 1.05L15 21.81l-2.78 1.65a1 1 0 0 1-1.48-1.05l.59-3.16a1 1 0 0 0-.32-.95l-2.25-2a1 1 0 0 1 .47-1.73l3.11-.62a1 1 0 0 0 .74-.52L12 14l1.13-2.28a1 1 0 0 0 .74.52Z",
  trophy: "M5 3h14v3a5 5 0 0 1-4 4.9V12a3 3 0 0 1-2 2.83V17h3a1 1 0 1 1 0 2h-3v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H8a1 1 0 0 1 0-2h3v-1.17A3 3 0 0 1 9 12V10.9A5 5 0 0 1 5 6Z",
  globe: "M12 2a10 10 0 1 1-7.07 2.93A10 10 0 0 1 12 2Zm0 2a7.93 7.93 0 0 0-2 .26V8l2 2 2-2V4.26A7.93 7.93 0 0 0 12 4Zm4.27 1.07A8 8 0 0 1 19.94 11H18a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1h-1l-2 2v2h2a8 8 0 0 0 4.26-13.93ZM6 6.1A8 8 0 0 0 4.06 11H6a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h1l2 2v2H9a8 8 0 0 1-3-6.26Z",
};

const FILTER_OPTIONS = {
  repos: ["builder/maintainer-dashboard", "builder/runtime", "builder/design-system"],
  timeframes: ["7d", "30d", "90d", "all"],
};

const STORAGE_THEME_KEY = "maintainer-dashboard-theme";

function SidebarIcon({ type }) {
  const path = ICON_PATHS[type] ?? ICON_PATHS.home;
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const AppShell = ({ children }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const [repoFilter, setRepoFilter] = useState(() => {
    if (typeof window === "undefined") return FILTER_OPTIONS.repos;
    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get("repos");
    return repoParam ? repoParam.split(",") : FILTER_OPTIONS.repos;
  });
  const [timeframe, setTimeframe] = useState(() => {
    if (typeof window === "undefined") return "30d";
    const params = new URLSearchParams(window.location.search);
    return params.get("timeframe") || "30d";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTheme = window.localStorage.getItem(STORAGE_THEME_KEY);
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("theme-dark", storedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
    window.localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  const updateQueryParams = useCallback(
    (nextRepos, nextTimeframe) => {
      const params = new URLSearchParams(router.query);
      if (nextRepos) {
        params.set("repos", nextRepos.join(","));
      }
      if (nextTimeframe) {
        params.set("timeframe", nextTimeframe);
      }
      router.replace({ pathname: router.pathname, query: Object.fromEntries(params.entries()) }, undefined, {
        shallow: true,
      });
    },
    [router]
  );

  const handleRepoToggle = useCallback(
    (repo) => {
      setRepoFilter((prev) => {
        const exists = prev.includes(repo);
        const updated = exists ? prev.filter((item) => item !== repo) : [...prev, repo];
        updateQueryParams(updated, timeframe);
        return updated;
      });
    },
    [timeframe, updateQueryParams]
  );

  const handleTimeframeChange = useCallback(
    (event) => {
      const value = event.target.value;
      setTimeframe(value);
      updateQueryParams(repoFilter, value);
    },
    [repoFilter, updateQueryParams]
  );

  const isActive = useCallback((href) => {
    if (href === "/") {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  }, [router.pathname]);

  const sidebarClass = collapsed ? "sidebar collapsed" : "sidebar";

  const repoSummary = useMemo(() => repoFilter.join(", "), [repoFilter]);

  return (
    <div className={theme === "dark" ? "body-container theme-dark" : "body-container"}>
      <nav className={sidebarClass} aria-label="Primary navigation">
        <button
          type="button"
          className="collapse-toggle"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
        <div className="nav-group">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} legacyBehavior>
              <a className={`nav-link${isActive(item.href) ? " active" : ""}`}>
                <SidebarIcon type={item.icon} />
                {!collapsed && <span>{item.label}</span>}
              </a>
            </Link>
          ))}
        </div>
      </nav>
      <main className="main-content">
        <header className="topbar" role="banner">
          <div className="project-title">
            <h1 className="app-title">Maintainer Dashboard</h1>
            <p className="stat-caption">{repoSummary}</p>
          </div>
          <label className="theme-toggle" htmlFor="theme-toggle">
            <input
              id="theme-toggle"
              type="checkbox"
              checked={theme === "dark"}
              onChange={(event) => setTheme(event.target.checked ? "dark" : "light")}
              aria-label="Toggle dark mode"
            />
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </label>
          <div className="search-bar" role="search">
            <span aria-hidden="true">🔍</span>
            <input type="search" placeholder="Search contributors or activity…" aria-label="Search" />
          </div>
          <div className="actions">
            <div className="filter-group">
              <fieldset className="filter-fieldset">
                <legend className="sr-only">Filter by repository</legend>
                {FILTER_OPTIONS.repos.map((repo) => (
                  <label key={repo} className={`quick-filter${repoFilter.includes(repo) ? " active" : ""}`}>
                    <input
                      type="checkbox"
                      checked={repoFilter.includes(repo)}
                      onChange={() => handleRepoToggle(repo)}
                      aria-label={`Filter ${repo}`}
                    />
                    <span>{repo}</span>
                  </label>
                ))}
              </fieldset>
            </div>
            <div className="timeframe-select">
              <label htmlFor="timeframe" className="sr-only">
                Timeframe
              </label>
              <select id="timeframe" value={timeframe} onChange={handleTimeframeChange}>
                {FILTER_OPTIONS.timeframes.map((option) => (
                  <option key={option} value={option}>
                    {option.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="export-button" aria-haspopup="dialog">
              Export CSV
            </button>
            <div className="profile-menu" role="navigation" aria-label="Profile menu">
              <button type="button" className="profile-trigger" aria-haspopup="menu">
                <img src="/avatars/c1.png" alt="Maintainer avatar" width="40" height="40" />
              </button>
              <ul className="profile-dropdown" role="menu">
                <li role="menuitem">
                  <Link href="/settings" legacyBehavior>
                    <a>Settings</a>
                  </Link>
                </li>
                <li role="menuitem">
                  <button type="button">Export CSV</button>
                </li>
                <li role="menuitem">
                  <button type="button">Sign out</button>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <div className="page-container" role="main">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
