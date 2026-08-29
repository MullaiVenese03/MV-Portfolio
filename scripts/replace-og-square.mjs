import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const uploadedPath = "C:/Users/mulla/.gemini/antigravity-ide/brain/4839bb46-2e9e-478f-9370-2fc3831ed6d2/.user_uploaded/media_1788022291803.png";
const uploadedBuf = fs.readFileSync(uploadedPath);
const base64Img = uploadedBuf.toString("base64");

// 1. Create a 512x512 square SVG with exact #2563EB background embedding the uploaded banner seamlessly centered
const ogSquareSvg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Made by MV">
  <rect width="512" height="512" fill="#2563EB"/>
  <image href="data:image/png;base64,${base64Img}" x="-80" y="106" width="672" height="201.6" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

// The scale: width=672 (scale factor 0.672), so the 548px content (logo + MADE BY MV) becomes ~368px wide in the 512x512 square (centered at x=256, y=256).
// Content bounds in 1000x300: center is at x=498.5, y=167.
// With x = 256 - (498.5 * 0.672) = 256 - 335 = -79 (~ -80)
// With y = 256 - (167 * 0.672) = 256 - 112.2 = 143.8

const refinedSquareSvg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Made by MV">
  <rect width="512" height="512" fill="#2563EB"/>
  <image href="data:image/png;base64,${base64Img}" x="-79" y="144" width="672" height="201.6" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

fs.writeFileSync("public/og-square.svg", refinedSquareSvg);

const resvg = new Resvg(refinedSquareSvg, {
  fitTo: { mode: "width", value: 512 },
});
const pngData = resvg.render().asPng();

fs.writeFileSync("public/og-square.png", pngData);

console.log("og-square.png generated successfully, size:", pngData.length, "bytes");
const w = pngData.readUInt32BE(16);
const h = pngData.readUInt32BE(20);
console.log("Dimensions:", w, "x", h);
