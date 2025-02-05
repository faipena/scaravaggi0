import { Client, PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { DatabaseMigration, VirtualDatabaseMigration } from "./types.ts";

export default class Migration0000 extends VirtualDatabaseMigration implements DatabaseMigration {
  constructor(db: Client | PoolClient) {
    super(db, 0); // REMEMBER TO UPDATE VERSION
  }

  override async apply() {
    await this.db.queryArray`
    CREATE TABLE IF NOT EXISTS schema_migrations(
      version integer PRIMARY KEY,
      date timestamp DEFAULT NOW()
    );`;

    await this.updateDbVersion(); // DO NOT REMOVE
  }
};
