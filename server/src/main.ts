import express from "express";
import { Client } from "pg"
import { config } from 'dotenv'
import { z } from "zod"
import cors from "cors";

async function main() {
  const envSchema = z.object({
    DB_CONNECTION_URI: z.string().url(),
  });
  
  const env = envSchema.parse(config().parsed);
  
  const db = new Client({
    connectionString: env.DB_CONNECTION_URI
  })

  try {
    await db.connect();
    console.log("Successfully connected to database");
  } catch (error) {
    console.error("Failed to connect to database", error);
  }

  const app = express()
  app.use(express.json());
  app.use(cors())

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.post('/register', (req, res) => {
    console.log(req.body)
    res.send("OK")
  })
  
  app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
  })
}

main()

