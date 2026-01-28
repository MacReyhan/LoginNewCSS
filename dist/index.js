import html from './index.html';

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'GET') {
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
    return new Response('Method not allowed', { status: 405 });
  },
};
