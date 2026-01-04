export async function loader() {
  const SITE = "https://abik.ee";
  const langs = ["ee", "ru"] as const;
  const pages = ["/", "/privacy-policy"] as const;

  const urls = pages
    .flatMap((p) =>
      langs.map((l) => {
        const loc = `${SITE}${p}?lang=${l}`;
        const priority = p === "/" ? "1.0" : "0.3";
        return `
  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
