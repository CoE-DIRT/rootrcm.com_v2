import sharp from "sharp";
const jobs = [
  { src: 'public/media/stock/analytics-team.webp', out: 'analytics-review', top: 0.5 },
  { src: 'public/media/stock/revenue-analytics.webp', out: 'revenue-charts', top: 0.52 },
];
for (const j of jobs) {
  const img = sharp(j.src);
  const { width, height } = await img.metadata();
  const h = Math.round(width * 9 / 16);
  const top = Math.max(0, Math.min(height - h, Math.round(height * j.top - h / 2)));
  for (const w of [1280, 640]) {
    await sharp(j.src).extract({ left: 0, top, width, height: h }).resize(w, Math.round(w * 9 / 16)).webp({ quality: 78 }).toFile(`public/imagery/photo/${j.out}-${w}.webp`);
  }
  await sharp(j.src).extract({ left: 0, top, width, height: h }).resize(640).png().toFile(`/tmp/prev-${j.out}.png`);
}
