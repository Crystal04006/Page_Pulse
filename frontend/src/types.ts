export type Severity = 'critical' | 'warning' | 'optimization';
export type Category = 'seo' | 'performance' | 'accessibility' | 'security';

export interface CodeFix {
  html: string;
  react: string;
  vue: string;
  nextjs: string;
  svelte: string;
}

export interface AuditIssue {
  id: string;
  rule_id: string;
  title: string;
  severity: Severity;
  category: Category;
  predicted_priority: number; // e.g. 1 (highest) to 10
  estimated_score_gain: number; // e.g. +8%
  estimated_fix_time: string; // e.g. "5 mins"
  business_impact: string;
  location_context: string;
  suggested_fix: CodeFix;
}

export interface AuditMetrics {
  status_code: number;
  status_text: string;
  response_time_ms: number;
  h1_count: number;
  h2_count: number;
  meta_title: string;
  meta_description: string;
  og_image: string;
  mobile_responsive: boolean;
  ssl_active: boolean;
  page_size_kb: number;
  images_missing_alt: number;
  total_images: number;
  canonical_url: string;
  has_robots_txt: boolean;
  has_sitemap: boolean;
}

export interface AuditData {
  id: string;
  url: string;
  timestamp: string;
  health_score: number;
  metrics: AuditMetrics;
  issues: AuditIssue[];
}

export interface AuditHistoryItem {
  id: string;
  url: string;
  health_score: number;
  response_time_ms: number;
  status_code: number;
  created_at: string;
  issues_count: number;
}
