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

**1. Get an API key.** Sign in to the
[node-editor](https://polyglot-node-editor.createlab-univaq.it) with your Google
account and go to **API keys** in the top bar, or straight to
[`/settings/api-keys`](https://polyglot-node-editor.createlab-univaq.it/settings/api-keys).

Give the key a name, optionally set an expiry, and press **Create**. The token is
shown **once** — copy it before closing the dialog. It cannot be retrieved
afterwards, only revoked and replaced.

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

### Managing keys

Everything happens on
[`/settings/api-keys`](https://polyglot-node-editor.createlab-univaq.it/settings/api-keys)
in the editor: create, see when each key was last used, and revoke.

| Column | Meaning |
|---|---|
| Name | how you recognise the key — one per integration is a good habit |
| Key | truncated prefix, e.g. `pgk_eaEsCn…`; the full value is never shown again |
| Status | Active, Expired, or Revoked |
| Last used | updated at most hourly, so it's approximate |
| Expires | `Never` unless you set a TTL at creation |

Revoking takes effect immediately and cannot be undone — anything using that key
starts receiving 401.

Only the SHA-256 hash is stored, so a lost key can't be recovered. Revoke it and
create another.

> **Why key management needs a Google sign-in:** an API key cannot create or
> revoke keys, including itself. That's what makes revocation meaningful — a
> leaked key can't mint replacements. Using a key against `/api/user/apikeys`
> returns 403.

<details>
<summary>Scripting key creation instead of using the UI</summary>

The same endpoints are callable directly, but they require a Google ID token
rather than an API key. Sign in to the editor, then take `idToken` from
`https://polyglot-node-editor.createlab-univaq.it/api/auth/session`:

```bash
GOOGLE_TOKEN="<idToken>"
BASE="https://polyglot-backend.createlab-univaq.it"

curl -X POST "$BASE/api/user/apikeys" \
  -H "Authorization: Bearer $GOOGLE_TOKEN" -H "Content-Type: application/json" \
  -d '{"name": "ci-pipeline", "expiresInDays": 90}'

curl "$BASE/api/user/apikeys" -H "Authorization: Bearer $GOOGLE_TOKEN"

curl -X DELETE "$BASE/api/user/apikeys/<key-id>" \
  -H "Authorization: Bearer $GOOGLE_TOKEN"
```

`name` is required; `expiresInDays` is optional. These endpoints are deliberately
absent from the OpenAPI spec — this guide is their documentation.

</details>

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
- [ ] Key created on `/settings/api-keys` with a descriptive `name`
- [ ] Token stored in an environment variable, not in code
- [ ] `GET /api/user/me` returns your user — the end-to-end proof
- [ ] Old or unused keys revoked

## Related

- [`monitoring/README.md`](monitoring/README.md) — metrics and dashboards
- [`COOLIFY-TUNNEL-ISSUES.md`](COOLIFY-TUNNEL-ISSUES.md) — deployment routing
- [`.env.example`](.env.example) — server-side configuration
