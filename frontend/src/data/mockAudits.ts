import { AuditData, AuditHistoryItem, AuditIssue } from '../types';

export const SAMPLE_URLS = [
  { label: 'Sample E-Commerce (Needs Optimization)', url: 'https://store.example.com' },
  { label: 'Sample SaaS Landing Page', url: 'https://app.pulse.dev' },
  { label: 'TechCrunch News', url: 'https://techcrunch.com' },
  { label: 'Developer Blog', url: 'https://dev.to' },
  { label: 'Stripe Documentation', url: 'https://stripe.com/docs' }
];

export const INITIAL_AUDIT_DATA: AuditData = {
  id: 'audit-9821',
  url: 'https://yourwebsite.com',
  timestamp: new Date().toISOString(),
  health_score: 62,
  metrics: {
    status_code: 200,
    status_text: 'OK',
    response_time_ms: 1420,
    h1_count: 0,
    h2_count: 5,
    meta_title: 'Welcome to My Website | Home',
    meta_description: '',
    og_image: '',
    mobile_responsive: true,
    ssl_active: true,
    page_size_kb: 3420,
    images_missing_alt: 8,
    total_images: 14,
    canonical_url: '',
    has_robots_txt: true,
    has_sitemap: false
  },
  issues: [
    {
      id: 'issue-1',
      rule_id: 'rule_missing_h1',
      title: 'Missing Primary <h1> Title Tag',
      severity: 'critical',
      category: 'seo',
      predicted_priority: 1,
      estimated_score_gain: 15,
      estimated_fix_time: '3 mins',
      business_impact: 'Search engines rely heavily on the <h1> tag to index page topic. Missing <h1> lowers organic ranking potential significantly.',
      location_context: 'document.querySelector("header") || <body>',
      suggested_fix: {
        html: `<header>\n  <h1 class="text-3xl font-bold tracking-tight">Your Main Page Value Proposition</h1>\n</header>`,
        react: `export function PageHeader() {\n  return (\n    <header className="py-6">\n      <h1 className="text-3xl font-extrabold text-slate-900">\n        Your Main Page Value Proposition\n      </h1>\n    </header>\n  );\n}`,
        vue: `<template>\n  <header class="py-6">\n    <h1 class="text-3xl font-extrabold text-slate-900">\n      Your Main Page Value Proposition\n    </h1>\n  </header>\n</template>`,
        nextjs: `export default function Page() {\n  return (\n    <main className="max-w-7xl mx-auto px-4">\n      <h1 className="text-4xl font-extrabold">Your Main Page Value Proposition</h1>\n    </main>\n  );\n}`,
        svelte: `<script>\n  let title = "Your Main Page Value Proposition";\n</script>\n\n<header class="py-6">\n  <h1 class="text-3xl font-bold">{title}</h1>\n</header>`
      }
    },
    {
      id: 'issue-2',
      rule_id: 'rule_missing_og_image',
      title: 'Incomplete OpenGraph Social Preview Meta Tags',
      severity: 'warning',
      category: 'seo',
      predicted_priority: 2,
      estimated_score_gain: 15,
      estimated_fix_time: '4 mins',
      business_impact: 'Missing og:image metadata causes social shares on Twitter, Slack, and LinkedIn to render plain text instead of rich preview cards.',
      location_context: '<head> metadata block',
      suggested_fix: {
        html: `<meta property="og:image" content="https://yourwebsite.com/og-banner.png" />`,
        react: `<Helmet>\n  <meta property="og:image" content="https://yourwebsite.com/og-banner.png" />\n</Helmet>`,
        vue: `useSeoMeta({ ogImage: 'https://yourwebsite.com/og-banner.png' })`,
        nextjs: `export const metadata = { openGraph: { images: ['/og-banner.png'] } };`,
        svelte: `<svelte:head>\n  <meta property="og:image" content="/og-banner.png" />\n</svelte:head>`
      }
    }
  ]
};

export const MOCK_HISTORY: AuditHistoryItem[] = [
  {
    id: 'audit-9821',
    url: 'https://yourwebsite.com',
    health_score: 62,
    response_time_ms: 1420,
    status_code: 200,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    issues_count: 2
  }
];

