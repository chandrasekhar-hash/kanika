export const SAMPLE_DATA = {
  "timeframe": "30d",
  "contributors": [
    {"id":"c1","name":"Chandrasekhar","handle":"chandu","avatar":"/avatars/c1.png","prs_reviewed":42,"docs_updated":18,"mentoring":12,"issues_triaged":27,"usage_impact":420},
    {"id":"c2","name":"Kanika","handle":"kanika","avatar":"/avatars/c2.png","prs_reviewed":31,"docs_updated":25,"mentoring":6,"issues_triaged":19,"usage_impact":350},
    {"id":"c3","name":"Aryan","handle":"aryan","avatar":"/avatars/c3.png","prs_reviewed":20,"docs_updated":8,"mentoring":3,"issues_triaged":12,"usage_impact":180},
    {"id":"c4","name":"Maya","handle":"maya","avatar":"/avatars/c4.png","prs_reviewed":15,"docs_updated":22,"mentoring":9,"issues_triaged":10,"usage_impact":210},
    {"id":"c5","name":"Ravi","handle":"ravi","avatar":"/avatars/c5.png","prs_reviewed":7,"docs_updated":3,"mentoring":1,"issues_triaged":6,"usage_impact":60},
    {"id":"c6","name":"Neha","handle":"neha","avatar":"/avatars/c6.png","prs_reviewed":10,"docs_updated":12,"mentoring":4,"issues_triaged":8,"usage_impact":120}
  ],
  "activity_timeline": [
    {"date":"2025-09-01","type":"pr_review","contributor":"c1","count":4},
    {"date":"2025-09-02","type":"docs_update","contributor":"c2","count":3},
    /* include weekly series for charting */
    {"date":"2025-09-03","type":"mentoring","contributor":"c4","count":2},
    {"date":"2025-09-04","type":"pr_review","contributor":"c2","count":3},
    {"date":"2025-09-05","type":"docs_update","contributor":"c1","count":5},
    {"date":"2025-09-06","type":"pr_review","contributor":"c3","count":2},
    {"date":"2025-09-07","type":"mentoring","contributor":"c1","count":1},
    {"date":"2025-09-08","type":"docs_update","contributor":"c4","count":4},
    {"date":"2025-09-09","type":"pr_review","contributor":"c1","count":5},
    {"date":"2025-09-10","type":"mentoring","contributor":"c2","count":2},
    {"date":"2025-09-11","type":"docs_update","contributor":"c6","count":3},
    {"date":"2025-09-12","type":"pr_review","contributor":"c4","count":4},
    {"date":"2025-09-13","type":"docs_update","contributor":"c3","count":2},
    {"date":"2025-09-14","type":"mentoring","contributor":"c5","count":1},
    {"date":"2025-09-15","type":"pr_review","contributor":"c2","count":4},
    {"date":"2025-09-16","type":"docs_update","contributor":"c2","count":3},
    {"date":"2025-09-17","type":"mentoring","contributor":"c6","count":2},
    {"date":"2025-09-18","type":"pr_review","contributor":"c1","count":6},
    {"date":"2025-09-19","type":"docs_update","contributor":"c4","count":5},
    {"date":"2025-09-20","type":"mentoring","contributor":"c3","count":1},
    {"date":"2025-09-21","type":"pr_review","contributor":"c5","count":2}
  ],
  "impact_by_region": [
    {"region":"IN","users":4200},{"region":"US","users":5200},{"region":"EU","users":3050}
  ]
};
