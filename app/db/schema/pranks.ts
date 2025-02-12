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
  victimBirthDate?: Temporal.PlainDate;
  relationship?: string;
}

export interface ToBeConfirmedPrankOptions extends CommonPranksOptions {
  email: string;
}

export interface PrankToBeConfirmed extends ToBeConfirmedPrankOptions {
  id: number;
  sentDate: Temporal.Instant;
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
    const confirmationCode = crypto.randomUUID();
    await ctx.state.db.queryObject(
      {
        args: [
          confirmationCode,
          email,
          victimName,
          victimPhoneNumber,
          relationship,
          prankTypeId,
          description,
          victimBirthCity,
          victimBirthDate?.toString(),
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
    return confirmationCode;
  }

  static async confirmPrank(
    ctx: FreshContext<DatabaseState>,
    confirmationCode: string,
  ): Promise<PrankToBeConfirmed | undefined> {
    try {
      const transaction = ctx.state.db.createTransaction(
        "confirm_prank",
        { isolation_level: "serializable" },
      );
      await transaction.begin();
      const result = await transaction.queryObject<
        PrankToBeConfirmed
      >({
        args: { confirmationCode },
        camelCase: true,
        text:
          `SELECT * FROM pranks.tobeconfirmed WHERE confirmation_code=$confirmationCode`,
      });
      if ((result.rowCount ?? 0) === 0) {
        await transaction.rollback();
        return;
      }
      await transaction
        .queryArray`DELETE FROM pranks.tobeconfirmed WHERE confirmation_code=${confirmationCode}`;
      await transaction.commit();
      return result.rows[0];
    } catch {
      return;
    }
  }
}
