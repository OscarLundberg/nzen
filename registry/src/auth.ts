import { Context, Next } from "hono";
import { OAuthApp } from "octokit";

export const authMiddleware = async (c: Context, next: Next) => {
  const code = c.req.header('X-GitHub-Code');

  const app = new OAuthApp({
    clientType: "oauth-app",
    clientId: c.env.GITHUB_CLIENT_ID,
    clientSecret: c.env.GITHUB_CLIENT_SECRET
  });

  if (!code) {
    return c.json({ error: 'No GitHub code provided' }, 401);
  }

  const res = await app.createToken({
    code
  });


  c.set('github_token', res.authentication.token);

  await next();
};
