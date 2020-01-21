/**
 * The settings keys for the guild schema.
 * @see RFCSchema
 * @see RFCService
 */
export enum RFCGuildSettings {
  /**
   * Are RFC lookups enabled for this guild?
   */
  ENABLED = 'enabled',
}

/**
 * The settings keys for the client schema.
 * @see RFCSchema
 * @see RFCService
 */
export enum RFCClientSettings {
  /**
   * How long to wait before refetching the RFCs from Github?
   */
  CACHE_TTL = 'cacheTTL',
  /**
   * At what time were the RFCs cached?
   */
  CACHED_AT = 'cacheAt',
  /**
   * The RFC cache.
   */
  CACHE = 'cache',
}
