import { FreshContext } from "$fresh/server.ts";
import { PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import databasePool from "../db/index.ts";

export interface State {
  db: PoolClient;
}

/* Database connection handler */
export async function handler(
  _req: Request,
  ctx: FreshContext<State>,
) {
  ctx.state.db = await databasePool.connect();
  const resp = await ctx.next();
  ctx.state.db.release();
  return resp;
}
