export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const project = searchParams.get('project');

  if (!project) return new Response('Missing project', { status: 400 });

  const token = process.env.VERCEL_API_TOKEN;
  if (!token) return new Response('Missing VERCEL_API_TOKEN', { status: 500 });

  const teamId = process.env.VERCEL_TEAM_ID;
  if (!teamId) return new Response('Missing VERCEL_TEAM_ID', { status: 500 });

  try {
    const res = await fetch(
      `https://api.vercel.com/v9/projects/${encodeURIComponent(project)}?teamId=${teamId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) return new Response(null, { status: 503 });

    const data = await res.json();
    const production = data.targets?.production;

    if (!production) return new Response(null, { status: 503 });

    const { readyState } = production;
    const status =
      readyState === 'READY' ? 'online' :
      readyState === 'ERROR' || readyState === 'CANCELED' ? 'offline' :
      'deploying';

    return Response.json({ status });
  } catch {
    return new Response(null, { status: 503 });
  }
}
