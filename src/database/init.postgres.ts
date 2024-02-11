import { Pool } from "pg";
import configuration from "../configs/configuration";

const postgresSingleton = () => {
  return new Pool({
    host: configuration.DB.HOST,
    port: configuration.DB.PORT,
    database: configuration.DB.DBNAME,
    user: configuration.DB.USERNAME,
    password: configuration.DB.PASSWORD,
    query_timeout: 2000,
  });
};

declare global {
  var postgres: ReturnType<typeof postgresSingleton>;
}

const postgres = globalThis.postgres ?? postgresSingleton();

postgres.on("error", (err) => {
  console.error("something bad has happened!", err.stack);
});

export default postgres;

if (process.env.NODE_ENV !== "production") globalThis.postgres = postgres;
