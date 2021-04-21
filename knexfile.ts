import * as knex from "knex";

const config: Record<"development" | "production", knex.Knex.Config> = {
  development: {
    client: "pg",
    connection: {
      host: "database",
      user: "postgres",
      password: "password",
      database: "biddytime",
    },
  },
  production: {},
};

export default config;
