import {
  Client,
  PoolClient,
} from "https://deno.land/x/postgres@v0.19.3/mod.ts";

export interface UserRow {
  id: number;
  email: string;
  registration_date: Temporal.Instant;
}

export default class UsersTable {
  #db: Client | PoolClient;
  constructor(db: Client | PoolClient) {
    this.#db = db;
  }

  async insert(email: string) {
    await this.#db.queryObject`INSERT INTO users(email) VALUES(${email});`;
  }

  async find(email: string): Promise<UserRow | undefined> {
    const r = await this.#db.queryObject<
      UserRow
    >`SELECT * FROM users WHERE email=${email};`;
    return (r.rowCount ?? 0 > 0) ? r.rows[0] : undefined;
  }
}
