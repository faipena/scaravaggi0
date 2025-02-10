import {
  Client,
  PoolClient,
} from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { DatabaseMigration, VirtualDatabaseMigration } from "./types.ts";

export default class Migration0001 extends VirtualDatabaseMigration
  implements DatabaseMigration {
  constructor(db: Client | PoolClient) {
    super(db, 1); // REMEMBER TO UPDATE VERSION
  }

  override async apply() {
    await this.db.queryArray`
    CREATE SCHEMA IF NOT EXISTS users;

    CREATE TYPE users.role AS ENUM ('User', 'Caster');

    CREATE TABLE IF NOT EXISTS users.logins(
      id serial PRIMARY KEY,
      email text UNIQUE NOT NULL,
      password bytea,
      role users.role NOT NULL DEFAULT 'User',
      registration_date timestamp DEFAULT NOW()
    );

    CREATE SCHEMA IF NOT EXISTS pranks;

    CREATE TABLE IF NOT EXISTS pranks.types (
      id serial PRIMARY KEY,
      name text UNIQUE NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS pranks.tobeconfirmed (
      id serial PRIMARY KEY,
      confirmation_code text NOT NULL UNIQUE,
      email text NOT NULL,
      victim_name text NOT NULL,
      victim_phone_number text NOT NULL,
      description text NOT NULL,
      victim_birth_city text,
      victim_current_city text,
      victim_birth_date date,
      relationship text,
      prank_type_id integer,
      sent_date timestamp DEFAULT NOW(),
      CONSTRAINT fk_prank_type
        FOREIGN KEY(prank_type_id)
        REFERENCES pranks.types(id)
        ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS pranks.confirmed (
      id serial PRIMARY KEY,
      user_id integer NOT NULL,
      victim_name text NOT NULL,
      victim_phone_number text NOT NULL,
      description text NOT NULL,
      victim_birth_city text,
      victim_current_city text,
      victim_birth_date date,
      relationship text,
      prank_type_id integer,
      sent_date timestamp DEFAULT NOW(),
      CONSTRAINT fk_prank_type
        FOREIGN KEY(prank_type_id)
        REFERENCES pranks.types(id)
        ON DELETE SET NULL,
      CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users.logins(id)
        ON DELETE SET NULL
    );
    `;

    await this.updateDbVersion(); // DO NOT REMOVE
  }
}
