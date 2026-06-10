import "dotenv/config";
import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    await client.connect();
    console.log("CONNECTED");
    await client.end();
  } catch (err) {
    console.error(err);
  }
}

test();