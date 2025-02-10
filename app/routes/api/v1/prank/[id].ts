import { FreshContext } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req: Request, _ctx: FreshContext) {
    console.log();
    return new Response(_ctx.params.id, { status: 200 });
  },
  // async PUT(req: Request, _ctx: FreshContext) {
  //   if (!BOT_TOKEN) {
  //     return new Response("Server configuration error", { status: 500 });
  //   }
  //   if (req.headers.get("bot-token") === BOT_TOKEN) {
  //     const body = await req.json();
  //     console.info("Live status update requested ", body);
  //     AppState.isLive = body.isLive;
  //     return new Response();
  //   }
  //   return new Response("Unauthorized", { status: 401 });
  // },
};
