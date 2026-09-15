const startedAt = Date.now();
const metrics = { profile_extractions: 0, match_requests: 0, matches_returned: 0, csv_imports: 0 };

export function recordMetric(name: keyof typeof metrics, amount = 1) { metrics[name] += amount; }
export function readMetrics() {
  return { ...metrics, average_matches_returned: metrics.match_requests ? Number((metrics.matches_returned / metrics.match_requests).toFixed(1)) : 0, uptime_seconds: Math.round((Date.now() - startedAt) / 1000) };
}
