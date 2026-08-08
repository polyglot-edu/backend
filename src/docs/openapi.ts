import { DOMAIN_APP_DEPLOY, TEST_MODE } from "../utils/secrets";

/**
 * OpenAPI 3.0 description of the Polyglot backend.
 *
 * Written as a TS module rather than a YAML/JSON asset on purpose: the
 * Dockerfile's runner stage copies only `dist`, and tsc emits only imported
 * .json files — a standalone spec file would silently not ship.
 *
 * Two route groups are intentionally NOT documented here:
 *   - the `serverClean` maintenance routes, which are destructive
 *   - `/api/user/apikeys`, key management, covered in API-GUIDE.md instead
 *
 * The ApiKey *security scheme* is still declared, because it is what lets
 * Swagger UI's Authorize button accept a `pgk_` key against the documented
 * endpoints.
 */

const isLocal = DOMAIN_APP_DEPLOY.includes("localhost");
const scheme = isLocal ? "http" : "https";

/**
 * Servers advertised to Swagger UI.
 *
 * The first entry is deliberately RELATIVE. Swagger UI resolves it against the
 * origin the docs were loaded from, so "Try it out" always uses the same scheme
 * and host the user is already on. An absolute URL derived from
 * DOMAIN_APP_DEPLOY is not safe as the primary: when that variable is unset the
 * code falls back to `localhost:5000`, and the UI then fires requests at the
 * user's own machine over plain HTTP.
 *
 * The absolute URL is still published as a second option, but only when it has
 * actually been configured — it is useful for client generators, which cannot
 * resolve a relative server.
 */
const servers: { url: string; description: string }[] = [
  { url: "/", description: "This instance (same origin as these docs)" },
];

if (!isLocal) {
  servers.push({
    url: `${scheme}://${DOMAIN_APP_DEPLOY}`,
    description: "Absolute URL, for client generators",
  });
}

// ---------------------------------------------------------------------------
// Reusable pieces
// ---------------------------------------------------------------------------

const uuid = { type: "string", format: "uuid" } as const;

const idParam = {
  name: "id",
  in: "path",
  required: true,
  schema: uuid,
  description: "Resource id (UUID v4)",
} as const;

const authorRef = {
  type: "object",
  properties: { _id: uuid, username: { type: "string" } },
} as const;

const tag = {
  type: "object",
  properties: { name: { type: "string" }, color: { type: "string" } },
} as const;

/**
 * Applied to every operation that goes through `checkAuth`. The two schemes are
 * alternatives — either one satisfies the requirement.
 */
const secured = [{ ApiKey: [] }, { GoogleIdToken: [] }];

const responses = {
  Unauthorized: {
    description:
      "Missing or invalid bearer token. Not returned while TEST_MODE=true, " +
      "where every request resolves to the shared `guest` user.",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: { error: { type: "string" } },
        },
        examples: {
          missing: { value: { error: "Missing bearer token" } },
          invalid: { value: { error: "Invalid token" } },
        },
      },
    },
  },
  NotFound: { description: "Resource not found" },
  NoContent: { description: "Success, no response body" },
};

/** Shorthand for a JSON request body. */
const body = (schema: unknown, required = true) => ({
  required,
  content: { "application/json": { schema } },
});

/** Shorthand for a JSON response. */
const json = (description: string, schema?: unknown) => ({
  description,
  ...(schema
    ? { content: { "application/json": { schema } } }
    : {}),
});

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const arrayOf = (name: string) => ({ type: "array", items: ref(name) });

/** Generic passthrough for endpoints whose controllers are untyped. */
const freeform = { type: "object", additionalProperties: true };

// ---------------------------------------------------------------------------
// Path helpers for the highly repetitive learning-analytics router
// ---------------------------------------------------------------------------

const analyticsLookup = (
  path: string,
  summary: string,
  paramName: string,
  paramDescription: string,
) => ({
  [path]: {
    get: {
      tags: ["Learning analytics"],
      summary,
      security: secured,
      parameters: [
        {
          name: paramName,
          in: "path",
          required: true,
          schema: { type: "string" },
          description: paramDescription,
        },
      ],
      responses: {
        200: json("Matching action records", arrayOf("LearningAction")),
        401: responses.Unauthorized,
      },
    },
  },
});

