import type { ServiceKey, Answers, EstimateResult } from "./types";
import { pricingConfig } from "../../config/pricingConfig";

// ── Currency Formatter (Indian Numbering System) ────────────────────────────────
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Human-readable Label Maps ──────────────────────────────────────────────────
const SERVICE_NAME_MAP: Record<ServiceKey, string> = {
  "web-design": "Web Design",
  "web-development": "Web Development",
  branding: "Branding & Logo Design",
};

const PROJECT_TYPE_MAP: Record<string, string> = {
  "landing-page": "Landing Page",
  portfolio: "Portfolio Website",
  "business-website": "Business Website",
  "multi-page": "Multi-page Website",
  "ecommerce-ui": "E-commerce UI",
  "web-app-ui": "Web Application UI",
  "blog-cms": "Blog / CMS Website",
  booking: "Booking Website",
  ecommerce: "E-commerce Website",
  "web-app": "Custom Web Application",
  logo: "Logo Design",
  "logo-basic-brand": "Logo + Basic Brand Identity",
  "complete-brand": "Complete Brand Identity",
  refresh: "Brand Refresh / Redesign",
  other: "Custom Project",
  "not-sure": "Custom Requirement",
};

/**
 * Calculates project estimate, client-facing range, manual review flag, and timeline.
 */
