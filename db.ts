import mysql from "mysql";

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const db:mysql.Connection = mysql.createConnection({
  host: DB_HOST as string,
  user: DB_USER as string,
  password: DB_PASSWORD as string,
  database: "store",
});

export default db;
