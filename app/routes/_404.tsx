import { Head } from "$fresh/runtime.ts";
import LogoWidget from "../islands/LogoWidget.tsx";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="min-h-screen flex flex-col items-center p-8">
        <LogoWidget></LogoWidget>
        <div class="w-full max-w-4xl mt-4 p-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 class="text-3xl font-bold text-red-500 mb-6">
            Pagina non trovata
          </h2>
          <p class="text-white">
            Abbiamo cercato ovunque, ma non abbiamo trovato nulla. Hai provato a
            guardare nel tuo cuore?
          </p>
        </div>
      </div>
    </>
  );
}
