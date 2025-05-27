export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) return new Response('Missing URL', { status: 400 })

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeoutId);

    return new Response(null, { status: res.ok ? 200 : 503 });
  } catch {
    return new Response(null, { status: 503 });
  }
}