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

// deno-lint-ignore no-explicit-any
function validateForm(body: any): boolean {
  let valid = true;
  // Captchas
  valid &&= leetCompare(body.superSecretCode, "coglione") ||
    leetCompare(body.superSecretCode, "loprendiinculo");
  const timeDiff = new Date().getTime() - body.weddingDate;
  valid &&= !Number.isNaN(timeDiff);
  valid &&= !(timeDiff < 30_000); // 30 seconds not ellapsed
  valid &&= !(timeDiff > (60_000 * 60 * 24)); // More than 1 day ellapsed
  // Data validation
  valid &&= body.victimName.length < 100;
  valid &&= body.description.length > 100;
  valid &&= body.description.length < 1500;
  valid &&= body.email.length < 100;
  valid &&= body.victimName.trim().match(
    /^[A-Za-zÀ-ÖØ-öø-ÿ']+(\s[A-Za-zÀ-ÖØ-öø-ÿ']+)*$/i,
  ) !== null;
  valid &&=
    body.victimPhoneNumber.match(/^(\+39)?(0\d{7,11}|3\d{8,9})$/) !== null;
  valid &&=
    body.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) !==
      null;
  //TODO: validate description ?
  // Optional data
  if (optional(body.victimBirthCity)) {
    valid &&= body.victimBirthCity.length < 100;
    valid &&= body.victimBirthCity.trim().match(
      /^[A-Za-zÀ-ÖØ-öø-ÿ']+(\s[A-Za-zÀ-ÖØ-öø-ÿ']+)*$/i,
    ) !== null;
  }
  if (optional(body.victimCurrentCity)) {
    valid &&= body.victimCurrentCity.length < 100;
    valid &&= body.victimCurrentCity.trim().match(
      /^[A-Za-zÀ-ÖØ-öø-ÿ']+(\s[A-Za-zÀ-ÖØ-öø-ÿ']+)*$/i,
    ) !== null;
  }
  if (optional(body.relationship)) {
    valid &&= body.relationship.length < 100;
    valid &&= body.relationship.trim().match(/^[A-Za-zÀ-ÖØ-öø-ÿ']+$/i) !== null;
  }
  return valid;
}

export const handler: Handlers<unknown, DatabaseState> = {
  async POST(req: Request, ctx: FreshContext<DatabaseState>) {
    try {
      const body = await req.json();
      const response = new Response(JSON.stringify({ "message": "ok" }));
      // TODO: rate limiting

      if (!validateForm(body)) {
        return response;
      }

      const confirmationCode = await PranksTable.insertToBeConfirmed(ctx, {
        victimName: body.victimName.trim(),
        victimPhoneNumber: body.victimPhoneNumber.trim(),
        description: body.description.trim(),
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
