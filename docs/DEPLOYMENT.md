# Deployment

Core Breach is a static site: the `public/` folder is the whole product. Netlify serves it, and GitHub Actions verifies and deploys it.

```
push to _Prod ──► CI (lint, format, tests, asset check) ──► Netlify production
pull request  ──► CI ──► Netlify preview at https://pr-<number>--core-breach.netlify.app
tag v1.2.3    ──► CI ──► GitHub release with a downloadable zip
```

## One-time setup

### 1. Create the Netlify site

1. Sign in at [app.netlify.com](https://app.netlify.com) and choose **Add new site → Import an existing project**.
2. Pick GitHub and select `Zubair-hussain/Core-Breach`.
3. Set the **production branch** to `_Prod`.
4. Netlify reads `netlify.toml`, so the build command (`node scripts/check-assets.mjs`) and publish folder (`public`) are already set. Leave them.
5. Under **Site configuration → Change site name**, choose `core-breach` to get `core-breach.netlify.app`.

That alone gives you automatic deploys on every push. The GitHub Actions workflow adds preview comments and a smoke test, and is optional.

### 2. (Optional) Let GitHub Actions deploy

In the Netlify dashboard:

- **Site configuration → Site details → Site ID** gives you `NETLIFY_SITE_ID`.
- **User settings → Applications → Personal access tokens → New access token** gives you `NETLIFY_AUTH_TOKEN`.

Add both in GitHub under **Settings → Secrets and variables → Actions → New repository secret**.

If you use the Actions deploy, turn off Netlify's own build for this repo (**Site configuration → Build & deploy → Continuous deployment → Stop builds**) so each push isn't deployed twice. Until the secrets exist, `deploy.yml` skips itself and shows a notice instead of failing.

## Deploy tricks

**Roll back instantly.** In Netlify, open **Deploys**, pick an older deploy and choose **Publish deploy**. No rebuild, live in seconds.

**Test a branch with real players.** Open a pull request. The preview link is posted as a comment, and it's a full copy of the site you can share.

**Never ship a broken page.** `scripts/check-assets.mjs` runs as the Netlify build command. If `index.html` links to a missing file, or a module imports something that doesn't exist, the build fails and the previous deploy stays live.

**Cache the right things.** `netlify.toml` caches the vendored libraries for a year (`immutable`), keeps game code and CSS revalidated on every load, and sets `/sw.js` to `no-cache` so players never get stuck on an old build.

**Short links.** `/play` goes to the game, `/source` to the repository, `/report-bug` to the issue form.

**Release a downloadable build.** Tag a version and push it:

```bash
git tag v1.1.0
git push origin v1.1.0
```

The Release workflow runs CI, zips `public/` with the licence, and publishes it as a GitHub release with generated notes.

## Security headers

`netlify.toml` sends a strict Content Security Policy. If you add a script, font or image from another domain, add it to the policy or the browser will block it. The game itself needs none.

## Check a deploy

```bash
curl -I https://core-breach.netlify.app/
curl -s https://core-breach.netlify.app/ | grep -c "Core Breach"
```

Both should succeed. The `Content-Security-Policy` header should be in the first response.
