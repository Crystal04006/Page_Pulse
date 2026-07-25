from bs4 import BeautifulSoup
from typing import Dict, Any
from app.rules.base import BaseRule

class MetaTitleRule(BaseRule):
    rule_id = "meta_title_missing"
    title = "Missing Primary Title Tag"

    def evaluate(self, soup: BeautifulSoup, response_metadata: Dict[str, Any]) -> Dict[str, Any]:
        title_tag = soup.find("title")
        has_title = bool(title_tag and title_tag.string and title_tag.string.strip())
        
        return {
            "rule_id": self.rule_id,
            "title": self.title,
            "passed": has_title,
            "score_deduction": 0 if has_title else 15,
            "confidence": 0.98,
            "confidence_reason": "Direct static HTML inspection verified presence/absence of <title> element.",
            "estimated_fix_time": "3 min",
            "expected_seo_impact": "High",
            "difficulty": "Easy",
            "predicted_priority": 4.9,
            "estimated_score_gain": 15.0,
            "business_impact": "Search engines use title tags as the primary headline in search results. Missing titles severely damage CTR and keyword indexing.",
            "location_context": "Inside <head> element",
            "suggested_fix": {
                "html": "<head>\n  <title>Your Descriptive Page Title</title>\n</head>",
                "react": "export const metadata = { title: 'Your Descriptive Page Title' };",
                "vue": "useSeoMeta({ title: 'Your Descriptive Page Title' });"
            }
        }

class MetaDescriptionRule(BaseRule):
    rule_id = "meta_desc_missing"
    title = "Missing Meta Description Tag"

    def evaluate(self, soup: BeautifulSoup, response_metadata: Dict[str, Any]) -> Dict[str, Any]:
        desc_tag = soup.find("meta", attrs={"name": "description"})
        has_desc = bool(desc_tag and desc_tag.get("content", "").strip())

        return {
            "rule_id": self.rule_id,
            "title": self.title,
            "passed": has_desc,
            "score_deduction": 0 if has_desc else 10,
            "confidence": 0.95,
            "confidence_reason": "Checked <head> section for meta name='description'.",
            "estimated_fix_time": "5 min",
            "expected_seo_impact": "Medium",
            "difficulty": "Easy",
            "predicted_priority": 2.0,
            "estimated_score_gain": 10.0,
            "business_impact": "Meta descriptions provide snippet previews in search engine result pages (SERPs). Without it, search engines display random page text.",
            "location_context": "Inside <head> element",
            "suggested_fix": {
                "html": '<meta name="description" content="Summarize page content here in 150-160 characters.">',
                "react": "export const metadata = { description: 'Summarize page content here.' };",
                "vue": "useSeoMeta({ description: 'Summarize page content here.' });"
            }
        }

class H1HeadingRule(BaseRule):
    rule_id = "h1_heading_check"
    title = "H1 Heading Hierarchy Check"

    def evaluate(self, soup: BeautifulSoup, response_metadata: Dict[str, Any]) -> Dict[str, Any]:
        h1_tags = soup.find_all("h1")
        h1_count = len(h1_tags)
        passed = (h1_count == 1)

        location = "Inside <body> tag"
        if h1_count > 1:
            location = f"Multiple H1 elements found across DOM (Count: {h1_count})"
        elif h1_count == 0:
            location = "No <h1> element detected inside <body>"

        return {
            "rule_id": self.rule_id,
            "title": self.title,
            "passed": passed,
            "score_deduction": 0 if passed else 10,
            "confidence": 0.96,
            "confidence_reason": f"DOM inspection counted {h1_count} <h1> element(s).",
            "estimated_fix_time": "4 min",
            "expected_seo_impact": "High",
            "difficulty": "Easy",
            "predicted_priority": 2.5,
            "estimated_score_gain": 10.0,
            "business_impact": "A single H1 header establishes primary document topic hierarchy for web crawlers and screen readers.",
            "location_context": location,
            "suggested_fix": {
                "html": "<h1>Main Page Heading</h1>",
                "react": "<h1>Main Page Heading</h1>",
                "vue": "<h1>Main Page Heading</h1>"
            }
        }

class ImageAltRule(BaseRule):
    rule_id = "image_alt_check"
    title = "Missing Image Alt Attributes"

    def evaluate(self, soup: BeautifulSoup, response_metadata: Dict[str, Any]) -> Dict[str, Any]:
        images = soup.find_all("img")
        missing_alt_imgs = [img for img in images if not img.get("alt")]
        passed = len(missing_alt_imgs) == 0

        first_location = "All images contain alt text"
        if missing_alt_imgs:
            parent = missing_alt_imgs[0].parent.name if missing_alt_imgs[0].parent else "body"
            first_location = f"Found inside <{parent}> element (Total missing: {len(missing_alt_imgs)})"

        return {
            "rule_id": self.rule_id,
            "title": self.title,
            "passed": passed,
            "score_deduction": 0 if passed else 5,
            "confidence": 0.95,
            "confidence_reason": f"Evaluated {len(images)} image tags for alt properties.",
            "estimated_fix_time": "2 min",
            "expected_seo_impact": "Medium",
            "difficulty": "Easy",
            "predicted_priority": 2.5,
            "estimated_score_gain": 5.0,
            "business_impact": "Alt text ensures accessibility compliance for screen readers and allows search engines to index image context.",
            "location_context": first_location,
            "suggested_fix": {
                "html": '<img src="image.jpg" alt="Descriptive text describing image">',
                "react": '<img src="image.jpg" alt="Descriptive text describing image" />',
                "vue": '<img src="image.jpg" alt="Descriptive text describing image" />'
            }
        }