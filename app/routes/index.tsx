import Main, { MainStatus } from "../islands/Main.tsx";
import LogoWidget from "../islands/LogoWidget.tsx";
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import UsersTable from "../db/schema/users.ts";
import { State } from "./_middleware.ts";
import { useSignal } from "@preact/signals";

export const handler: Handlers<Data, State> = {
  async GET(_req: Request, ctx: FreshContext<State>) {
    // const user = await UsersTable.find(ctx, "google@google.com");
    // console.log(user);
    const videoId = "yhzRK7a6vqo";
    return ctx.render({ videoId });
  },
};

interface Data {
  videoId: string;
}

export default function Home({ data }: PageProps<Data>) {
  const videoId = useSignal(data.videoId);
  const formStatus = useSignal(MainStatus.Start);
  return (
    <>
      <div class="min-h-screen flex flex-col items-center p-8">
        <LogoWidget></LogoWidget>
        <Main videoId={videoId} status={formStatus}></Main>
      </div>
    </>
  );
}
