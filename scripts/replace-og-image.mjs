import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const uploadedPath = "C:/Users/mulla/.gemini/antigravity-ide/brain/4839bb46-2e9e-478f-9370-2fc3831ed6d2/.user_uploaded/media_1788022291803.png";
const uploadedBuf = fs.readFileSync(uploadedPath);
const base64Img = uploadedBuf.toString("base64");

// 1. Create a 1200x630 SVG with exact #2563EB background embedding the uploaded banner seamlessly centered
const ogSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Made by MV">
  <rect width="1200" height="630" fill="#2563EB"/>
  <image href="data:image/png;base64,${base64Img}" x="100" y="165" width="1000" height="300" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

fs.writeFileSync("public/og-image.svg", ogSvg);

const resvg = new Resvg(ogSvg, {
  fitTo: { mode: "width", value: 1200 },
});
const pngData = resvg.render().asPng();

fs.writeFileSync("public/og-image.png", pngData);
fs.writeFileSync("public/og-image.jpg", pngData);
fs.writeFileSync("public/og-banner-original.png", uploadedBuf);

console.log("og-image.png generated successfully, size:", pngData.length, "bytes");
const w = pngData.readUInt32BE(16);
const h = pngData.readUInt32BE(20);
console.log("Dimensions:", w, "x", h);
