import { hashSync } from "bcrypt";
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
      table.string("email").unique().notNullable();
      table.string("username").unique().notNullable();
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
    })
    .createTable("userRoles", (table) => {
      table.increments("id");
      table.dateTime("createdAt").notNullable();
      table.dateTime("updatedAt").notNullable();
      table.integer("userId").references("id").inTable("user").notNullable();
      table.integer("companyId").references("id").inTable("company").notNullable();
      table.enum("role", ["admin", "employee", "lead", "manager"], { enumName: "role", useNative: true }).notNullable();
    })
    .then(async () => {
      return await knex("user").insert([
        {
          id: 1,
          username: "BiddytimeAdmin",
          password: hashSync(process.env.ADMIN_PASSWORD, 10),
          firstName: "BiddyTime",
          lastName: "Admin",
          email: "BiddytimeAdmin",
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
          deactivated: false,
        },
      ]);
    })
    .then(async () => {
      return await knex("company").insert({
        id: 1,
        companyName: "BiddyTime",
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        adminUser: 1,
      });
    })
    .then(async () => {
      return knex("userRoles").insert([
        {
          id: 1,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
          userId: 1,
          companyId: 1,
          role: "admin",
        },
        {
          id: 2,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
          userId: 1,
          companyId: 1,
          role: "manager",
        },
      ]);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("userRoles")
    .dropTableIfExists("role")
    .dropTableIfExists("forgotPasswordLink")
    .dropTableIfExists("userCompany")
    .dropTableIfExists("punch")
    .dropTableIfExists("company")
    .dropTableIfExists("user");
}
