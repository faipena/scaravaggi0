import { FreshContext } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { PranksTable } from "../../../../db/schema/pranks.ts";
import Email from "../../../../smtp.ts";
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

export const handler: Handlers<unknown, DatabaseState> = {
  async POST(req: Request, ctx: FreshContext<DatabaseState>) {
    try {
      const body = await req.json();
      // TODO: captcha
      // TODO: rate limiting
      // TODO: validate data
      const response = new Response(JSON.stringify({ "message": "ok" }));
      console.log(body);
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
