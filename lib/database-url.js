const legacySslModes = new Set(["prefer", "require", "verify-ca"]);

export function normalizeDatabaseUrl(url) {
  if (!url) {
    return url;
  }

  const parsedUrl = new URL(url);
  const sslMode = parsedUrl.searchParams.get("sslmode");

  if (legacySslModes.has(sslMode)) {
    parsedUrl.searchParams.set("sslmode", "verify-full");
  }

  return parsedUrl.toString();
}
