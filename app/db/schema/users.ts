import { FreshContext } from "$fresh/server.ts";
import { State } from "../../routes/_middleware.ts";

export enum UserRole {
  User = 0,
  Moderator = 10,
  Caster = 20,
  Admin = 30,
}

export interface UserRow {
  id: number;
  email: string;
  password?: Uint8Array;
  role: UserRole,
  registrationDate: Temporal.Instant;
}

export default class UsersTable {
  static async insert(ctx: FreshContext<State>, email: string) {
    await ctx.state.db.queryObject`INSERT INTO users(email) VALUES(${email});`;
  }

  static async find(
    ctx: FreshContext<State>,
    email: string,
  ): Promise<UserRow | undefined> {
    const r = await ctx.state.db.queryObject<
      UserRow
    >({
      args: { email: email },
      camelCase: true,
      text: `SELECT * FROM users WHERE email=$email;`,
    });
    return (r.rowCount ?? 0 > 0) ? r.rows[0] : undefined;
  }
}
