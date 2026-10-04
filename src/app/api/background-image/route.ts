import sharp from "sharp";
import { isAllowedBackgroundUrl } from "@/lib/background-image";

export const runtime = "nodejs";
const MAX_BYTES = 20 * 1024 * 1024;

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url || !isAllowedBackgroundUrl(url)) {
    return new Response("Unsupported background photo URL", { status: 400 });
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    // Redirects must not bypass the source allowlist.
    const response = await fetch(url, { signal: controller.signal, redirect: "error" });
    if (!response.ok || !response.body) throw new Error("Photo source unavailable");
    if (Number(response.headers.get("content-length")) > MAX_BYTES) {
      await response.body.cancel();
      return new Response("Background photo exceeds 20 MB", { status: 413 });
    }
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BYTES) {
        await reader.cancel();
        return new Response("Background photo exceeds 20 MB", { status: 413 });
      }
      chunks.push(value);
    }
    // First frame only, even for animated uploads. Cap decoded memory on the
    // Pi at 1920 × 1080 pixels (about 8 MB RGBA), regardless of TV density.
    const image = await sharp(Buffer.concat(chunks), {
      animated: false,
      limitInputPixels: 64_000_000,
    })
      .rotate()
      .resize({ width: 1920, height: 1080, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toBuffer();
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Background photo could not be resized or downloaded", { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
