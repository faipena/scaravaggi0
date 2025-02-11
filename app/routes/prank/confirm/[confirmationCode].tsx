import { FreshContext, PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { PranksTable } from "../../../db/schema/pranks.ts";
import { DatabaseState } from "../../_middleware.ts";
import LogoWidget from "../../../islands/LogoWidget.tsx";
import ConfirmationResult from "../../../islands/PrankConfirmation.tsx";

export const handler: Handlers<unknown, DatabaseState> = {
  async GET(_req: Request, ctx: FreshContext<DatabaseState>) {
    const prank = await PranksTable.confirmPrank(
      ctx,
      ctx.params.confirmationCode,
    );
    if (prank) {
      // TODO: send email or transfer to permanent table
      return ctx.render({ success: true });
    }
    return ctx.render({ success: false }, { status: 404 });
  },
};

interface Data {
  success: boolean;
}

export default function PrankConfirmation({ data }: PageProps<Data>) {
  const success = data.success;
  return (
    <>
      <div class="min-h-screen flex flex-col items-center p-8">
        <LogoWidget></LogoWidget>
        <ConfirmationResult success={success}></ConfirmationResult>
      </div>
    </>
  );
}
