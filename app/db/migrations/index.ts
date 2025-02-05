import {
  Client,
  PoolClient,
} from "https://deno.land/x/postgres@v0.19.3/client.ts";
import { DatabaseMigration } from "./types.ts";
import Migration0000 from "./0000.ts";
import Migration0001 from "./0001.ts";



const migrations: (new(db: Client | PoolClient) => DatabaseMigration)[] = [
  Migration0000,
  Migration0001,
];


export default async function applyAllMigrations(db: Client | PoolClient) {
  console.info("Starting database migrations");
  for(const migrationType of migrations) {
    const migration = new migrationType(db);
    if (await migration.needsToBeApplied()) {
      console.info(`Applying ${migration}`);
      await migration.apply();
    } else {
      console.info(`Skipping ${migration}`);
    }
  };
}
