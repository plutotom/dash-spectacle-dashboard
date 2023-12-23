/**
 * Retrieves data from the browser cache based on the specified key.
 * @param key - The key used to identify the data in the cache.
 * @returns The data stored in the cache, or null if the key is not found or expired.
 */
function getFromCache(key: string): null | any {
  const cacheData = localStorage.getItem(key);
  if (cacheData) {
    const parsedData = JSON.parse(cacheData);
    const expirationDate = parsedData.expirationDate;
    if (expirationDate && new Date().getTime() > expirationDate) {
      localStorage.removeItem(key);
      return null;
    }
    return parsedData.data;
  }
  return null;
}

/**
 * Saves data to the browser cache using the specified key.
 * @param key - The key used to identify the data in the cache.
 * @param data - The data to be stored in the cache.
 * @param expirationDate - Optional. The expiration date or timeout limit for the cached data.
 */
function saveToCache(key: string, data: any, expirationDate?: Date): void {
  const cacheData = {
    data,
    expirationDate: expirationDate ? expirationDate.getTime() : null,
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
}

export { getFromCache, saveToCache };
