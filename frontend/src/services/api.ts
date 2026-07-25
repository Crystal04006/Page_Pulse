import { AuditData, AuditHistoryItem } from '../types';
import { generateDynamicAudit } from '../data/mockAudits';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://page-pulse-dfwl.onrender.com';
/**
 * Runs an audit by calling the FastAPI backend.
 * Falls back to local generator if backend is unavailable or offline.
 */
export async function runHealthAudit(url: string): Promise<{ data: AuditData; isLiveBackend: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(`${API_BASE_URL}/audit?url=${encodeURIComponent(url)}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const liveData = await res.json();
      // Ensure metrics and issues structure matches expected interface
      const formattedData: AuditData = {
        id: liveData.id || `audit-${Date.now()}`,
        url: liveData.url || url,
        timestamp: liveData.timestamp || new Date().toISOString(),
        health_score: liveData.health_score ?? 75,
        metrics: {
          status_code: liveData.metrics?.status_code ?? 200,
          status_text: liveData.metrics?.status_code === 200 ? 'OK' : 'Response Error',
          response_time_ms: liveData.metrics?.response_time_ms ?? 350,
          h1_count: liveData.metrics?.h1_count ?? 1,
          h2_count: liveData.metrics?.h2_count ?? 3,
          meta_title: liveData.metrics?.meta_title || `${url} Page`,
          meta_description: liveData.metrics?.meta_description || '',
          og_image: liveData.metrics?.og_image || '',
          mobile_responsive: liveData.metrics?.mobile_responsive ?? true,
          ssl_active: liveData.metrics?.ssl_active ?? true,
          page_size_kb: liveData.metrics?.page_size_kb ?? 1200,
          images_missing_alt: liveData.metrics?.images_missing_alt ?? 0,
          total_images: liveData.metrics?.total_images ?? 5,
          canonical_url: liveData.metrics?.canonical_url || url,
          has_robots_txt: liveData.metrics?.has_robots_txt ?? true,
          has_sitemap: liveData.metrics?.has_sitemap ?? true
        },
        issues: (liveData.issues || []).map((iss: any, index: number) => ({
          id: iss.id || `iss-${index}`,
          rule_id: iss.rule_id || `rule_${index}`,
          title: iss.title || 'SEO Improvement Required',
          severity: iss.severity || 'warning',
          category: iss.category || 'seo',
          predicted_priority: iss.predicted_priority ?? index + 1,
          estimated_score_gain: iss.estimated_score_gain ?? 5,
          estimated_fix_time: iss.estimated_fix_time || '5 mins',
          business_impact: iss.business_impact || 'Impacts search engine ranking.',
          location_context: iss.location_context || 'HTML Document',
          suggested_fix: {
            html: iss.suggested_fix?.html || `<!-- Fix for ${iss.title} -->`,
            react: iss.suggested_fix?.react || `// Fix for ${iss.title}`,
            vue: iss.suggested_fix?.vue || `<!-- Fix for ${iss.title} -->`,
            nextjs: iss.suggested_fix?.nextjs || `// Fix for ${iss.title}`,
            svelte: iss.suggested_fix?.svelte || `<!-- Fix for ${iss.title} -->`
          }
        }))
      };

      return { data: formattedData, isLiveBackend: true };
    }
  } catch (err) {
    console.warn('FastAPI backend not reachable at http://127.0.0.1:8000/api. Falling back to local audit engine.', err);
  }

  // Fallback to client generator if offline or error
  return { data: generateDynamicAudit(url), isLiveBackend: false };
}

/**
 * Fetches historical audits from FastAPI backend or returns local storage fallback.
 */
export async function fetchAuditHistory(url?: string): Promise<AuditHistoryItem[] | null> {
  try {
    const query = url ? `?url=${encodeURIComponent(url)}` : '';
    const res = await fetch(`${API_BASE_URL}/history${query}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.history)) {
        return data.history;
      }
    }
  } catch (e) {
    // Silent catch, fallback to local
  }
  return null;
}