export function generateDynamicAudit(url: string): AuditData {
  const cleanUrl = url.toLowerCase().trim();
  const isHealthy = cleanUrl.includes('pulse') || cleanUrl.includes('stripe') || cleanUrl.includes('vercel');
  const isCritical = cleanUrl.includes('example') || cleanUrl.includes('test') || cleanUrl.includes('old');

  let baseScore = isHealthy ? 92 : isCritical ? 45 : 85;
  let latency = isHealthy ? 310 : isCritical ? 2400 : 320;
  const issues: AuditIssue[] = [];

  // Guarantee issues are generated whenever score < 100
  if (baseScore < 100) {
    issues.push({
      id: `iss-${Date.now()}-og`,
      rule_id: 'rule_missing_og_image',
      title: 'Incomplete OpenGraph Social Preview Meta Tags',
      severity: 'warning',
      category: 'seo',
      predicted_priority: 1,
      estimated_score_gain: 15,
      estimated_fix_time: '4 mins',
      business_impact: 'Missing og:image metadata causes social shares on Twitter, Slack, and LinkedIn to render plain text instead of rich preview cards.',
      location_context: '<head> metadata block',
      suggested_fix: {
        html: `<meta property="og:image" content="https://${new URL(url.startsWith('http') ? url : 'https://' + url).hostname}/og-banner.png" />`,
        react: `<Helmet>\n  <meta property="og:image" content="https://${new URL(url.startsWith('http') ? url : 'https://' + url).hostname}/og-banner.png" />\n</Helmet>`,
        vue: `useSeoMeta({ ogImage: 'https://${new URL(url.startsWith('http') ? url : 'https://' + url).hostname}/og-banner.png' })`,
        nextjs: `export const metadata = { openGraph: { images: ['/og-banner.png'] } };`,
        svelte: `<svelte:head>\n  <meta property="og:image" content="/og-banner.png" />\n</svelte:head>`
      }
    });
  }

  if (baseScore < 80) {
    issues.push({
      id: `iss-${Date.now()}-h1`,
      rule_id: 'rule_missing_h1',
      title: 'Multiple or Missing <h1> Heading Elements',
      severity: 'critical',
      category: 'seo',
      predicted_priority: 2,
      estimated_score_gain: 12,
      estimated_fix_time: '3 mins',
      business_impact: 'Having no <h1> tag or duplicate <h1> tags creates title ambiguity for web crawlers.',
      location_context: `document.querySelectorAll('h1') on ${url}`,
      suggested_fix: {
        html: `<h1>Primary Title for ${new URL(url.startsWith('http') ? url : 'https://' + url).hostname}</h1>`,
        react: `<h1>Primary Title for ${new URL(url.startsWith('http') ? url : 'https://' + url).hostname}</h1>`,
        vue: `<h1>Primary Title for ${new URL(url.startsWith('http') ? url : 'https://' + url).hostname}</h1>`,
        nextjs: `<h1>Primary Title for ${new URL(url.startsWith('http') ? url : 'https://' + url).hostname}</h1>`,
        svelte: `<h1>Primary Title for ${new URL(url.startsWith('http') ? url : 'https://' + url).hostname}</h1>`
      }
    });
  }

  return {
    id: `audit-${Math.floor(1000 + Math.random() * 9000)}`,
    url: url.startsWith('http') ? url : `https://${url}`,
    timestamp: new Date().toISOString(),
    health_score: baseScore,
    metrics: {
      status_code: 200,
      status_text: 'OK',
      response_time_ms: latency,
      h1_count: baseScore > 80 ? 1 : 0,
      h2_count: 4,
      meta_title: `${new URL(url.startsWith('http') ? url : 'https://' + url).hostname} — Official Page`,
      meta_description: 'Professional web presence and developer tools.',
      og_image: '',
      mobile_responsive: true,
      ssl_active: !url.startsWith('http://'),
      page_size_kb: 1420,
      images_missing_alt: 2,
      total_images: 10,
      canonical_url: url,
      has_robots_txt: true,
      has_sitemap: true
    },
    issues
  };
}