export default {
    async fetch(request, env, ctx) {
        if (env.ASSETS) {
            try {
                return await env.ASSETS.fetch(request);
            } catch (e) {
                return new Response("Error fetching asset: " + e.message, { status: 500 });
            }
        }
        return new Response("Worker is running, but ASSETS binding is missing. Ensure [site] bucket is configured correctly in wrangler.toml.", { status: 500 });
    },
};
