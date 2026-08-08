# Polyglot API — integration guide

For developers building an application against the Polyglot backend.

- **Base URL** — `https://polyglot-backend.createlab-univaq.it`
- **Interactive reference** — [`/api/docs`](https://polyglot-backend.createlab-univaq.it/api/docs)
- **OpenAPI spec** — [`/api/docs.json`](https://polyglot-backend.createlab-univaq.it/api/docs.json)

Everything is mounted under `/api`; a request to `/` returns 404 by design.

```bash
curl https://polyglot-backend.createlab-univaq.it/api/health
# {"status":"ok"}
```

---

## Quick start

**1. Get an API key.** Sign in to the [node-editor](https://polyglot-node-editor.createlab-univaq.it)
with your Google account, then create a key:

```bash
curl -X POST https://polyglot-backend.createlab-univaq.it/api/user/apikeys \
  -H "Authorization: Bearer <google-id-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "my integration"}'
```

```json
{
  "_id": "c2754a43-cf3b-4ff5-a172-606847c75002",
  "name": "my integration",
  "display": "pgk_eaEsCn…",
  "token": "pgk_eaEsCngLLr...",
  "warning": "Store this token now — it cannot be retrieved again."
}
```

The Google token is only needed for this one call — see
[Creating your first key](#creating-your-first-key) for how to obtain it.

**2. Use the key.** That's the whole integration:

```bash
curl https://polyglot-backend.createlab-univaq.it/api/flows \
  -H "x-api-key: pgk_eaEsCngLLr..."
```

No Google Cloud project, no OAuth flow, no token refresh. The key does not expire
unless you ask for a TTL.

---

## Authentication

Two credentials are accepted. **Use an API key** unless you're building the
editor.

| | API key | Google ID token |
|---|---|---|
| Header | `x-api-key: pgk_…` | `Authorization: Bearer <jwt>` |
| Expires | never, unless you set a TTL | ~1 hour |
| Revocable | yes, individually | no |
| Setup | one call | full OAuth flow |
| For | scripts, services, integrations | the node-editor |

An API key is also accepted as `Authorization: Bearer pgk_…`, for clients that
only support bearer auth — including Swagger UI's **Authorize** button.

Both resolve to the same user, so a key can do exactly what its owner can do.
There are no scopes or per-key permissions.

### Creating your first key

Key management deliberately requires a **Google sign-in** — an API key cannot
create or revoke keys, including itself. That's what makes revocation meaningful:
a leaked key can't mint replacements.

The easiest way to get a Google ID token: sign in to the editor, then open

```
https://polyglot-node-editor.createlab-univaq.it/api/auth/session
```

and copy the `idToken` value. It's valid for about an hour — long enough to
create a key, which is all you need it for.

### Managing keys

```bash
GOOGLE_TOKEN="<google-id-token>"
BASE="https://polyglot-backend.createlab-univaq.it"

# Create, with an optional expiry
curl -X POST "$BASE/api/user/apikeys" \
  -H "Authorization: Bearer $GOOGLE_TOKEN" -H "Content-Type: application/json" \
  -d '{"name": "ci-pipeline", "expiresInDays": 90}'

# List (metadata only — the token is never returned again)
curl "$BASE/api/user/apikeys" -H "Authorization: Bearer $GOOGLE_TOKEN"

# Revoke, immediately and permanently
curl -X DELETE "$BASE/api/user/apikeys/<key-id>" \
  -H "Authorization: Bearer $GOOGLE_TOKEN"
```

| Field | Meaning |
|---|---|
| `name` | required; how you'll recognise the key when revoking it |
| `expiresInDays` | optional; omit for a key that never expires |
| `display` | truncated prefix, e.g. `pgk_eaEsCn…`, shown in listings |
| `lastUsedAt` | updated at most hourly, so it's approximate |

Only the SHA-256 hash of a key is stored, so a lost key cannot be recovered —
revoke it and create another.

---

## Calling the API

```bash
KEY="pgk_..."
BASE="https://polyglot-backend.createlab-univaq.it"

curl -s "$BASE/api/user/me"        -H "x-api-key: $KEY"
curl -s "$BASE/api/flows?me=true"  -H "x-api-key: $KEY"
curl -s "$BASE/api/flows/<id>"     -H "x-api-key: $KEY"

curl -s -X POST "$BASE/api/flows" \
  -H "x-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{"title":"My flow","description":"Created via the API"}'

curl -s -X POST "$BASE/api/file/upload/<node-id>" \
  -H "x-api-key: $KEY" \
  -F "file=@./diagram.png" -F "name=diagram"
```

JavaScript:

```js
const BASE = 'https://polyglot-backend.createlab-univaq.it';

async function polyglot(path, init = {}) {
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      'x-api-key': process.env.POLYGLOT_API_KEY,
      ...(init.body && !(init.body instanceof FormData)
        ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

const flows = await polyglot('/api/flows?me=true');
```

Python:

```python
import os, requests

BASE = "https://polyglot-backend.createlab-univaq.it"
S = requests.Session()
S.headers["x-api-key"] = os.environ["POLYGLOT_API_KEY"]

flows = S.get(f"{BASE}/api/flows", params={"me": "true"}).json()
```

### Swagger "Try it out"

Open [`/api/docs`](https://polyglot-backend.createlab-univaq.it/api/docs), click
**Authorize**, and paste your key into the **ApiKey** field. Requests go to the
same origin as the docs, so nothing else needs configuring.

### Which endpoints need a credential

About 42 of the 71 operations:

| Authenticated | Open |
|---|---|
| `flows` CRUD, `course`, `syllabus`, `file`, `user/me`, `learningAnalytics` | `health`, `metadata`, `search`, `concept`, `execution/*`, `openai/*`, notebook downloads |

`execution/*` is open on purpose — the .NET runtime notebooks call it with no
credentials.

### Generating a client

```bash
npx @openapitools/openapi-generator-cli generate \
  -i https://polyglot-backend.createlab-univaq.it/api/docs.json \
  -g typescript-fetch -o ./polyglot-client
```

---

## Errors

| Status | Meaning |
|---|---|
| `401 {"error":"Invalid, revoked or expired API key"}` | The key is unknown, revoked, or past its TTL |
| `401 {"error":"Missing bearer token"}` | No credential at all |
| `401 {"error":"Invalid token"}` | A Google token that failed verification |
| `403 {"error":"API keys cannot manage API keys…"}` | Used a key on `/api/user/apikeys`; sign in with Google |
| `400` | Validation failure |
| `404` | Resource absent — also what `/` returns |
| `500` | Unhandled server error |

If a key that used to work starts returning 401, it was most likely revoked or
hit its expiry. `GET /api/user/apikeys` shows `revokedAt` and `expiresAt`.

---

## Good to know

- **Keep keys secret.** A key carries the full permissions of its owner. Store it
  in an environment variable or a secrets manager — never in client-side code, a
  public repo, or a URL query string.
- **One key per integration.** Then revoking one doesn't disturb the others, and
  `lastUsedAt` tells you which are still in use.
- **No rate limiting** is currently applied.
- **CORS reflects every origin**, so browser clients aren't restricted — but see
  the first point before putting a key in a browser.
- **Uploads** are stored server-side and served back via `/api/file/download/:id`.
- **Notebook downloads** (`/api/flows/:id/runFirst`) return a `.dib` for the VS
  Code runtime and need no credential.
- Key-management endpoints are intentionally **not** in the OpenAPI spec; this
  guide is their documentation.

## Checklist for a new integration

- [ ] Google sign-in through the editor, once
- [ ] Key created with a descriptive `name`
- [ ] Token stored in an environment variable, not in code
- [ ] `GET /api/user/me` returns your user — the end-to-end proof
- [ ] Old or unused keys revoked

## Related

- [`monitoring/README.md`](monitoring/README.md) — metrics and dashboards
- [`COOLIFY-TUNNEL-ISSUES.md`](COOLIFY-TUNNEL-ISSUES.md) — deployment routing
- [`.env.example`](.env.example) — server-side configuration
