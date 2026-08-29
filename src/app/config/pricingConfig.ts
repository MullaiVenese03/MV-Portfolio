/**
 * Centralized Project Estimator Pricing Configuration
 *
 * All rates are in INR (₹).
 * Modify prices here to update the entire estimation engine across all services.
 */

export const pricingConfig = {
  // ── Web Design ─────────────────────────────────────────────────────────────
  webDesign: {
    base: {
      "landing-page": 8000,
      portfolio: 12000,
      "business-website": 15000,
      "multi-page": 20000,
      "ecommerce-ui": 25000,
      "web-app-ui": 35000,
      other: 20000,
    },
    pages: {
      "1": 0,
      "2-5": 5000,
      "6-10": 10000,
      "10+": 20000,
      "not-sure": 0,
    },
    designLevel: {
      simple: 0,
      modern: 10000,
      premium: 20000,
      interactive: 30000,
      "not-sure": 0,
    },
    features: {
      "contact-form": 1000,
      "blog-cms": 5000,
      booking: 5000,
      dashboard: 7500,
      filtering: 5000,
      ecommerce: 10000,
      "custom-interactive": 10000,
      other: 5000,
      "not-sure": 0,
    },
  },

  // ── Web Development ────────────────────────────────────────────────────────
  webDevelopment: {
    base: {
      "landing-page": 15000,
      portfolio: 20000,
      "business-website": 25000,
      "blog-cms": 35000,
      booking: 40000,
      ecommerce: 50000,
      "web-app": 75000,
      other: 30000,
    },
    pages: {
      "1": 0,
      "2-5": 5000,
      "6-10": 10000,
      "10+": 15000,
      "not-sure": 0,
    },
    features: {
      "contact-form": 0,
      whatsapp: 1000,
      "blog-cms": 7500,
      booking: 10000,
      payment: 7500,
      "user-login": 10000,
      "admin-dashboard": 15000,
      "search-filter": 5000,
      ecommerce: 20000,
      api: 10000, // API Integration (7,500 - 15,000 allowance)
      animation: 10000, // Advanced Animation
      custom: 15000, // Custom Functionality
      other: 10000,
      "not-sure": 0,
    },
    complexity: {
      basic: 0,
      custom: 10000,
      advanced: 25000,
      "highly-custom": 40000,
      "not-sure": 0,
    },
    designReady: {
      ready: 0,
      "need-design": 10000, // Initial combined design/development allowance
      "rough-idea": 0,
      "not-sure": 0,
    },
  },

  // ── Branding & Logo Design ──────────────────────────────────────────────────
  branding: {
    base: {
      logo: 5000,
      "logo-basic-brand": 12000,
      "complete-brand": 30000,
      refresh: 15000,
      "not-sure": 5000,
    },
    brandingLevel: {
      basic: 0,
      custom: 5000,
      premium: 15000,
      strategic: 25000,
      "not-sure": 0,
    },
    materials: {
      logo: 0,
      "colour-palette": 3000,
      typography: 3000,
      "brand-guidelines": 7000,
      "business-card": 2000,
      "social-media": 5000,
      packaging: 10000,
      presentation: 5000,
      other: 5000,
      "not-sure": 0,
    },
  },

  // ── Thresholds & Global Settings ───────────────────────────────────────────
  thresholds: {
    manualReviewAmount: 75000,
    highComplexityAmount: 100000,
  },
} as const;
