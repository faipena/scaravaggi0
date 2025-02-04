import {
  Client,
  PoolClient,
} from "https://deno.land/x/postgres@v0.19.3/client.ts";
import Migration0000 from "./0000.ts";

export interface DatabaseMigration {
  version: number;
  apply(db: Client | PoolClient): void;
}

const migrations: DatabaseMigration[] = [
  Migration0000,
];

export default function applyAllMigrations(db: Client | PoolClient) {
  migrations.forEach((migration) => {
    console.log(migration.version);
    migration.apply(db);
  });
}
