// Limit anonymous thumbnails to the dashboard's existing public photo sources.
export function isAllowedBackgroundUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      (url.hostname === "images.unsplash.com" ||
        /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/.test(url.hostname))
    );
  } catch {
    return false;
  }
}
