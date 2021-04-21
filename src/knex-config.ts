import knexfile from "../knexfile";
import Knex from "knex";

const connection = Knex(process.env.NODE_ENV === "production" ? knexfile.production : knexfile.development);

export type IKnexConnection = typeof connection;

export default connection;
