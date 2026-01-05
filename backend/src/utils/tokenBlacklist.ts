// tokenBlacklist.ts
const blacklistedTokens = new Set<string>();

export const blacklistToken = (token: string) => {
  blacklistedTokens.add(token);
};

export const isBlacklisted = (token: string) => {
  return blacklistedTokens.has(token);
};
