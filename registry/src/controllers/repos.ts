import { drizzle } from "drizzle-orm/d1";
import { APP } from "..";
import { NzProjMeta } from "../../../cli/src/nzprojmeta";
import { authMiddleware } from "../auth";
import { ModuleOrigin, modules, Provider } from "../schema";
import { Octokit } from "octokit";

export function listRepos(app: APP) {
  app.get('/repos', authMiddleware, async (c) => {
    const token = c.get('github_token');

    const response = await fetch('https://api.github.com/user/repos?type=public', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'hono-app'
      }
    });

    const repos = await response.json();
    return c.json(repos);
  });
}

export function addRepos(app: APP) {
  app.put('/repos/track', authMiddleware, async (c) => {
    const db = drizzle(c.env.DB);
    const { repo_name, path = ".nzproj" } = await c.req.json();

    const token = c.get('github_token');
    const api = new Octokit({ auth: token })
    const user = await api.rest.users.getAuthenticated();

    const owner = user.data.login;

    const nzprojMetadata = await api.rest.repos.getContent({ owner, repo: repo_name, path });

    if (Array.isArray(nzprojMetadata.data) || (nzprojMetadata.data.type !== 'file')) {
      throw new Error(`
        Invalid path. 
        Make sure the repo has a valid .nzproj file in the repo root, 
        or provide a path argument specifying the path to the .nzproj file
      `);
    }

    const nzProj: NzProjMeta = JSON.parse(nzprojMetadata.data.content);
    const iteration = nzprojMetadata.data.sha ?? "HEAD";
    await db.insert(modules)
      .values((nzProj.modules ?? []).map(e => ({
        owner,
        iteration,
        semver: e.version,
        repoName: `${repo_name}`,
        moduleId: `${owner}/${repo_name}`,
        provider: Provider.GitHub,
        origin: ModuleOrigin.Community,
        description: e?.description,
        tags: e?.tags,
        name: e.name,
      })))
      .run();

    return c.json({ success: true });
  });


}