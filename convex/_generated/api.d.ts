/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as amenities from "../amenities.js";
import type * as auth from "../auth.js";
import type * as authorization from "../authorization.js";
import type * as cabins from "../cabins.js";
import type * as http from "../http.js";
import type * as lib_amenities from "../lib/amenities.js";
import type * as lib_money from "../lib/money.js";
import type * as reviews from "../reviews.js";
import type * as testHelpers from "../testHelpers.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  amenities: typeof amenities;
  auth: typeof auth;
  authorization: typeof authorization;
  cabins: typeof cabins;
  http: typeof http;
  "lib/amenities": typeof lib_amenities;
  "lib/money": typeof lib_money;
  reviews: typeof reviews;
  testHelpers: typeof testHelpers;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("../betterAuth/_generated/component.js").ComponentApi<"betterAuth">;
};
