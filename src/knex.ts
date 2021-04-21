import knexfile from "../knexfile";
import Knex from "knex";

export default Knex(process.env.NODE_ENV === "production" ? knexfile.production : knexfile.development);
