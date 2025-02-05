import { Client, PoolClient } from "https://deno.land/x/postgres@v0.19.3/client.ts";

export class VirtualDatabaseMigration {
    protected db: Client | PoolClient;
    protected version: number;
  
    constructor(db: Client | PoolClient, version: number) {
      this.db = db;
      this.version = version;
    }
    
    async dbVersion(): Promise<number | undefined> {
      try {
        const result = await this.db.queryArray<[number]>`SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1;`;
        return result.rows[0][0];  
      } catch {
        return undefined;
      }
    }
  
    async needsToBeApplied(): Promise<boolean> {
      return ((await this.dbVersion()) ?? -1) < this.version;
    }
  
    protected apply?(): void;
  
    public toString(): string {
      return `${this.constructor.name}`
    }

    protected async updateDbVersion() {
        await this.db.queryArray`INSERT INTO schema_migrations(version) VALUES(${this.version});`
    }
  }
  
  export interface DatabaseMigration {
    needsToBeApplied(): Promise<boolean>;
    apply(): Promise<void>;
  }