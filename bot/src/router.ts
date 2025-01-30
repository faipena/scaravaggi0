export interface HandlerFunction {
  (
    request: Request,
    info: Deno.ServeHandlerInfo<Deno.NetAddr>,
  ): Response | Promise<Response>;
}

export interface RequestHandler {
  method: "GET" | "POST";
  path: RegExp | string;
  handle: HandlerFunction;
}

export default class Router {
  #handlers: Array<RequestHandler>;
  #ac: AbortController;
  #options:
    | Deno.ServeTcpOptions
    | (Deno.ServeTcpOptions & Deno.TlsCertifiedKeyPem);

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
      _req: Request,
      info: Deno.ServeHandlerInfo<Deno.NetAddr>,
    ): Response | Promise<Response> => {
      let result: Response | Promise<Response> = new Response();
      this.#handlers.forEach((handler) => {
        if (_req.method == handler.method, _req.url.match(handler.path)) {
          result = handler.handle(_req, info);
        }
      });
      return result;
    });
  }

  stopListening() {
    this.#ac.abort();
  }
}
