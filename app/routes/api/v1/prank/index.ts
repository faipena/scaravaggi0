import { FreshContext } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { PranksTable } from "../../../../db/schema/pranks.ts";
import Email from "../../../../email.ts";
import { DatabaseState } from "../../../_middleware.ts";

function optional(value: string): string | undefined {
  return (value.trim().length == 0) ? undefined : value.trim();
}

function optionalDate(value: string): Temporal.PlainDate | undefined {
  try {
    return Temporal.PlainDate.from(value);
  } catch {
    return undefined;
  }
}

const LEET_ALPHABET: { [char: string]: string } = {
  0: "o",
  1: "i",
  3: "e",
  4: "a",
  5: "s",
  8: "b",
};

function leetCompare(input: string, value: string) {
  return input.toLowerCase().split("").map((
    value: string,
  ) => (LEET_ALPHABET[value] ?? value)).join("") === value;
}

export const handler: Handlers<unknown, DatabaseState> = {
  async POST(req: Request, ctx: FreshContext<DatabaseState>) {
    try {
      const body = await req.json();
      const response = new Response(JSON.stringify({ "message": "ok" }));
      // TODO: rate limiting
      // TODO: validate data
      if (
        !leetCompare(body.superSecretCode, "coglione") &&
        !leetCompare(body.superSecretCode, "loprendiinculo")
      ) {
        return response;
      }
      const timeDiff = new Date().getTime() - body.weddingDate;
      if (
        Number.isNaN(timeDiff) ||
        // 30 seconds not ellapsed
        (timeDiff < 30_000) ||
        // More than 1 day ellapsed
        (timeDiff > (60_000 * 60 * 24))
      ) {
        return response;
      }

      const confirmationCode = await PranksTable.insertToBeConfirmed(ctx, {
        victimName: body.victimName,
        victimPhoneNumber: body.victimPhoneNumber,
        description: body.description,
        email: body.email,
        victimBirthCity: optional(body.victimBirthCity),
        victimBirthDate: optionalDate(body.victimBirthDate),
        victimCurrentCity: optional(body.victimCurrentCity),
        relationship: optional(body.relationship),
      });
      Email.sendPrankConfirmation(body.email, confirmationCode);
      return response;
    } catch {
      return new Response(JSON.stringify({ "error": "invalid request" }), {
        status: 400,
      });
    }
  },
};
