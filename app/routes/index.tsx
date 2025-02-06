import Main from "../islands/Main.tsx";
import LogoWidget from "../islands/LogoWidget.tsx";
import { FreshContext, Handlers } from "$fresh/server.ts";
import UsersTable from "../db/schema/users.ts";
import { State } from "./_middleware.ts";

export const handler: Handlers<unknown, State> = {
  async GET(_req: Request, ctx: FreshContext<State>) {
    const user = await UsersTable.find(ctx, "google@google.com");
    console.log(user);
    return ctx.render();
  },
};

export default function Home() {
  return (
    <>
      <LogoWidget></LogoWidget>
      <Main></Main>
    </>
  );
}
