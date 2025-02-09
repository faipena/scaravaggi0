import { FreshContext } from "$fresh/server.ts";
import { PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import getDatabasePool from "../db/index.ts";

export interface State {
  db: PoolClient;
}

/* Database connection handler */
export async function handler(
  _req: Request,
  ctx: FreshContext<State>,
) {
  const dbPool = await getDatabasePool();
  ctx.state.db = await dbPool.connect();
  const resp = await ctx.next();
  ctx.state.db.release();
  return resp;
}
