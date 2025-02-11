import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const SMTP_HOSTNAME = Deno.env.get("SMTP_HOSTNAME");
const SMTP_PORT = Deno.env.get("SMTP_PORT");
const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
const SMTP_FROM = Deno.env.get("SMTP_FROM");

const CONFIRM_BASE_URL = "https://godzillaz.top/prank/confirm";

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

  static async sendPrankConfirmation(to: string, confirmationCode: string) {
    await this.sendEmail(
      to,
      "Conferma il tuo scherzo!",
      `Grazie di averci inviato il tuo scherzo!\nPer confermare il tuo scherzo clicka qui:\n\n${CONFIRM_BASE_URL}/${confirmationCode}\n\nSe non hai richiesto nessuno scherzo, perfavore ignora questa email.\n\nTeam GodzillaZ`,
    );
  }
}
