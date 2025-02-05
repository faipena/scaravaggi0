import { Client, PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { DatabaseMigration, VirtualDatabaseMigration } from "./types.ts";

export default class Migration0001 extends VirtualDatabaseMigration implements DatabaseMigration {
  constructor(db: Client | PoolClient) {
    super(db, 1); // REMEMBER TO UPDATE VERSION
  }

  override async apply() {
    await this.db.queryArray`
    CREATE TABLE IF NOT EXISTS users(
      id serial PRIMARY KEY,
      email text UNIQUE NOT NULL,
      registration_date timestamp DEFAULT NOW()
    );

    CREATE SCHEMA IF NOT EXISTS pranks;

    CREATE TABLE IF NOT EXISTS pranks.type (
      id serial PRIMARY KEY,
      name text UNIQUE NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS pranks.tobeconfirmed (
      id serial PRIMARY KEY,
      email text NOT NULL,
      victim_name text NOT NULL,
      victim_birth_city text,
      victim_current_city text,
      victim_birth_date date,
      victim_phone_number text NOT NULL,
      relationship text,
      prank_type_id integer,
      description text,
      sent_date timestamp DEFAULT NOW(),
      confirmation_code text NOT NULL UNIQUE,
      CONSTRAINT fk_prank_type
        FOREIGN KEY(prank_type_id)
        REFERENCES pranks.type(id)
        ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS pranks.confirmed (
      id serial PRIMARY KEY,
      user_id integer NOT NULL,
      victim_name text NOT NULL,
      victim_birth_city text,
      victim_current_city text,
      victim_birth_date date,
      victim_phone_number text NOT NULL,
      relationship text,
      prank_type_id integer,
      description text,
      sent_date timestamp DEFAULT NOW(),
      CONSTRAINT fk_prank_type
        FOREIGN KEY(prank_type_id)
        REFERENCES pranks.type(id)
        ON DELETE SET NULL,
      CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
    );
    `;

    await this.updateDbVersion(); // DO NOT REMOVE
  }
};
