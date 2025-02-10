import { FreshContext } from "$fresh/server.ts";
import { PostgresError } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { DatabaseState } from "../../routes/_middleware.ts";

export interface PranksType {
  id: number;
  name: string;
}

export class PranksTypesTable {
  static async list(
    ctx: FreshContext<DatabaseState>,
  ): Promise<Array<PranksType>> {
    return (await ctx.state.db.queryObject<
      PranksType
    >`SELECT * FROM pranks.types;`).rows;
  }

  static async insert(ctx: FreshContext<DatabaseState>, prankName: string) {
    try {
      await ctx.state.db.queryObject({
        args: { prankName },
        camelCase: true,
        text: "INSERT INTO pranks.types(name) VALUES($prankName);",
      });
    } catch (e) {
      // Swallow PostrgresErrors, meaning the prank type already exists.
      if (!(e instanceof PostgresError)) {
        throw e;
      }
    }
  }
}

interface CommonPranksOptions {
  victimName: string;
  victimPhoneNumber: string;
  description: string;
  prankTypeId?: number;
  victimBirthCity?: string;
  victimCurrentCity?: string;
  victimBirthDate?: Temporal.Instant;
  relationship?: string;
}

export interface ToBeConfirmedPrankOptions extends CommonPranksOptions {
  email: string;
}

export class PranksTable {
  static async insertToBeConfirmed(
    ctx: FreshContext<DatabaseState>,
    { ...options }: ToBeConfirmedPrankOptions,
  ) {
    const {
      email,
      victimName,
      victimPhoneNumber,
      relationship,
      prankTypeId,
      description,
      victimBirthCity,
      victimBirthDate,
      victimCurrentCity,
    } = options;
    await ctx.state.db.queryObject(
      {
        args: [
          crypto.randomUUID(),
          email,
          victimName,
          victimPhoneNumber,
          relationship,
          prankTypeId,
          description,
          victimBirthCity,
          victimBirthDate,
          victimCurrentCity,
        ],
        text: `
            INSERT INTO pranks.tobeconfirmed(
                confirmation_code,
                email,
                victim_name,
                victim_phone_number,
                relationship,
                prank_type_id,
                description,
                victim_birth_city,
                victim_birth_date,
                victim_current_city
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
        `,
      },
    );
  }
}
