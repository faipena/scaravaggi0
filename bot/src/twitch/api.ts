import {
  TwitchCredentials,
  TwitchRequestCreateEventSub,
  TwitchRequestStreams,
  TwitchResponseCreateEventSub,
  TwitchResponsePaginated,
  TwitchResponseStreams,
} from "./types.ts";

const API_ID_URL = "https://id.twitch.tv";
const API_HELIX_URL = "https://api.twitch.tv/helix";

export enum TwitchAPIEndpoint {
  Auth = API_ID_URL,
  Helix = API_HELIX_URL,
}

type TwitchAPIRequestOptions = {
  path: string;
  method?: "GET" | "POST" | "DELETE",
  body?: object;
  urlParams?: URLSearchParams;
  headers?: Headers;
  endpoint?: TwitchAPIEndpoint;
  authenticated?: boolean;
};

export default class TwitchAPI {
  readonly #id;
  readonly #secret;
  #credentials?: TwitchCredentials;

  set credentials(value: TwitchCredentials) {
    this.#credentials = value;
  }

  constructor(id: string, secret: string) {
    this.#id = id;
    this.#secret = secret;
  }

  private async http(
    {
      urlParams = new URLSearchParams(),
      headers = new Headers(),
      endpoint = TwitchAPIEndpoint.Helix,
      authenticated = true,
      ...options
    }: TwitchAPIRequestOptions, // deno-lint-ignore no-explicit-any
  ): Promise<any> {
    const { path, body, method } = options;
    if (body) {
      headers.set("content-type", "application/json");
    }
    if (authenticated && this.#credentials) {
      headers.append("client-id", `${this.#id}`);
      headers.append(
        "authorization",
        `Bearer ${this.#credentials.access_token}`,
      );
    }
    const httpUrl = `${endpoint}/${path}?${urlParams}`;
    const httpMethod = method ?? (body ? "POST" : "GET");
    const httpBody = body ? JSON.stringify(body) : undefined;
    const response = await fetch(
      httpUrl,
      {
        method: httpMethod,
        headers,
        body: httpBody,
      },
    );
    if (!response.ok) {
      throw Error(
        `Invalid response from twitch server (HTTP ${response.status}): ${await response
          .text()}`,
      );
    }
    return await response.json();
  }

  async getToken(): Promise<TwitchCredentials> {
    return await this.http({
      path: "oauth2/token",
      body: {
        client_id: this.#id,
        client_secret: this.#secret,
        grant_type: "client_credentials",
      },
      endpoint: TwitchAPIEndpoint.Auth,
      authenticated: false,
    });
  }

  async getStreams(
    params?: TwitchRequestStreams,
  ): Promise<TwitchResponseStreams[]> {
    const response: TwitchResponsePaginated = await this.http({
      path: "streams",
      // deno-lint-ignore no-explicit-any
      urlParams: new URLSearchParams(params as Record<string, any>),
    });
    return response.data as TwitchResponseStreams[];
  }

  async createEventSub(params?: TwitchRequestCreateEventSub): Promise<TwitchResponseCreateEventSub> {
    return await this.http({
      path: "eventsub/subscriptions",
      body: new URLSearchParams(params as Record<string, any>),
    })
  }
}
