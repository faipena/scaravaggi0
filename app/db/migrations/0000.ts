import {
  Client,
  PoolClient,
} from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { DatabaseMigration } from "./index.ts";

export default new class Migration0000 implements DatabaseMigration {
  version = 0;

  async apply(db: Client | PoolClient) {
    const result = await db.queryArray(`SELECT version FROM schema_migrations`);
    return result;
  }
}();
