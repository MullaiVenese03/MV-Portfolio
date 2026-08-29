import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const logoPaths = `
  <path d="M65.2974 2.29578C68.4104 -0.76526 73.4026 -0.76526 76.5156 2.29578L96.8284 22.2698C100.016 25.4046 100.016 30.5436 96.8284 33.6783L55.1189 74.6922C52.006 77.7533 47.0137 77.7533 43.9007 74.6922L2.39115 33.8749C-0.796726 30.7402 -0.796724 25.6012 2.39115 22.4665L22.7684 2.42908C25.8814 -0.631968 30.8736 -0.63197 33.9866 2.42908L49.5743 17.7567L39.5905 27.5741L28.3775 16.5481L16.5578 28.1707L27.7708 39.1967L37.7546 49.014L49.5098 60.5732L61.3296 48.9506L71.3133 39.1333L82.6618 27.9741L70.9065 16.4148L59.5581 27.5741L49.5743 17.7567L65.2974 2.29578Z" fill="#2563EB"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M39.5905 27.5741L49.5743 17.7568L59.5581 27.5741L49.5743 37.3914L39.5905 27.5741Z" fill="#0EA5E9"/>
  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M39.5904 27.5741L49.5741 37.3914L37.7544 49.014L27.7706 39.1967L39.5904 27.5741Z" fill="#2563EB"/>
  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M71.3132 39.1333L61.3294 48.9506L49.5741 37.3914L59.5579 27.5741L71.3132 39.1333Z" fill="#2563EB"/>
`;

// Helper to create square SVG icon with specific width/height
function makeFaviconSvg(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mullai Venese Logo">
  <g transform="translate(46, 94.3) scale(4.2)">
    ${logoPaths}
  </g>
</svg>`;
}

// Apple Touch Icon SVG (180x180 with subtle rounded backdrop)
const appleTouchIconSvg = `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mullai Venese">
  <rect width="180" height="180" rx="36" fill="#0C0C0E"/>
  <g transform="translate(25, 43.5) scale(1.3)">
    ${logoPaths}
  </g>
</svg>`;

// 512x512 Square Social Share / WhatsApp / Schema.org Thumbnail SVG
const ogSquareSvg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mullai Venese">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <radialGradient id="accentGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#2563EB" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0EA5E9" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bgGrad)"/>
  <rect width="512" height="512" fill="url(#accentGlow)"/>
  <rect x="24" y="24" width="464" height="464" rx="32" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
  <g transform="translate(136, 110) scale(2.4)">
    ${logoPaths}
  </g>
  <text x="256" y="360" text-anchor="middle" fill="#F8FAFC" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="36" font-weight="700" letter-spacing="1">Mullai Venese</text>
  <text x="256" y="405" text-anchor="middle" fill="#38BDF8" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" letter-spacing="0.5">Front-End Dev &amp; UI/UX Designer</text>
</svg>`;

// 1200x630 Full Banner Open Graph SVG (Twitter Large Image, LinkedIn, Facebook)
const ogBannerSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mullai Venese Portfolio">
  <defs>
    <linearGradient id="bannerBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090D16"/>
      <stop offset="50%" stop-color="#030712"/>
      <stop offset="100%" stop-color="#0B1120"/>
    </linearGradient>
    <radialGradient id="bannerGlow" cx="25%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#2563EB" stop-opacity="0.35"/>
      <stop offset="70%" stop-color="#0EA5E9" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="badgeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0.2"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bannerBg)"/>
  <rect width="1200" height="630" fill="url(#bannerGlow)"/>

  <!-- Subtle Border Card -->
  <rect x="40" y="40" width="1120" height="550" rx="28" fill="rgba(15, 23, 42, 0.5)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="2"/>

  <!-- Left Logo Container -->
  <g transform="translate(100, 160)">
    <!-- Glow behind logo -->
    <circle cx="150" cy="150" r="140" fill="#2563EB" opacity="0.2" filter="blur(30px)"/>
    <rect width="300" height="300" rx="36" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1.5"/>
    <g transform="translate(50, 75) scale(2.0)">
      ${logoPaths}
    </g>
  </g>

  <!-- Right Content Block -->
  <!-- Status Badge -->
  <g transform="translate(460, 150)">
    <rect width="210" height="36" rx="18" fill="rgba(37, 99, 235, 0.15)" stroke="url(#badgeBorder)" stroke-width="1.5"/>
    <circle cx="20" cy="18" r="5" fill="#10B981"/>
    <text x="36" y="24" fill="#60A5FA" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">PORTFOLIO</text>
  </g>

  <!-- Main Name Title -->
  <text x="460" y="250" fill="#FFFFFF" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="800" letter-spacing="-0.5">Mullai Venese</text>

  <!-- Subtitle / Role -->
  <text x="460" y="305" fill="#38BDF8" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="600" letter-spacing="0.2">Front-End Developer &amp; UI/UX Designer</text>

  <!-- Bio / Focus -->
  <text x="460" y="360" fill="#94A3B8" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400">Web Development • UI/UX Design • Interactive Systems</text>

  <!-- Skill / Service Pills -->
  <g transform="translate(460, 405)">
    <rect x="0" y="0" width="130" height="38" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="65" y="24" text-anchor="middle" fill="#E2E8F0" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600">React / TS</text>

    <rect x="145" y="0" width="130" height="38" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="210" y="24" text-anchor="middle" fill="#E2E8F0" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600">UI/UX Figma</text>

    <rect x="290" y="0" width="145" height="38" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="362" y="24" text-anchor="middle" fill="#E2E8F0" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600">Web Animation</text>

    <rect x="450" y="0" width="130" height="38" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="515" y="24" text-anchor="middle" fill="#E2E8F0" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600">Full-Stack</text>
  </g>

  <!-- URL footer -->
  <text x="1100" y="540" text-anchor="end" fill="#64748B" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" letter-spacing="0.5">mullai-venese.web.app</text>
