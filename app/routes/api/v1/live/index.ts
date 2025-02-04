import { FreshContext } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import AppState from "../../../../appState.ts";

export const handler: Handlers = {
  GET(_req: Request, ctx: FreshContext) {
    return new Response(JSON.stringify({ isLive: AppState.isLive }));
  },

  async PUT(_req: Request, ctx: FreshContext) {
    if (_req.headers.get("bot-token") === "iMtheB0t") {
      const { isLive } = await _req.json();
      AppState.isLive = isLive;
      return new Response();
    }
    return new Response("Unauthorized", { status: 401 });
  },
};
