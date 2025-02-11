import { FreshContext } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { DatabaseState } from "../../_middleware.ts";

export const handler: Handlers<unknown, DatabaseState> = {
  GET(_req: Request, _ctx: FreshContext<DatabaseState>) {
    console.log();

    return new Response(_ctx.params.confirmationCode, { status: 200 });
  },
};
