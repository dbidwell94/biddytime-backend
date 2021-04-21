import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("user", (table) => {
      table.increments("id");
      table.dateTime("createdAt").notNullable();
      table.dateTime("updatedAt").notNullable();
      table.string("firstName").notNullable();
      table.string("lastName").notNullable();
      table.string("password").notNullable();
      table.boolean("deactivated").notNullable().defaultTo(false);
    })
    .createTable("company", (table) => {
      table.increments("id");
      table.integer("adminUser").references("id").inTable("user").onDelete("CASCADE").onUpdate("CASCADE").notNullable();
      table.string("companyName").notNullable();
      table.dateTime("createdAt").notNullable();
      table.dateTime("updatedAt").notNullable();
    })
    .createTable("punch", (table) => {
      table.increments("id");
      table
        .integer("companyId")
        .references("id")
        .inTable("company")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
      table.integer("userId").references("id").inTable("user").onDelete("CASCADE").onUpdate("CASCADE").notNullable();
      table.boolean("isPunchIn").notNullable();
      table.dateTime("createdAt").notNullable();
      table.dateTime("updatedAt").notNullable();
    })
    .createTable("userCompany", (table) => {
      table.increments("id");
      table.integer("userId").references("id").inTable("user").onUpdate("CASCADE").onDelete("CASCADE").notNullable();
      table
        .integer("companyId")
        .references("id")
        .inTable("company")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
      table.dateTime("updatedAt").notNullable();
      table.dateTime("createdAt").notNullable();
    })
    .createTable("forgotPasswordLink", (table) => {
      table.increments("id");
      table.dateTime("createdAt").notNullable();
      table.dateTime("updatedAt").notNullable();
      table.integer("userId").references("id").inTable("user").onDelete("CASCADE").onUpdate("CASCADE").notNullable();
      table.string("hash").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("forgotPasswordLink")
    .dropTableIfExists("userCompany")
    .dropTableIfExists("punch")
    .dropTableIfExists("company")
    .dropTableIfExists("user");
}