const analyticsQuery = (
  path: string,
  summary: string,
  params: { name: string; description: string }[],
) => ({
  [path]: {
    get: {
      tags: ["Learning analytics"],
      summary,
      security: secured,
      parameters: params.map((p) => ({
        name: p.name,
        in: "query",
        required: false,
        schema: { type: "string" },
        description: p.description,
      })),
      responses: {
        200: json("Computed metrics", freeform),
        401: responses.Unauthorized,
      },
    },
  },
});

// ---------------------------------------------------------------------------
// Spec
// ---------------------------------------------------------------------------

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Polyglot backend API",
    version: "0.1.0",
    description: [
      "REST API behind the Polyglot node-editor and the .NET Interactive runtime.",
      "",
      "**Authentication.** Protected endpoints accept either credential:",
      "",
      "- **API key** (recommended for scripts and integrations) — send",
      "  `x-api-key: pgk_…`, or `Authorization: Bearer pgk_…` if your client only",
      "  supports bearer auth. Keys do not expire unless given a TTL and can be",
      "  revoked individually. See API-GUIDE.md for how to create one.",
      "- **Google ID token** — `Authorization: Bearer <id_token>`, with `aud`",
      "  equal to the server's `GOOGLE_CLIENT_ID`. This is what the node-editor",
      "  uses; its `/api/[...proxy]` route attaches the token server-side, so",
      "  browser code never handles it directly. Expires after about an hour.",
      "",
      `**This instance has \`TEST_MODE=${TEST_MODE}\`.**` +
        (TEST_MODE
          ? " Authentication is bypassed: every request resolves to the shared" +
            " `guest` user and no credential is required."
          : " Protected endpoints require an API key or a Google ID token."),
      "",
      "Some request/response bodies are described as free-form objects where the",
      "underlying controller is untyped — notably the AI-generation endpoints,",
      "which proxy to external services.",
    ].join("\n"),
    license: { name: "MIT" },
  },
  servers,
  tags: [
    { name: "Health", description: "Liveness probe" },
    { name: "Flows", description: "Learning paths and notebook generation" },
    { name: "Courses" },
    { name: "Syllabus" },
    { name: "Concepts", description: "Concept maps" },
    { name: "Execution", description: "Runtime traversal of a flow" },
    { name: "Files", description: "Node attachments" },
    { name: "Metadata", description: "Node/edge type descriptors for the editor" },
    { name: "Search" },
    { name: "Users" },
    { name: "Learning analytics" },
    { name: "AI generation", description: "Proxies to external AI services" },
  ],
  components: {
    securitySchemes: {
      ApiKey: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
        description:
          "Polyglot API key, `pgk_…`. Create one at POST /api/user/apikeys " +
          "after signing in with Google. Does not expire unless you set a TTL, " +
          "and can be revoked individually. Also accepted as " +
          "`Authorization: Bearer pgk_…` for clients that only support bearer " +
          "auth. This is the recommended credential for scripts and " +
          "integrations.",
      },
      GoogleIdToken: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Google ID token, verified with GOOGLE_CLIENT_ID as the audience. " +
          "Used by the node-editor and required to manage API keys. Expires " +
          "after about an hour.",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
      },
      User: {
        type: "object",
        properties: {
          _id: uuid,
          username: { type: "string" },
          email: { type: "string", format: "email" },
          googleId: {
            type: "string",
            description: "Google subject (`sub`) claim",
          },
          registrationDate: { type: "string", format: "date-time" },
        },
      },
      FlowInfo: {
        type: "object",
        required: ["title", "description"],
        properties: {
          _id: uuid,
          author: { type: "string", description: "User id" },
          title: { type: "string" },
          description: { type: "string" },
          platform: { type: "string" },
          publish: { type: "boolean", default: false },
          learningContext: { type: "string" },
          duration: { type: "number" },
          topics: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: tag },
        },
      },
      Flow: {
        allOf: [
          ref("FlowInfo"),
          {
            type: "object",
            properties: {
              nodes: { type: "array", items: freeform },
              edges: { type: "array", items: freeform },
            },
          },
        ],
      },
      Course: {
        type: "object",
        required: ["title"],
        properties: {
          _id: uuid,
          title: { type: "string" },
          description: { type: "string" },
          subjectArea: { type: "string" },
          macro_subject: { type: "string" },
          education_level: { type: "string" },
          language: { type: "string" },
          duration: { type: "string" },
          learningObjectives: {
            type: "object",
            properties: {
              knowledge: { type: "string" },
              skills: { type: "string" },
              attitude: { type: "string" },
            },
          },
          goals: { type: "array", items: { type: "string" } },
          prerequisites: { type: "array", items: { type: "string" } },
          topics: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: tag },
          img: { type: "string" },
          accessCode: { type: "string" },
          classContext: { type: "string" },
          flowsId: { type: "array", items: uuid },
          author: authorRef,
          targetAudience: { type: "string" },
          published: { type: "boolean" },
          lastUpdate: { type: "string", format: "date-time" },
          nSubscribed: { type: "integer" },
          nCompleted: { type: "integer" },
        },
      },
      Syllabus: {
        type: "object",
        required: ["title"],
        properties: {
          _id: uuid,
          title: { type: "string" },
          description: { type: "string" },
          educational_level: { type: "string" },
          additional_information: { type: "string" },
          goals: { type: "array", items: { type: "string" } },
          topics: freeform,
          prerequisites: { type: "array", items: { type: "string" } },
          language: { type: "string" },
          author: authorRef,
          studyRegulation: { type: "string" },
          curriculumPath: { type: "string" },
          studentPartition: { type: "string" },
          lastUpdate: { type: "string", format: "date-time" },
        },
      },
      FileInfo: {
        type: "object",
        properties: {
          _id: { type: "string", description: "Node id the file belongs to" },
          filename: {
            type: "string",
            description: "Stored name, prefixed with an upload timestamp",
          },
          path: { type: "string", description: "Absolute path on the server" },
          uploadedAt: { type: "string", format: "date-time" },
        },
      },
      ConceptMap: freeform,
      LearningAction: {
        type: "object",
        description:
          "A recorded learner action. Shape varies by action type; common " +
          "correlation fields are listed.",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          actionType: { type: "string" },
          zoneId: { type: "string" },
          platform: { type: "string" },
          flowId: uuid,
          nodeId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
        additionalProperties: true,
      },
      ExecutionNode: {
        type: "object",
        description: "The node the runtime should present next.",
        additionalProperties: true,
      },
    },
  },
  paths: {
    // ---------------------------------------------------------------- Health
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Liveness probe",
        description:
          "No database or auth dependency, so it stays green while Mongo is " +
          "unreachable. Used by the container healthcheck.",
        responses: {
          200: json("Service is up", {
            type: "object",
            properties: { status: { type: "string", example: "ok" } },
          }),
        },
      },
    },

    // ----------------------------------------------------------------- Flows
    "/api/flows": {
      get: {
        tags: ["Flows"],
        summary: "List flows",
        security: secured,
        parameters: [
          {
            name: "me",
            in: "query",
            schema: { type: "boolean" },
            description: "Restrict to flows authored by the caller",
          },
        ],
        responses: {
          200: json("Flows visible to the caller", arrayOf("FlowInfo")),
          401: responses.Unauthorized,
        },
      },
      post: {
        tags: ["Flows"],
        summary: "Create a flow",
        security: secured,
        requestBody: body(ref("FlowInfo")),
        responses: {
          200: json("Created flow", ref("Flow")),
          401: responses.Unauthorized,
        },
      },
    },
    "/api/flows/json": {
      post: {
        tags: ["Flows"],
        summary: "Create a flow from a full JSON document",
        description: "Imports nodes and edges alongside the flow metadata.",
        security: secured,
        requestBody: body(ref("Flow")),
        responses: {
          200: json("Created flow", ref("Flow")),
          401: responses.Unauthorized,
        },
      },
    },
    "/api/flows/{id}": {
      get: {
        tags: ["Flows"],
        summary: "Get a flow with its nodes and edges",
        security: secured,
        parameters: [idParam],
        responses: {
          200: json("Flow", ref("Flow")),
          401: responses.Unauthorized,
          404: responses.NotFound,
        },
      },
      put: {
        tags: ["Flows"],
        summary: "Replace a flow",
        security: secured,
        parameters: [idParam],
        requestBody: body(ref("Flow")),
        responses: {
          200: json("Updated flow", ref("Flow")),
          401: responses.Unauthorized,
          404: responses.NotFound,
        },
      },
      delete: {
        tags: ["Flows"],
        summary: "Delete a flow",
        security: secured,
        parameters: [idParam],
        responses: {
          204: responses.NoContent,
          401: responses.Unauthorized,
        },
      },
    },
    "/api/flows/{id}/publish": {
      put: {
        tags: ["Flows"],
        summary: "Publish a flow",
        security: secured,
        parameters: [idParam],
        responses: {
          200: json("Updated flow", ref("Flow")),
          401: responses.Unauthorized,
        },
      },
    },
    "/api/flows/{id}/runFirst": {
      get: {
        tags: ["Flows"],
        summary: "Download a VS Code notebook that starts a new execution",
        description:
          "Returns a .dib notebook whose `#!polyglot-setup` line points at " +
          "DOMAIN_APP_DEPLOY. Unauthenticated so the runtime can fetch it.",
        parameters: [idParam],
        responses: {
          200: {
            description: "Notebook file",
            content: { "application/octet-stream": { schema: { type: "string", format: "binary" } } },
          },
          404: responses.NotFound,
        },
      },
    },
    "/api/flows/{ctxId}/run/{filename}": {
      get: {
        tags: ["Flows"],
        summary: "Download a notebook that resumes an existing execution context",
        parameters: [
          { name: "ctxId", in: "path", required: true, schema: { type: "string" } },
          { name: "filename", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Notebook file",
            content: { "application/octet-stream": { schema: { type: "string", format: "binary" } } },
          },
          404: responses.NotFound,
        },
      },
    },
    "/api/flows/{id}/{ctxId}/run/{filename}": {
      get: {
        tags: ["Flows"],
        summary: "Download a notebook for a given flow and execution context",
        parameters: [
          idParam,
          { name: "ctxId", in: "path", required: true, schema: { type: "string" } },
          { name: "filename", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Notebook file",
            content: { "application/octet-stream": { schema: { type: "string", format: "binary" } } },
          },
          404: responses.NotFound,
        },
      },
    },

    // --------------------------------------------------------------- Courses
    "/api/course": {
      get: {
        tags: ["Courses"],
        summary: "List courses",
        security: secured,
        responses: {
          200: json("Courses", arrayOf("Course")),
          401: responses.Unauthorized,
        },
      },
      post: {
        tags: ["Courses"],
        summary: "Create a course",
        security: secured,
        requestBody: body(ref("Course")),
        responses: {
          200: json("Created course", ref("Course")),
          401: responses.Unauthorized,
        },
      },
      put: {
        tags: ["Courses"],
        summary: "Update a course",
        description: "The course id is taken from the request body.",
        security: secured,
        requestBody: body(ref("Course")),
        responses: {
          200: json("Updated course", ref("Course")),
          401: responses.Unauthorized,
        },
      },
    },
    "/api/course/json": {
      post: {
        tags: ["Courses"],
        summary: "Create a course from a full JSON document",
        security: secured,
        requestBody: body(ref("Course")),
        responses: {
          200: json("Created course", ref("Course")),
          401: responses.Unauthorized,
        },
      },
    },
    "/api/course/{id}": {
      get: {
        tags: ["Courses"],
        summary: "Get a course",
        security: secured,
        parameters: [idParam],
        responses: {
          200: json("Course", ref("Course")),
          401: responses.Unauthorized,
          404: responses.NotFound,
        },
      },
      delete: {
        tags: ["Courses"],
        summary: "Delete a course",
        security: secured,
        parameters: [idParam],
        responses: {
          204: responses.NoContent,
          401: responses.Unauthorized,
        },
      },
    },

    // -------------------------------------------------------------- Syllabus
    "/api/syllabus": {
      get: {
        tags: ["Syllabus"],
        summary: "List syllabuses",
        security: secured,
        responses: {
          200: json("Syllabuses", arrayOf("Syllabus")),
          401: responses.Unauthorized,
        },
      },
      post: {
        tags: ["Syllabus"],
        summary: "Create a syllabus",
        security: secured,
        requestBody: body(ref("Syllabus")),
        responses: {
          200: json("Created syllabus", ref("Syllabus")),
          401: responses.Unauthorized,
        },
      },
      put: {
        tags: ["Syllabus"],
        summary: "Update a syllabus",
        security: secured,
        requestBody: body(ref("Syllabus")),
        responses: {
          200: json("Updated syllabus", ref("Syllabus")),
          401: responses.Unauthorized,
        },
      },
    },
    "/api/syllabus/json": {
      post: {
        tags: ["Syllabus"],
        summary: "Create a syllabus from a full JSON document",
        security: secured,
        requestBody: body(ref("Syllabus")),
        responses: {
          200: json("Created syllabus", ref("Syllabus")),
          401: responses.Unauthorized,
        },
      },
    },
    "/api/syllabus/{id}": {
      get: {
        tags: ["Syllabus"],
        summary: "Get a syllabus",
        security: secured,
        parameters: [idParam],
        responses: {
          200: json("Syllabus", ref("Syllabus")),
          401: responses.Unauthorized,
          404: responses.NotFound,
        },
      },
      delete: {
        tags: ["Syllabus"],
        summary: "Delete a syllabus",
        security: secured,
        parameters: [idParam],
        responses: {
          204: responses.NoContent,
          401: responses.Unauthorized,
        },
      },
    },

    // -------------------------------------------------------------- Concepts
    "/api/concept/map": {
      post: {
        tags: ["Concepts"],
        summary: "Create a concept map",
        requestBody: body(ref("ConceptMap")),
        responses: { 200: json("Created concept map", ref("ConceptMap")) },
      },
    },
    "/api/concept/map/{id}": {
      get: {
        tags: ["Concepts"],
        summary: "Get a concept map",
        parameters: [{ ...idParam, schema: { type: "string" } }],
        responses: {
          200: json("Concept map", ref("ConceptMap")),
          404: responses.NotFound,
        },
      },
    },

    // ------------------------------------------------------------- Execution
    "/api/execution/first": {
      post: {
        tags: ["Execution"],
        summary: "Start an execution and get the first node",
        description: "Creates a new execution context for a flow.",
        requestBody: body({
          type: "object",
          properties: {
            flowId: uuid,
            userId: { type: "string" },
            platform: { type: "string" },
          },
        }),
        responses: { 200: json("First node", ref("ExecutionNode")) },
      },
    },
    "/api/execution/actual": {
      post: {
        tags: ["Execution"],
        summary: "Get the current node for an execution context",
        requestBody: body({
          type: "object",
          properties: { ctxId: { type: "string" } },
        }),
        responses: { 200: json("Current node", ref("ExecutionNode")) },
      },
    },
    "/api/execution/next": {
      post: {
        tags: ["Execution"],
        summary: "Advance to the next node",
        requestBody: body({
          type: "object",
          properties: {
            ctxId: { type: "string" },
            satisfiedConditions: { type: "array", items: { type: "string" } },
          },
        }),
        responses: { 200: json("Next node", ref("ExecutionNode")) },
      },
    },
    "/api/execution/progressInfo": {
      post: {
        tags: ["Execution"],
        summary: "List execution contexts for a flow",
        requestBody: body({
          type: "object",
          properties: { flowId: uuid, userId: { type: "string" } },
        }),
        responses: { 200: json("Execution contexts", { type: "array", items: freeform }) },
      },
    },
    "/api/execution/progressAction": {
      post: {
        tags: ["Execution"],
        summary: "Record manual progress against an execution",
        requestBody: body({
          type: "object",
          properties: {
            ctxId: { type: "string" },
            flowId: uuid,
            authorId: { type: "string" },
            satisfiedConditions: { type: "array", items: { type: "string" } },
          },
        }),
        responses: { 200: json("Updated node", ref("ExecutionNode")) },
      },
    },
    "/api/execution/resetProgress": {
      post: {
        tags: ["Execution"],
        summary: "Reset an execution context",
        requestBody: body({
          type: "object",
          properties: { ctxId: { type: "string" }, authorId: { type: "string" } },
        }),
        responses: { 200: json("Reset result", freeform) },
      },
    },
    "/api/execution/cmd": {
      post: {
        tags: ["Execution"],
        summary: "Send a command to the gamification engine",
        requestBody: body(freeform),
        responses: { 200: json("Command result", freeform) },
      },
    },

    // ----------------------------------------------------------------- Files
    "/api/file/upload/{id}": {
      post: {
        tags: ["Files"],
        summary: "Upload an attachment for a node",
        description:
          "Stored on the server filesystem under `uploads/<nodeId>/`, with the " +
          "absolute path persisted in Mongo. Requires a persistent volume.",
        security: secured,
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Node id" },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: { type: "string", format: "binary" },
                  name: { type: "string" },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          200: json("Upload result", {
            type: "object",
            properties: {
              message: { type: "string" },
              file: ref("FileInfo"),
            },
          }),
          400: json("No file supplied", ref("Error")),
          401: responses.Unauthorized,
        },
      },
    },
    "/api/file/download/{id}": {
      get: {
        tags: ["Files"],
        summary: "Download a node attachment",
        security: secured,
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Node id" },
        ],
        responses: {
          200: {
            description: "File contents",
            content: { "application/octet-stream": { schema: { type: "string", format: "binary" } } },
          },
          401: responses.Unauthorized,
          404: responses.NotFound,
        },
      },
    },

    // -------------------------------------------------------------- Metadata
    "/api/metadata/flow": {
      get: {
        tags: ["Metadata"],
        summary: "Flow-level metadata descriptors",
        responses: { 200: json("Metadata", freeform) },
      },
    },
    "/api/metadata/node": {
      get: {
        tags: ["Metadata"],
        summary: "All node type descriptors",
        responses: { 200: json("Metadata", freeform) },
      },
    },
    "/api/metadata/node/{type}": {
      get: {
        tags: ["Metadata"],
        summary: "Descriptor for one node type",
        parameters: [
          { name: "type", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: json("Metadata", freeform), 404: responses.NotFound },
      },
    },
    "/api/metadata/edge": {
      get: {
        tags: ["Metadata"],
        summary: "All edge type descriptors",
        responses: { 200: json("Metadata", freeform) },
      },
    },
    "/api/metadata/edge/{type}": {
      get: {
        tags: ["Metadata"],
        summary: "Descriptor for one edge type",
        parameters: [
          { name: "type", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: json("Metadata", freeform), 404: responses.NotFound },
      },
    },

    // ---------------------------------------------------------------- Search
    "/api/search/autocomplete": {
      get: {
        tags: ["Search"],
        summary: "Autocomplete suggestions",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Partial query" },
        ],
        responses: {
          200: json("Suggestions", { type: "array", items: { type: "string" } }),
        },
      },
    },

    // ----------------------------------------------------------------- Users
    "/api/user/me": {
      get: {
        tags: ["Users"],
        summary: "Current user",
        description:
          "Resolved from the bearer token, or the shared `guest` user when " +
          "TEST_MODE=true. Creates the user record on first sign-in.",
        security: secured,
        responses: {
          200: json("The authenticated user", ref("User")),
          401: responses.Unauthorized,
        },
      },
    },

    // ---------------------------------------------------- Learning analytics
    "/api/learningAnalytics": {
      get: {
        tags: ["Learning analytics"],
        summary: "List all recorded actions",
        security: secured,
        responses: {
          200: json("Actions", arrayOf("LearningAction")),
          401: responses.Unauthorized,
        },
      },
      post: {
        tags: ["Learning analytics"],
        summary: "Record an action",
        security: secured,
        requestBody: body(ref("LearningAction")),
        responses: {
          200: json("Stored action", ref("LearningAction")),
          401: responses.Unauthorized,
        },
      },
    },
    ...analyticsLookup("/api/learningAnalytics/userId/{id}", "Actions for one user", "id", "User id"),
    ...analyticsLookup("/api/learningAnalytics/userIds/{ids}", "Actions for several users", "ids", "Comma-separated user ids"),
    ...analyticsLookup("/api/learningAnalytics/actionType/{id}", "Actions of one type", "id", "Action type"),
    ...analyticsLookup("/api/learningAnalytics/actionTypes/{ids}", "Actions of several types", "ids", "Comma-separated action types"),
    ...analyticsLookup("/api/learningAnalytics/zoneId/{id}", "Actions in one zone", "id", "Zone id"),
    ...analyticsLookup("/api/learningAnalytics/zoneIds/{ids}", "Actions in several zones", "ids", "Comma-separated zone ids"),
    ...analyticsLookup("/api/learningAnalytics/platform/{id}", "Actions from one platform", "id", "Platform name"),
    ...analyticsLookup("/api/learningAnalytics/platforms/{ids}", "Actions from several platforms", "ids", "Comma-separated platform names"),
    ...analyticsLookup("/api/learningAnalytics/flowId/{id}", "Actions for one flow", "id", "Flow id"),
    ...analyticsLookup("/api/learningAnalytics/flowIds/{ids}", "Actions for several flows", "ids", "Comma-separated flow ids"),
    ...analyticsLookup("/api/learningAnalytics/getUserLastLogIn/{id}", "Last login for a user", "id", "User id"),
    ...analyticsLookup("/api/learningAnalytics/calcNodeTimeByUserId/{id}", "Time spent per node for a user", "id", "User id"),
    ...analyticsQuery("/api/learningAnalytics/filters", "Actions matching arbitrary filters", [
      { name: "userId", description: "Filter by user" },
      { name: "flowId", description: "Filter by flow" },
      { name: "platform", description: "Filter by platform" },
      { name: "actionType", description: "Filter by action type" },
      { name: "startDate", description: "ISO date lower bound" },
      { name: "endDate", description: "ISO date upper bound" },
    ]),
    ...analyticsQuery("/api/learningAnalytics/calcTimeOnTool", "Total time on tool", [
      { name: "userId", description: "Filter by user" },
      { name: "platform", description: "Filter by platform" },
    ]),
    ...analyticsQuery("/api/learningAnalytics/calcGradeMetrics", "Grade metrics for a flow", [
      { name: "flowId", description: "Flow id" },
    ]),
    ...analyticsQuery("/api/learningAnalytics/getGradeByUserId", "Grade for one user", [
      { name: "userId", description: "User id" },
      { name: "flowId", description: "Flow id" },
    ]),
    ...analyticsQuery("/api/learningAnalytics/calcQuizMetrics", "Quiz metrics for one node", [
      { name: "flowId", description: "Flow id" },
      { name: "nodeId", description: "Node id" },
    ]),
    ...analyticsQuery("/api/learningAnalytics/calcLPQuizMetrics", "Quiz metrics across a learning path", [
      { name: "flowId", description: "Flow id" },
    ]),

    // --------------------------------------------------------- AI generation
    ...Object.fromEntries(
      (
        [
          ["genRes", "Generate a resource"],
          ["genGraph", "Generate a concept map"],
          ["LearningObjectiveGenerator", "Generate learning objectives (outdated)"],
          ["MaterialGenerator", "Generate teaching material"],
          ["Summarizer", "Summarise supplied material"],
          ["ActivityGenerator", "Generate an activity"],
          ["PlanLesson", "Plan a lesson"],
          ["DefineSyllabus", "Generate a syllabus"],
          ["PlanCourse", "Plan a course"],
          ["Corrector", "Correct a learner answer"],
        ] as const
      ).map(([path, summary]) => [
        `/api/openai/${path}`,
        {
          post: {
            tags: ["AI generation"],
            summary,
            description:
              "Proxies to an external AI service. Request and response shapes " +
              "are controller-defined and not strictly typed.",
            requestBody: body(freeform),
            responses: {
              200: json("Generated content", freeform),
              500: json("Upstream AI service error", ref("Error")),
            },
          },
        },
      ]),
    ),
  },
} as const;

export default openApiSpec;
