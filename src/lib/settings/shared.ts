/**
 * I tried to do my own thing with settings but it quickly turned into
 * a nightmare, so we'll be doing it however Skyra does it. I don't
 * understand it but it's a better-working solution than mine is, so...
 *
 * @see https://github.com/skyra-project/skyra/blob/master/src/lib/types/settings/ClientSettings.ts
 */

/**
 * Dark magic.
 */
export type CustomGet<K extends string, TCustom> = K & { __type__: TCustom }

/**
 * Dark magic.
 */
export function T<TCustom>(k: string): CustomGet<string, TCustom> {
  return k as CustomGet<string, TCustom>
}
