// Bridge Cloudflare Pages context to Vercel request/response signature
export async function adapt(context, handler) {
  const { request, env } = context;

  // Polyfill process.env for Cloudflare Workers compatibility
  if (!globalThis.process) {
    globalThis.process = { env: {} };
  } else if (!globalThis.process.env) {
    globalThis.process.env = {};
  }
  Object.assign(globalThis.process.env, env);

  // Parse query parameters
  const url = new URL(request.url);
  const query = {};
  for (const [key, val] of url.searchParams.entries()) {
    query[key] = val;
  }

  // Parse JSON body if present
  let body = {};
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      body = await request.clone().json();
    } catch (e) {
      body = {};
    }
  }

  // Header proxy to handle case-insensitivity in Express-like headers mapping
  const headersProxy = new Proxy({}, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      return request.headers.get(prop.toLowerCase()) || undefined;
    }
  });

  const vercelRequest = {
    method: request.method,
    headers: headersProxy,
    body,
    query,
    url: request.url,
    env,
  };

  let statusCode = 200;
  const responseHeaders = new Headers({
    'Content-Type': 'application/json'
  });
  let responseData = null;

  const vercelResponse = {
    status(code) {
      statusCode = code;
      return vercelResponse;
    },
    setHeader(name, value) {
      responseHeaders.set(name, value);
      return vercelResponse;
    },
    json(data) {
      responseData = JSON.stringify(data);
      responseHeaders.set('Content-Type', 'application/json');
      return vercelResponse;
    },
    send(data) {
      responseData = data;
      return vercelResponse;
    },
    end() {
      return vercelResponse;
    }
  };

  await handler(vercelRequest, vercelResponse);

  return new Response(responseData, {
    status: statusCode,
    headers: responseHeaders
  });
}
