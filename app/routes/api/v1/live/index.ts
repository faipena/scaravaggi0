import { FreshContext } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import AppState from "../../../../appState.ts";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");

export const handler: Handlers = {
  GET(_req: Request, _ctx: FreshContext) {
    return new Response(JSON.stringify({ isLive: AppState.isLive }));
  },

  async PUT(req: Request, _ctx: FreshContext) {
    if (!BOT_TOKEN) {
      return new Response("Server configuration error", { status: 500 });
    }
    if (req.headers.get("bot-token") === BOT_TOKEN) {
      const body = await req.json();
      console.info("Live status update requested ", body);
      AppState.isLive = body.isLive;
      return new Response();
    }
    return new Response("Unauthorized", { status: 401 });
  },
};
