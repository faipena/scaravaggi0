const KV_PATH = await Deno.env.get("KV_PATH");
const db = await Deno.openKv(KV_PATH);

export default db;
