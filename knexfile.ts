export default {
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
      database: process.env.POSTGRES_DB,
    },
    migrations: {
      tableName: "migrations",
    },
  },
};
