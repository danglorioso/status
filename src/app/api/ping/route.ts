export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) return new Response('Missing URL', { status: 400 })

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StatusBot/1.0)' },
    });
    clearTimeout(timeoutId);

    // Treat any non-5xx as online — a 403 from Cloudflare still means the site is reachable
    return new Response(null, { status: res.status < 500 ? 200 : 503 });
  } catch {
    return new Response(null, { status: 503 });
  }
}