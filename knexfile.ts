import * as knex from "knex";

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
  production: {},
};

export default config;
