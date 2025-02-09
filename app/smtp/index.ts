import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const SMTP_HOSTNAME = Deno.env.get("SMTP_HOSTNAME");
const SMTP_PORT = Deno.env.get("SMTP_PORT");
const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
const SMTP_FROM = Deno.env.get("SMTP_FROM");

export default class Email {
  static #client?: SMTPClient;

  static async sendEmail(
    to: string,
    subject: string,
    content: string,
    html?: string,
  ) {
    if (!this.#client) {
      this.#client = new SMTPClient({
        connection: {
          hostname: SMTP_HOSTNAME!,
          port: +SMTP_PORT!,
          auth: {
            username: SMTP_USERNAME!,
            password: SMTP_PASSWORD!,
          },
          tls: true,
        },
      });
    }
    await this.#client.send({
      from: SMTP_FROM!,
      to,
      subject,
      content,
      html,
    });
  }
}
