import config from "../knexfile";
import Knex from "knex";

const connection = Knex(process.env.NODE_ENV === "production" ? config.production : config.development);

export type IKnexConnection = typeof connection;

export default connection;
