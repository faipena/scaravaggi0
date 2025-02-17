import db from "./src/db.ts";
import Router from "./src/router.ts";
import Telegram from "./src/telegram/telegram.ts";
import Twitch from "./src/twitch/twitch.ts";

const TELEGRAM_TOKEN = Deno.env.get("TG_T0K3N");
const TELEGRAM_GROUP = Deno.env.get("TG_CH4T_1D");
const TWITCH_CLIENT_ID = Deno.env.get("TW_CL13NT_1D");
const TWITCH_CLIENT_SECRET = Deno.env.get("TW_CL13NT_S3CR3T");
const TWITCH_CHANNEL = Deno.env.get("TW_CHANN3L");
const APP_API_TOKEN = Deno.env.get("APP_API_TOKEN");
const APP_HOST = Deno.env.get("APP_HOST");
const APP_API_URL = `${APP_HOST}/api/v1/live`;

async function updateLiveStatus(isLive: boolean) {
  if (!APP_API_TOKEN) {
    console.warn("No API token provided, cannot update live status");
    return;
  }
  console.info(`Updating web app live status to ${isLive}`);
  try {
    const response = await fetch(APP_API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "bot-token": APP_API_TOKEN,
      },
      body: JSON.stringify({ isLive }),
    });
    if (!response.ok) {
      console.error(
        "Failed to update web app live status, status text:",
        response.statusText,
      );
    }
  } catch (error) {
    console.error("Failed to update web app live status:", error);
  }
}

async function onLiveStart(telegram: Telegram, chat: number) {
  console.info("Live started, lets go!");
  try {
    const messageId = await telegram.sendPinnedMessage(
      chat,
      "Scaravaggi0 è live! Seguilo ora su twitch: https://twitch.tv/scaravaggi0",
    );
    const result = await db.get(["telegram", "pinnedMessages"]);
    const pinnedMessages: number[] = Array.isArray(result.value)
      ? result.value
      : [];
    const updatedPinnedMessages = [...pinnedMessages, messageId];
    // FIXME: atomic operations
    await db.set(["telegram", "pinnedMessages"], updatedPinnedMessages);
  } catch {
    console.warn("Probably could not pin message");
  }
}

async function onLiveEnd(telegram: Telegram, chat: number) {
  console.info("Live ended, sadge :(");
  try {
    const result = await db.get(["telegram", "pinnedMessages"]);
    const pinnedMessages: number[] = Array.isArray(result.value)
      ? result.value
      : [];
    pinnedMessages.forEach(async (messageId) => {
      try {
        await telegram.unpinMessage(chat, messageId);
      } catch {
        console.warn("Probably could not unpin message");
      }
    });
    // FIXME: atomic operations
    await db.delete(["telegram", "pinnedMessages"]);
  } catch {
    console.warn("Failed to update live status");
  }
}

if (import.meta.main) {
  try {
    let telegramAvailable: boolean = true;

    if (TELEGRAM_TOKEN === undefined) {
      console.warn("Cannot get telegram token");
      telegramAvailable = false;
    }
    if (TELEGRAM_GROUP === undefined) {
      console.warn("Cannot get telegram group id");
      telegramAvailable = false;
    }
    if (TWITCH_CLIENT_ID === undefined) {
      throw new Error(`Cannot get telegram client id`);
    }
    if (TWITCH_CLIENT_SECRET === undefined) {
      throw new Error(`Cannot get twitch client secret`);
    }
    if (TWITCH_CHANNEL === undefined) {
      throw new Error(`Cannot get twitch channel`);
    }

    if (!telegramAvailable) {
      console.warn("Telegram is not available, bot will run without it");
    }
    const TELEGRAM_GROUP_ID: number = +TELEGRAM_GROUP!;
    // TODO: handle telegram updates
    const router = new Router();
    const telegram = new Telegram(TELEGRAM_TOKEN!);

    const twitch = new Twitch(
      TWITCH_CHANNEL,
      db,
      TWITCH_CLIENT_ID,
      TWITCH_CLIENT_SECRET,
    );
    await twitch.init();
    twitch.startMonitoring();
    twitch.onOnline = async (statusChanged: boolean) => {
      if (statusChanged && telegramAvailable) {
        await onLiveStart(telegram, TELEGRAM_GROUP_ID);
      }
      await updateLiveStatus(true);
    };
    twitch.onOffline = async (statusChanged: boolean) => {
      if (statusChanged && telegramAvailable) {
        await onLiveEnd(telegram, TELEGRAM_GROUP_ID);
      }
      await updateLiveStatus(false);
    };

    Deno.addSignalListener("SIGINT", () => {
      console.log("Caught SIGINT. Exiting gracefully...");
      router.stopListening();
      Deno.exit(0);
    });

    router.listen();

    setInterval(() => {}, 1000);
  } catch (_error) {
    console.error(_error);
  }
}
