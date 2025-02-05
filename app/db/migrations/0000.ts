import {
  Client,
  PoolClient,
} from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { DatabaseMigration, getCurrentMigrationVersion } from "./index.ts";

export default new class Migration0000 implements DatabaseMigration {
  version = 0;

  async apply(db: Client | PoolClient) {
    await db.queryArray`
    CREATE TABLE IF NOT EXISTS schema_migrations(
      version integer PRIMARY KEY,
      date TIMESTAMP DEFAULT NOW()
    );`;
    const dbVersion = await getCurrentMigrationVersion(db);
    if (!dbVersion === undefined) {
      db.queryArray`INSERT INTO schema_migrations(version) VALUES(${this.version});`
    }
  }
}();
