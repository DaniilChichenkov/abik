export async function loader() {
  const content = `
User-agent: *
Disallow: /admin/
Disallow: /login
Disallow: /feedback
Disallow: /service/request

Sitemap: https://abik.ee/sitemap.xml
  `.trim();

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
