export type RequestInfo = Deno.ServeHandlerInfo<Deno.NetAddr>;

export interface HandlerFunction {
  (
    request: Request,
    info: RequestInfo,
  ): Response | Promise<Response> | undefined;
}

export interface RequestHandler {
  method: "GET" | "POST" | "*";
  path: RegExp | string;
  handle: HandlerFunction;
}

export default class Router {
  #handlers: Array<RequestHandler>;
  #ac: AbortController;
  #options:
    | Deno.ServeTcpOptions
    | (Deno.ServeTcpOptions & Deno.TlsCertifiedKeyPem);
  defaultResponse(): Response {
    return new Response("Not found", { status: 404 });
  }

  constructor(
    options?:
      | Deno.ServeTcpOptions
      | (Deno.ServeTcpOptions & Deno.TlsCertifiedKeyPem),
  ) {
    this.#ac = new AbortController();
    this.#handlers = [];
    if (options) {
      this.#options = options;
      this.#options.signal = this.#ac.signal;
    } else {
      this.#options = { signal: this.#ac.signal };
    }
  }

  add(handler: RequestHandler) {
    this.#handlers.push(handler);
  }

  get(path: string | RegExp, handle: HandlerFunction) {
    this.add({ method: "GET", path, handle });
  }

  post(path: string | RegExp, handle: HandlerFunction) {
    this.add({ method: "POST", path, handle });
  }

  listen(): Deno.HttpServer {
    return Deno.serve(this.#options, (
      request: Request,
      info: RequestInfo,
    ) => {
      let result: Response | Promise<Response> | undefined;
      this.#handlers.forEach((handler) => {
        const methodMatches = handler.method === "*" ||
          request.method === handler.method;
        const pathMatches = new URL(request.url).pathname.match(handler.path);
        if (methodMatches && pathMatches) {
          result = handler.handle(request, info);
        }
      });
      return result ?? this.defaultResponse();
    });
  }

  stopListening() {
    this.#ac.abort();
  }
}
