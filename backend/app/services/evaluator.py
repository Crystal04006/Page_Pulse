from bs4 import BeautifulSoup
from typing import Dict, Any, List

async def run_full_audit(url: str, status_code: int = 200, html: str = "", latency_ms: int = 0, headers: dict = None) -> Dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    headers = headers or {}
    
    score = 100
    issues: List[Dict[str, Any]] = []

    # --- 1. HEADINGS & STRUCTURE ---
    h1_tags = soup.find_all("h1")
    h1_count = len(h1_tags)
    page_title = soup.title.string.strip() if soup.title and soup.title.string else "No title tag found"

    if h1_count == 0:
        score -= 15
        issues.append({
            "id": "iss-h1-missing",
            "rule_id": "rule_h1_missing",
            "title": "Missing <h1> Main Heading",
            "severity": "critical",
            "category": "seo",
            "estimated_score_gain": 15,
            "estimated_fix_time": "3 mins",
            "business_impact": "Pages without an <h1> tag lack a clear primary topic indicator for search engine indexers.",
            "location_context": "DOM Body",
            "suggested_fix": {"html": f"<h1>{page_title}</h1>"}
        })
    elif h1_count > 1:
        score -= 10
        issues.append({
            "id": "iss-h1-multiple",
            "rule_id": "rule_h1_multiple",
            "title": f"Multiple <h1> Headings Found ({h1_count})",
            "severity": "warning",
            "category": "seo",
            "estimated_score_gain": 10,
            "estimated_fix_time": "4 mins",
            "business_impact": "Multiple <h1> tags can dilute heading hierarchy. Best practice recommends a single primary <h1> per page.",
            "location_context": f"Found {h1_count} <h1> tags in DOM",
            "suggested_fix": {"html": f"<h1>{page_title}</h1>\n<!-- Demote secondary h1s to h2 -->"}
        })

    # Heading Nesting Check (H3 before H2)
    h2_count = len(soup.find_all("h2"))
    h3_count = len(soup.find_all("h3"))
    if h3_count > 0 and h2_count == 0:
        score -= 10
        issues.append({
            "id": "iss-heading-hierarchy",
            "rule_id": "rule_heading_hierarchy",
            "title": "Skipped Heading Level (Found <h3> without <h2>)",
            "severity": "warning",
            "category": "accessibility",
            "estimated_score_gain": 10,
            "estimated_fix_time": "3 mins",
            "business_impact": "Screen reader users rely on sequential heading levels (H1 -> H2 -> H3) to navigate content structure.",
            "location_context": "Heading tags hierarchy",
            "suggested_fix": {"html": "<h2>Section Title</h2>\n  <h3>Subsection Title</h3>"}
        })

    # --- 2. ACCESSIBILITY & IMAGES ---
    images = soup.find_all("img")
    missing_alt_imgs = [img for img in images if not img.get("alt") or not img.get("alt").strip()]
    if missing_alt_imgs:
        penalty = min(len(missing_alt_imgs) * 5, 20)
        score -= penalty
        issues.append({
            "id": "iss-img-alt",
            "rule_id": "rule_missing_alt_tags",
            "title": f"Images Missing Alt Text ({len(missing_alt_imgs)} found)",
            "severity": "warning",
            "category": "accessibility",
            "estimated_score_gain": penalty,
            "estimated_fix_time": "5 mins",
            "business_impact": "Images without descriptive alt attributes violate WCAG 2.1 accessibility compliance standards.",
            "location_context": f"{len(missing_alt_imgs)} <img> elements missing alt attribute",
            "suggested_fix": {"html": '<img src="example.jpg" alt="Descriptive visual text" />'}
        })

    # --- 3. METADATA & OPENGRAPH ---
    meta_desc_tag = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
    meta_description = meta_desc_tag.get("content", "").strip() if meta_desc_tag and meta_desc_tag.get("content") else ""

    if not meta_description:
        score -= 15
        issues.append({
            "id": "iss-meta-desc",
            "rule_id": "rule_missing_meta_desc",
            "title": "Missing Meta Description",
            "severity": "critical",
            "category": "seo",
            "estimated_score_gain": 15,
            "estimated_fix_time": "3 mins",
            "business_impact": "Search engines use meta descriptions for search result snippets, directly influencing organic click-through rates.",
            "location_context": "<head> metadata section",
            "suggested_fix": {"html": '<meta name="description" content="A clear, concise 150-character summary of page content." />'}
        })

    og_img_tag = soup.find("meta", attrs={"property": "og:image"})
    og_image = og_img_tag.get("content", "").strip() if og_img_tag and og_img_tag.get("content") else ""
    if not og_image:
        score -= 10
        issues.append({
            "id": "iss-og-image",
            "rule_id": "rule_missing_og_image",
            "title": "Missing OpenGraph Social Preview Tag (og:image)",
            "severity": "warning",
            "category": "seo",
            "estimated_score_gain": 10,
            "estimated_fix_time": "4 mins",
            "business_impact": "Without og:image, link shares across LinkedIn, Slack, and Twitter render without visual preview cards.",
            "location_context": "<head> metadata section",
            "suggested_fix": {"html": '<meta property="og:image" content="https://yourwebsite.com/banner.png" />'}
        })

    # --- 4. MOBILE VIEWPORT & CANONICAL ---
    viewport_tag = soup.find("meta", attrs={"name": "viewport"})
    if not viewport_tag:
        score -= 15
        issues.append({
            "id": "iss-viewport",
            "rule_id": "rule_missing_viewport",
            "title": "Missing Mobile Viewport Configuration",
            "severity": "critical",
            "category": "mobile",
            "estimated_score_gain": 15,
            "estimated_fix_time": "2 mins",
            "business_impact": "Pages lacking a viewport meta tag render poorly on mobile screens, heavily penalizing mobile Google indexing.",
            "location_context": "<head> section",
            "suggested_fix": {"html": '<meta name="viewport" content="width=device-width, initial-scale=1.0" />'}
        })

    canonical_tag = soup.find("link", attrs={"rel": "canonical"})
    if not canonical_tag:
        score -= 10
        issues.append({
            "id": "iss-canonical",
            "rule_id": "rule_missing_canonical",
            "title": "Missing Canonical Tag",
            "severity": "warning",
            "category": "seo",
            "estimated_score_gain": 10,
            "estimated_fix_time": "3 mins",
            "business_impact": "Missing canonical tags can lead to duplicate content penalties across URL parameters or subdomains.",
            "location_context": "<head> section",
            "suggested_fix": {"html": f'<link rel="canonical" href="{url}" />'}
        })

    # --- 5. ROBOTS & INDEXING DIRECTIVES ---
    robots_tag = soup.find("meta", attrs={"name": "robots"})
    if robots_tag and "noindex" in robots_tag.get("content", "").lower():
        score -= 25
        issues.append({
            "id": "iss-noindex",
            "rule_id": "rule_noindex_detected",
            "title": "Page Set to 'noindex' (Hidden from Search Engines)",
            "severity": "critical",
            "category": "seo",
            "estimated_score_gain": 25,
            "estimated_fix_time": "2 mins",
            "business_impact": "The 'noindex' meta tag explicitly tells Google and Bing NOT to include this URL in search results.",
            "location_context": "<head> section",
            "suggested_fix": {"html": '<meta name="robots" content="index, follow" />'}
        })

    # --- 6. PERFORMANCE & LATENCY ---
    if latency_ms > 2000:
        score -= 15
        issues.append({
            "id": "iss-latency-high",
            "rule_id": "rule_high_latency",
            "title": f"Slow Server Response Time ({latency_ms} ms)",
            "severity": "critical",
            "category": "performance",
            "estimated_score_gain": 15,
            "estimated_fix_time": "15 mins",
            "business_impact": "Server responses over 2000ms negatively impact Core Web Vitals (TTFB) and increase bounce rates.",
            "location_context": "HTTP Response Headers",
            "suggested_fix": {"html": "<!-- Implement server-side caching, CDN edge routing, or database indexing -->"}
        })

    # Calculate final health score bounded between 10 and 100
    final_score = max(score, 10)

    text_body = soup.get_text(separator=' ', strip=True)
    word_count = len(text_body.split())

    return {
        "id": f"audit-{int(latency_ms)}",
        "url": url,
        "health_score": final_score,
        "metrics": {
            "status_code": status_code,
            "response_time_ms": latency_ms,
            "page_title": page_title,
            "meta_description": meta_description or "No meta description found",
            "h1_count": h1_count,
            "h2_count": h2_count,
            "h3_count": h3_count,
            "images_missing_alt": len(missing_alt_imgs),
            "total_images": len(images),
            "word_count": word_count,
            "og_image": og_image,
            "ssl_active": url.startswith("https://")
        },
        # All discovered issues are returned without truncation or artificial caps
        "issues": issues
    }