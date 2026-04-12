import { drizzle } from "drizzle-orm/d1";
import { APP } from "..";
import { modules } from "../schema";
import { like, or } from "drizzle-orm";

export function search(app: APP) {
  app.get('/search', async (c) => {
    const db = drizzle(c.env.DB);
    const searchTerm = `%${c.req.query('q')}%`;

    const results = await db.select()
      .from(modules)
      .where(
        or(
          like(modules.repoName, searchTerm),
        )
      )
      .all();

    return c.json(results);
  });
}