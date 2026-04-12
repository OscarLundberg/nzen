import { DrizzleD1Database } from "drizzle-orm/d1";
import { Hono, ExecutionContext } from "hono";
import { cors } from "hono/cors";
import { controllers } from "./controllers"

export interface Env {
  DB: DrizzleD1Database;
}

const app = new Hono<{ Bindings: { DB: DrizzleD1Database; GITHUB_CLIENT_ID: string; GITHUB_CLIENT_SECRET: string } }>();

export type APP = typeof app;

app.use('*', async (c, next) => {
  return cors()(c, next);
})

for (let registerController of controllers) {
  registerController(app);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.fetch(request, env, ctx);
  }
} 