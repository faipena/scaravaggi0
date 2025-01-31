import Router from "../router.ts";

export enum TwitchEventSubHeaders {
  messageId = "Twitch-Eventsub-Message-Id",
  messageRetry = "Twitch-Eventsub-Message-Retry",
  messageType = "Twitch-Eventsub-Message-Type",
  messageSignature = "Twitch-Eventsub-Message-Signature",
  messageTimestamp = "Twitch-Eventsub-Message-Timestamp",
  subscriptionType = "Twitch-Eventsub-Subscription-Type",
  subscriptionVersion = "Twitch-Eventsub-Subscription-Version",
}

export interface TwitchEventSub {
  message: {
    id: string;
  };
}

export default class EventSubHandler {
  #router: Router;
  #secret: string;

  constructor(
    router: Router,
    path: RegExp = /^\/webhooks\/twitch\/?$/,
    secret?: string,
  ) {
    this.#router = router;
    this.#secret = secret ?? crypto.randomUUID();

    router.get(path, (request: Request): Response | undefined => {
      const messageId = request.headers.get(TwitchEventSubHeaders.messageId);
      return new Response("test", { status: 200 });
    });
  }
}
