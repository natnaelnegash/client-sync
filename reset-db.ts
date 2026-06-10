import { client } from "./src/db/index";

async function run() {
  try {
    await client`DROP SCHEMA public CASCADE;`;
    await client`CREATE SCHEMA public;`;
    await client`GRANT ALL ON SCHEMA public TO postgres;`;
    await client`GRANT ALL ON SCHEMA public TO public;`;
    console.log("Database reset!");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
