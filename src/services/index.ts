import { Knex } from "knex";
import connection from "knex-config";

export default abstract class Service {
  protected repository: Knex;

  constructor() {
    this.repository = connection;
  }
}
