import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { PrankToBeConfirmed } from "./db/schema/pranks.ts";

const SMTP_HOSTNAME = Deno.env.get("SMTP_HOSTNAME");
const SMTP_PORT = Deno.env.get("SMTP_PORT");
const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
const SMTP_FROM = Deno.env.get("SMTP_FROM");

const CONFIRM_BASE_URL = "https://godzillaz.top/prank/confirm";
const PRANKS_EMAIL = "scherzi@godzillaz.top"

function optional(value: unknown): string {
  return value ? `${value}`: "-";
}

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

  static async sendPrank(prank: PrankToBeConfirmed) {
    await this.sendEmail(
      PRANKS_EMAIL,
      `Scherzo ${prank.id}`,
      `
Nome vittima: ${prank.victimName}
Numero della vittima: ${prank.victimPhoneNumber}
Email richiedente: ${prank.email}
Descrizione: ${prank.description}

Città di nascita della vittima: ${optional(prank.victimBirthCity)}
Città attuale della vittima: ${optional(prank.victimCurrentCity)}
Data di nascita della vittima: ${optional(prank.victimBirthDate)}
Relazione con la vittima: ${optional(prank.relationship)}
      `
    )
  }
}
