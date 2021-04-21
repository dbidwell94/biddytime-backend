// @ts-ignore
import * as knex from "knex";

// @ts-ignore
const config: Record<"development" | "production", knex.Knex.Config> = {
  development: {
    client: "postgresql",
    connection: {
      host: "database",
      user: "postgres",
      password: "password",
      database: "biddytime",
    },
    migrations: {
      tableName: "migrations",
    },
  },
  production: {
    client: "postgresql",
    connection: {
      host: "database",
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
    },
    migrations: {
      tableName: "migrations",
    },
  },
};

export default config;
