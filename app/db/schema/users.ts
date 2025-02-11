import { FreshContext } from "$fresh/server.ts";
import { DatabaseState } from "../../routes/_middleware.ts";

export type UserRole = "User" | "Caster";

export interface UserRow {
  id: number;
  email: string;
  password?: Uint8Array;
  role: UserRole;
  registrationDate: Temporal.Instant;
}

export default class UsersTable {
  static async insert(ctx: FreshContext<DatabaseState>, email: string) {
    await ctx.state.db
      .queryObject`INSERT INTO users.logins(email) VALUES(${email});`;
  }

  static async find(
    ctx: FreshContext<DatabaseState>,
    email: string,
  ): Promise<UserRow | undefined> {
    const r = await ctx.state.db.queryObject<
      UserRow
    >({
      args: { email },
      camelCase: true,
      text: "SELECT * FROM users.logins WHERE email=$email;",
    });
    return (r.rowCount ?? 0 > 0) ? r.rows[0] : undefined;
  }
}
