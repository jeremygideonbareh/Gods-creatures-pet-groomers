import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { resolve } from "path";

const URL = "https://godscreaturespet.in";
const OUT = resolve("video-demo/assets");

mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "hero", width: 1920, height: 1080 },
  { name: "why-choose-us", width: 1920, height: 1080 },
  { name: "services", width: 1920, height: 1080 },
  { name: "reviews", width: 1920, height: 1080 },
  { name: "booking", width: 1920, height: 1080 },
  { name: "profile", width: 1920, height: 1080, path: "/profile" },
  { name: "admin", width: 1920, height: 1080, path: "/admin" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

for (const v of viewports) {
  const url = v.path ? `${URL}${v.path}` : URL;
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  // scroll to section if needed
  if (v.name !== "hero" && !v.path) {
    await page.evaluate((name) => {
      const el = document.getElementById(name);
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    }, v.name);
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: `${OUT}/${v.name}.png`, fullPage: !v.path });
  console.log(`Captured ${OUT}/${v.name}.png`);
}

await browser.close();
console.log("All screenshots captured");
