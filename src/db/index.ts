import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema: { ...schema, ...relations } });
