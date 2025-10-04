import { useEffect, useState } from "react";

export const DATA_ENDPOINT = "/api/mock/contributors";

export function useDashboardData(timeframe = "30d") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${DATA_ENDPOINT}?timeframe=${timeframe}`);
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status}`);
        }
        const payload = await response.json();
        if (isMounted) {
          setData(payload);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  return { data, loading, error };
}
