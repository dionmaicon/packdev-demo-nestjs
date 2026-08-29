import "reflect-metadata";
import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "../src/app.module";

async function boot(): Promise<{ app: NestExpressApplication; port: number }> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: false });
  await app.listen(0);
  const server = app.getHttpServer() as http.Server;
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("expected a network address");
  }
  return { app, port: address.port };
}

function request(
  port: number,
  options: http.RequestOptions,
  body?: unknown,
): Promise<{ statusCode: number; body: unknown }> {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, ...options }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () =>
        resolve({ statusCode: res.statusCode ?? 0, body: data ? JSON.parse(data) : null }),
      );
    });
    req.on("error", reject);
    if (body) {
      req.setHeader("content-type", "application/json");
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

test("GET /health returns ok", async () => {
  const { app, port } = await boot();
  try {
    const res = await request(port, { path: "/health", method: "GET" });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { status: "ok" });
  } finally {
    await app.close();
  }
});

test("POST /notify rejects a missing message", async () => {
  const { app, port } = await boot();
  try {
    const res = await request(port, { path: "/notify", method: "POST" }, { to: "alice" });
    assert.equal(res.statusCode, 400);
  } finally {
    await app.close();
  }
});

test("POST /notify then GET /notifications/:id round-trips a real notification", async () => {
  const { app, port } = await boot();
  try {
    const created = await request(
      port,
      { path: "/notify", method: "POST" },
      { to: "alice", message: "hello" },
    );
    assert.equal(created.statusCode, 201);
    const createdBody = created.body as { id: string };

    const fetched = await request(port, { path: `/notifications/${createdBody.id}`, method: "GET" });
    assert.equal(fetched.statusCode, 200);
    assert.deepEqual(fetched.body, {
      id: createdBody.id,
      to: "alice",
      message: "hello",
      status: "sent",
    });
  } finally {
    await app.close();
  }
});

test("GET /notifications/:id returns 404 for an unknown id", async () => {
  const { app, port } = await boot();
  try {
    const res = await request(port, { path: "/notifications/does-not-exist", method: "GET" });
    assert.equal(res.statusCode, 404);
  } finally {
    await app.close();
  }
});
