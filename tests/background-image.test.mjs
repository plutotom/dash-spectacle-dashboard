import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";
import { loadTypeScript } from "./load-typescript.mjs";

const background = await loadTypeScript("../src/lib/background-image.ts");
const { GET } = await loadTypeScript("../src/app/api/background-image/route.ts", {
  "@/lib/background-image": background,
});
const photoUrl = "https://test.public.blob.vercel-storage.com/photo.jpg";
const request = (url = photoUrl) =>
  new Request(`http://localhost/api/background-image?url=${encodeURIComponent(url)}`);

test("rejects arbitrary hosts, credentials, ports and lookalike domains", async () => {
  for (const url of [
    "http://images.unsplash.com/a.jpg",
    "https://127.0.0.1/a.jpg",
    "https://images.unsplash.com.evil.com/a.jpg",
    "https://user:password@images.unsplash.com/a.jpg",
    "https://images.unsplash.com:8443/a.jpg",
    "file:///tmp/a.jpg",
    "https://example.com/a.jpg",
  ]) {
    assert.equal(background.isAllowedBackgroundUrl(url), false);
    assert.equal((await GET(request(url))).status, 400);
  }
  assert.equal(background.isAllowedBackgroundUrl(photoUrl), true);
  assert.equal(background.isAllowedBackgroundUrl("https://images.unsplash.com/photo-123"), true);
});

test("resizes a large photo to a static JPEG capped at 1920 × 1080", async () => {
  const source = await sharp({
    create: { width: 4000, height: 3000, channels: 3, background: "#a07850" },
  })
    .png()
    .toBuffer();
  const previousFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (_url, options) => {
      assert.equal(options.redirect, "error");
      return new Response(source);
    };
    const response = await GET(request());
    assert.equal(response.status, 200);
    const metadata = await sharp(Buffer.from(await response.arrayBuffer())).metadata();
    assert.equal(metadata.format, "jpeg");
    assert.ok(metadata.width <= 1920 && metadata.height <= 1080);
    assert.ok((metadata.pages ?? 1) === 1);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("bounds streamed downloads and handles unreadable images", async () => {
  const previousFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(new Uint8Array(21 * 1024 * 1024));
    assert.equal((await GET(request())).status, 413);
    globalThis.fetch = async () => new Response("not an image");
    assert.equal((await GET(request())).status, 502);
  } finally {
    globalThis.fetch = previousFetch;
  }
});
