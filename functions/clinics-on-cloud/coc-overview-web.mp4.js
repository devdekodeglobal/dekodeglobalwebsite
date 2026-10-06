// Range request handler for Clinics on Cloud MP4 video
export async function onRequest(context) {
  const { request, env } = context;

  // Let Cloudflare fetch the asset from the underlying static asset store
  const response = await env.ASSETS.fetch(request.url, {
    headers: {
      // Do not forward range header to ASSETS fetch so we get the full asset buffer or stream
      'Accept-Encoding': 'identity'
    }
  });

  if (!response.ok) {
    return response;
  }

  const rangeHeader = request.headers.get('range');
  const buffer = await response.arrayBuffer();
  const total = buffer.byteLength;

  if (!rangeHeader) {
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(total),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Parse Range: bytes=start-end
  const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
  if (!match) {
    return new Response('Invalid Range', {
      status: 416,
      headers: {
        'Content-Range': `bytes */${total}`,
        'Accept-Ranges': 'bytes'
      }
    });
  }

  let start = match[1] ? parseInt(match[1], 10) : 0;
  let end = match[2] ? parseInt(match[2], 10) : total - 1;

  if (isNaN(start)) start = 0;
  if (isNaN(end) || end >= total) end = total - 1;

  if (start > end || start >= total) {
    return new Response(null, {
      status: 416,
      headers: {
        'Content-Range': `bytes */${total}`,
        'Accept-Ranges': 'bytes'
      }
    });
  }

  const chunk = buffer.slice(start, end + 1);

  return new Response(chunk, {
    status: 206,
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Content-Length': String(chunk.byteLength),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