export function calculateEstimate(
  service: ServiceKey,
  answers: Answers,
): EstimateResult {
  let calculatedValue = 0;
  let requiresManualReview = false;
  const cfg = pricingConfig;

  // Extract common answer helpers
  const getSingle = (id: string): string => {
    const val = answers[id];
    if (typeof val === "string") return val;
    if (Array.isArray(val) && val.length > 0) return val[0];
    return "";
  };

  const getMulti = (id: string): string[] => {
    const val = answers[id];
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val.trim()) return [val];
    return [];
  };

  const projectTypeKey = getSingle("project-type") || getSingle("what-need") || "not-sure";
  const projectTypeLabel = PROJECT_TYPE_MAP[projectTypeKey] || "Custom Project";
  const serviceLabel = SERVICE_NAME_MAP[service];

  let hasSignificantModifiers = false;

  // ═════════════════════════════════════════════════════════════════════════════
  // 1. WEB DESIGN CALCULATION
  // ═════════════════════════════════════════════════════════════════════════════
  if (service === "web-design") {
    const wdCfg = cfg.webDesign;
    const baseKey = (projectTypeKey in wdCfg.base ? projectTypeKey : "other") as keyof typeof wdCfg.base;
    const basePrice = wdCfg.base[baseKey] ?? 15000;
    calculatedValue += basePrice;

    if (baseKey === "other" || baseKey === "web-app-ui") {
      requiresManualReview = true;
    }

    // Page modifiers (avoid charging extra for normal 2-5 pages on multi-page/business)
    const pagesKey = getSingle("pages") as keyof typeof wdCfg.pages;
    if (pagesKey in wdCfg.pages) {
      const pageCost = wdCfg.pages[pagesKey];
      // If 2-5 pages and project is already multi-page/business/portfolio, baseline includes it
      if (pagesKey === "2-5" && (baseKey === "business-website" || baseKey === "multi-page" || baseKey === "portfolio")) {
        // Included in base
      } else {
        calculatedValue += pageCost;
        if (pageCost > 0) hasSignificantModifiers = true;
      }
    }

    // Design level
    const designLevelKey = getSingle("design-level") as keyof typeof wdCfg.designLevel;
    if (designLevelKey in wdCfg.designLevel) {
      const levelCost = wdCfg.designLevel[designLevelKey];
      calculatedValue += levelCost;
      if (levelCost > 0) hasSignificantModifiers = true;
    }

    // Features
    const selectedFeatures = getMulti("features");
    selectedFeatures.forEach((feat) => {
      // Guard against double charging e-commerce if project type is already e-commerce UI
      if (feat === "ecommerce" && baseKey === "ecommerce-ui") {
        return;
      }

      if (feat in wdCfg.features) {
        const featCost = wdCfg.features[feat as keyof typeof wdCfg.features];
        calculatedValue += featCost;
        if (featCost > 0) hasSignificantModifiers = true;
      }

      if (feat === "other") {
        requiresManualReview = true;
      }
    });

    if (projectTypeKey === "not-sure" || getSingle("design-level") === "not-sure") {
      requiresManualReview = true;
    }
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 2. WEB DEVELOPMENT CALCULATION
  // ═════════════════════════════════════════════════════════════════════════════
  else if (service === "web-development") {
    const devCfg = cfg.webDevelopment;
    const baseKey = (projectTypeKey in devCfg.base ? projectTypeKey : "other") as keyof typeof devCfg.base;
    const basePrice = devCfg.base[baseKey] ?? 25000;
    calculatedValue += basePrice;

    if (baseKey === "other" || baseKey === "web-app") {
      requiresManualReview = true;
    }

    // Page modifiers (baseline includes standard 2-5 pages for business, portfolio, CMS, etc.)
    const pagesKey = getSingle("pages") as keyof typeof devCfg.pages;
    if (pagesKey in devCfg.pages) {
      const pageCost = devCfg.pages[pagesKey];
      if (pagesKey === "2-5" && baseKey !== "landing-page") {
        // 2-5 pages is normal starting scope for business/portfolio/CMS/ecommerce
      } else {
        calculatedValue += pageCost;
        if (pageCost > 0) hasSignificantModifiers = true;
      }
    }

    // Features (with double-charging prevention)
    const selectedFeatures = getMulti("features");
    selectedFeatures.forEach((feat) => {
      // Avoid double charging if project type baseline already includes the core feature
      if (feat === "blog-cms" && baseKey === "blog-cms") return;
      if (feat === "booking" && baseKey === "booking") return;
      if (feat === "ecommerce" && baseKey === "ecommerce") return;

      if (feat in devCfg.features) {
        const featCost = devCfg.features[feat as keyof typeof devCfg.features];
        calculatedValue += featCost;
        if (featCost > 0) hasSignificantModifiers = true;
      }

      if (feat === "api" || feat === "custom" || feat === "other") {
        requiresManualReview = true;
      }
    });

    // Complexity
    const complexityKey = getSingle("complexity") as keyof typeof devCfg.complexity;
    if (complexityKey in devCfg.complexity) {
      const complexityCost = devCfg.complexity[complexityKey];
      calculatedValue += complexityCost;
      if (complexityCost > 0) hasSignificantModifiers = true;
      if (complexityKey === "highly-custom") {
        requiresManualReview = true;
      }
    }

    // Design ready allowance
    const designReadyKey = getSingle("design-ready") as keyof typeof devCfg.designReady;
    if (designReadyKey === "need-design") {
      calculatedValue += devCfg.designReady["need-design"];
      hasSignificantModifiers = true;
    }

    if (projectTypeKey === "not-sure" || complexityKey === "not-sure") {
      requiresManualReview = true;
    }
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 3. BRANDING & LOGO DESIGN CALCULATION
  // ═════════════════════════════════════════════════════════════════════════════
  else if (service === "branding") {
    const brandCfg = cfg.branding;
    const baseKey = (projectTypeKey in brandCfg.base ? projectTypeKey : "not-sure") as keyof typeof brandCfg.base;
    const basePrice = brandCfg.base[baseKey] ?? 5000;
    calculatedValue += basePrice;

    if (baseKey === "not-sure") {
      requiresManualReview = true;
    }

    // Branding level
    const brandLevelKey = getSingle("branding-level") as keyof typeof brandCfg.brandingLevel;
    if (brandLevelKey in brandCfg.brandingLevel) {
      const levelCost = brandCfg.brandingLevel[brandLevelKey];
      calculatedValue += levelCost;
      if (levelCost > 0) hasSignificantModifiers = true;
      if (brandLevelKey === "strategic") {
        requiresManualReview = true;
      }
    }

    // Deliverables / Brand materials (with complete brand baseline deduction)
    const selectedMaterials = getMulti("brand-materials");
    selectedMaterials.forEach((mat) => {
      // If complete-brand, baseline (30k) already covers logo, color, typography, guidelines
      if (
        baseKey === "complete-brand" &&
        (mat === "logo" || mat === "colour-palette" || mat === "typography" || mat === "brand-guidelines")
      ) {
        return;
      }

      // If logo-basic-brand, baseline (12k) covers logo, color, typography
      if (
        baseKey === "logo-basic-brand" &&
        (mat === "logo" || mat === "colour-palette" || mat === "typography")
      ) {
        return;
      }

      if (mat in brandCfg.materials) {
        const matCost = brandCfg.materials[mat as keyof typeof brandCfg.materials];
        calculatedValue += matCost;
        if (matCost > 0) hasSignificantModifiers = true;
      }

      if (mat === "packaging" || mat === "other") {
        requiresManualReview = true;
      }
    });

    if (projectTypeKey === "not-sure" || brandLevelKey === "not-sure") {
      requiresManualReview = true;
    }
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 4. MANUAL REVIEW THRESHOLD
  // ═════════════════════════════════════════════════════════════════════════════
  if (calculatedValue >= cfg.thresholds.manualReviewAmount) {
    requiresManualReview = true;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 5. CLIENT-FACING RANGE & STARTING PRICE CALCULATION
  // ═════════════════════════════════════════════════════════════════════════════
  let rangeStr = "";
  let minAmount = calculatedValue;
  let maxAmount = calculatedValue;
  let isStartingFrom = false;
  const isHighComplexity = calculatedValue >= cfg.thresholds.highComplexityAmount;

  // Simple project with minimal modifiers -> Display "Starting from ₹XX,XXX"
  if (!hasSignificantModifiers && calculatedValue < 30000) {
    isStartingFrom = true;
    minAmount = Math.floor(calculatedValue / 1000) * 1000;
    maxAmount = minAmount;
    rangeStr = `Starting from ${formatINR(minAmount)}`;
  } else if (calculatedValue < 20000) {
    // Under 20k: ±2,500 – 5,000 window rounded to 2,500 / 5,000
    minAmount = Math.max(Math.floor((calculatedValue - 2500) / 2500) * 2500, 5000);
    maxAmount = Math.ceil((calculatedValue + 3500) / 2500) * 2500;
    rangeStr = `${formatINR(minAmount)} – ${formatINR(maxAmount)}`;
  } else if (calculatedValue < 50000) {
    // 20k – 50k: ±10–15%, rounded to nearest 5,000
    minAmount = Math.floor((calculatedValue * 0.9) / 5000) * 5000;
    maxAmount = Math.ceil((calculatedValue * 1.15) / 5000) * 5000;
    rangeStr = `${formatINR(minAmount)} – ${formatINR(maxAmount)}`;
  } else if (calculatedValue < 100000) {
    // 50k – 100k: ±10–20%, rounded to nearest 5,000
    minAmount = Math.floor((calculatedValue * 0.9) / 5000) * 5000;
    maxAmount = Math.ceil((calculatedValue * 1.15) / 5000) * 5000;
    rangeStr = `${formatINR(minAmount)} – ${formatINR(maxAmount)}`;
  } else {
    // 100k+: Display high-complexity bracket e.g. "₹1,00,000+" or clean range
    minAmount = Math.floor((calculatedValue * 0.9) / 10000) * 10000;
    maxAmount = Math.ceil((calculatedValue * 1.2) / 10000) * 10000;
    if (calculatedValue >= 120000 || getSingle("complexity") === "highly-custom") {
      rangeStr = `${formatINR(minAmount)}+`;
    } else {
      rangeStr = `${formatINR(minAmount)} – ${formatINR(maxAmount)}`;
    }
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 6. TIMELINE DERIVATION
  // ═════════════════════════════════════════════════════════════════════════════
  let timeline = "2 – 4 weeks";
  const userTimeline = getSingle("timeline");

  if (userTimeline === "asap") {
    timeline = "1 – 2 weeks (priority turnaround)";
  } else if (userTimeline === "2-4-weeks") {
    timeline = "2 – 4 weeks";
  } else if (userTimeline === "1-2-months") {
    timeline = "4 – 8 weeks";
  } else if (userTimeline === "flexible") {
    timeline = "Flexible schedule";
  } else {
    // Derived from scope
    if (calculatedValue < 20000) {
      timeline = "1 – 2 weeks";
    } else if (calculatedValue < 45000) {
      timeline = "2 – 3 weeks";
    } else if (calculatedValue < 75000) {
      timeline = "3 – 5 weeks";
    } else {
      timeline = "5 – 8 weeks";
    }
  }

  return {
    label: "YOUR INITIAL ESTIMATE",
    serviceLabel,
    projectTypeLabel,
    range: rangeStr,
    timeline: `Estimated timeline: ${timeline}`,
    calculatedValue,
    minAmount,
    maxAmount,
    isStartingFrom,
    isHighComplexity,
    requiresManualReview,
    isPlaceholder: false,
    notes: [
      "Based on the requirements you’ve provided.",
      "Final pricing and timeline will be confirmed after a detailed review of your project requirements.",
    ],
  };
}
