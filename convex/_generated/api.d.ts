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
import type * as cabins from "../cabins.js";
import type * as featureFlags from "../featureFlags.js";
import type * as http from "../http.js";
import type * as lib_amenities from "../lib/amenities.js";
import type * as lib_cancellation from "../lib/cancellation.js";
import type * as lib_messages from "../lib/messages.js";
import type * as lib_money from "../lib/money.js";
import type * as lib_rateLimiter from "../lib/rateLimiter.js";
import type * as lib_reservations from "../lib/reservations.js";
import type * as lib_reviews from "../lib/reviews.js";
import type * as messages from "../messages.js";
import type * as model_amenities from "../model/amenities.js";
import type * as model_auth from "../model/auth.js";
import type * as model_cabins from "../model/cabins.js";
import type * as model_featureFlags from "../model/featureFlags.js";
import type * as model_messages from "../model/messages.js";
import type * as model_reservations from "../model/reservations.js";
import type * as model_reviews from "../model/reviews.js";
import type * as reservations from "../reservations.js";
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
  cabins: typeof cabins;
  featureFlags: typeof featureFlags;
  http: typeof http;
  "lib/amenities": typeof lib_amenities;
  "lib/cancellation": typeof lib_cancellation;
  "lib/messages": typeof lib_messages;
  "lib/money": typeof lib_money;
  "lib/rateLimiter": typeof lib_rateLimiter;
  "lib/reservations": typeof lib_reservations;
  "lib/reviews": typeof lib_reviews;
  messages: typeof messages;
  "model/amenities": typeof model_amenities;
  "model/auth": typeof model_auth;
  "model/cabins": typeof model_cabins;
  "model/featureFlags": typeof model_featureFlags;
  "model/messages": typeof model_messages;
  "model/reservations": typeof model_reservations;
  "model/reviews": typeof model_reviews;
  reservations: typeof reservations;
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
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
};