</svg>`;

function renderSvgToPng(svgStr, targetSize = null) {
  const options = {
    defaultFontFamily: {
      sansSerif: "Arial",
    },
  };
  if (targetSize) {
    options.fitTo = {
      mode: "width",
      value: targetSize,
    };
  }
  const resvg = new Resvg(svgStr, options);
  const pngData = resvg.render();
  return pngData.asPng();
}

/**
 * Creates a valid multi-size Windows .ico file containing PNG data
 * @param {Array<{size: number, buffer: Buffer}>} images
 */
function createIco(images) {
  const numImages = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + dirEntrySize * numImages;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO format
  header.writeUInt16LE(numImages, 4); // Count

  const dirEntries = [];
  const imageBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // Width
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // Height
    entry.writeUInt8(0, 2); // Colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset

    offset += img.buffer.length;
    dirEntries.push(entry);
    imageBuffers.push(img.buffer);
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

const publicDir = path.resolve("public");

console.log("Writing SVGs...");
fs.writeFileSync(path.join(publicDir, "favicon.svg"), makeFaviconSvg(512));
fs.writeFileSync(path.join(publicDir, "apple-touch-icon.svg"), appleTouchIconSvg);
fs.writeFileSync(path.join(publicDir, "og-image.svg"), ogBannerSvg);

console.log("Rendering Favicons and Icons...");
const png16 = renderSvgToPng(makeFaviconSvg(16));
const png32 = renderSvgToPng(makeFaviconSvg(32));
const png48 = renderSvgToPng(makeFaviconSvg(48));
const png96 = renderSvgToPng(makeFaviconSvg(96));
const png192 = renderSvgToPng(makeFaviconSvg(192));
const png512 = renderSvgToPng(makeFaviconSvg(512));

fs.writeFileSync(path.join(publicDir, "favicon-16x16.png"), png16);
fs.writeFileSync(path.join(publicDir, "favicon-32x32.png"), png32);
fs.writeFileSync(path.join(publicDir, "favicon-48x48.png"), png48);
fs.writeFileSync(path.join(publicDir, "favicon-96x96.png"), png96);
fs.writeFileSync(path.join(publicDir, "favicon-192x192.png"), png192);
fs.writeFileSync(path.join(publicDir, "favicon-512x512.png"), png512);
fs.writeFileSync(path.join(publicDir, "favicon.png"), png512);

console.log("Rendering Apple Touch Icon 180x180...");
const applePng = renderSvgToPng(appleTouchIconSvg);
fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), applePng);

console.log("Rendering Square OG Image 512x512 (for WhatsApp / Telegram / Slack)...");
const ogSquarePng = renderSvgToPng(ogSquareSvg);
fs.writeFileSync(path.join(publicDir, "og-square.png"), ogSquarePng);

console.log("Rendering 1200x630 Open Graph Banner (for Twitter Large Card, LinkedIn, FB)...");
const ogBannerPng = renderSvgToPng(ogBannerSvg);
fs.writeFileSync(path.join(publicDir, "og-image.png"), ogBannerPng);
fs.writeFileSync(path.join(publicDir, "og-image.jpg"), ogBannerPng);

console.log("Generating multi-resolution favicon.ico (16x16, 32x32, 48x48)...");
const icoBuffer = createIco([
  { size: 16, buffer: png16 },
  { size: 32, buffer: png32 },
  { size: 48, buffer: png48 },
]);
fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);

console.log("All assets generated successfully!");
