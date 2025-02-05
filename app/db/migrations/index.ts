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

export async function getCurrentMigrationVersion(db: Client | PoolClient): Promise<number> {
    const result = await db.queryArray<[number]>`SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1;`;
    return result.rows[0][0];
}

export default function applyAllMigrations(db: Client | PoolClient) {
  migrations.forEach((migration) => {
    console.log(`Applying migration ${migration.version}`);
    migration.apply(db);
  });
}
