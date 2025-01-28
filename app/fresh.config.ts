import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

const DENO_PORT: number = +(Deno.env.get("DENO_PORT") ?? "8000");
const DENO_IP = Deno.env.get("DENO_IP") ?? "127.0.0.1"

export default defineConfig({
  server: {
    port: DENO_PORT,
    hostname: DENO_IP,
  },
  plugins: [tailwind()],
});
