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
import type * as appSettings from "../appSettings.js";
import type * as auth from "../auth.js";
import type * as availabilityBlocks from "../availabilityBlocks.js";
import type * as cabins from "../cabins.js";
import type * as featureFlags from "../featureFlags.js";
import type * as http from "../http.js";
import type * as lib_amenities from "../lib/amenities.js";
import type * as lib_cancellation from "../lib/cancellation.js";
import type * as lib_email from "../lib/email.js";
import type * as lib_messages from "../lib/messages.js";
import type * as lib_money from "../lib/money.js";
import type * as lib_occupancy from "../lib/occupancy.js";
import type * as lib_rateLimiter from "../lib/rateLimiter.js";
import type * as lib_reservations from "../lib/reservations.js";
import type * as lib_reviews from "../lib/reviews.js";
import type * as lib_stripeWebhook from "../lib/stripeWebhook.js";
import type * as lib_subscribers from "../lib/subscribers.js";
import type * as messages from "../messages.js";
import type * as model_amenities from "../model/amenities.js";
import type * as model_appSettings from "../model/appSettings.js";
import type * as model_auth from "../model/auth.js";
import type * as model_availabilityBlocks from "../model/availabilityBlocks.js";
import type * as model_cabins from "../model/cabins.js";
import type * as model_featureFlags from "../model/featureFlags.js";
import type * as model_messages from "../model/messages.js";
import type * as model_reservations from "../model/reservations.js";
import type * as model_reviews from "../model/reviews.js";
import type * as model_subscribers from "../model/subscribers.js";
import type * as model_users from "../model/users.js";
import type * as reservations from "../reservations.js";
import type * as reviews from "../reviews.js";
import type * as stripeActions from "../stripeActions.js";
import type * as subscribers from "../subscribers.js";
import type * as testHelpers from "../testHelpers.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  amenities: typeof amenities;
  appSettings: typeof appSettings;
  auth: typeof auth;
  availabilityBlocks: typeof availabilityBlocks;
  cabins: typeof cabins;
  featureFlags: typeof featureFlags;
  http: typeof http;
  "lib/amenities": typeof lib_amenities;
  "lib/cancellation": typeof lib_cancellation;
  "lib/email": typeof lib_email;
  "lib/messages": typeof lib_messages;
  "lib/money": typeof lib_money;
  "lib/occupancy": typeof lib_occupancy;
  "lib/rateLimiter": typeof lib_rateLimiter;
  "lib/reservations": typeof lib_reservations;
  "lib/reviews": typeof lib_reviews;
  "lib/stripeWebhook": typeof lib_stripeWebhook;
  "lib/subscribers": typeof lib_subscribers;
  messages: typeof messages;
  "model/amenities": typeof model_amenities;
  "model/appSettings": typeof model_appSettings;
  "model/auth": typeof model_auth;
  "model/availabilityBlocks": typeof model_availabilityBlocks;
  "model/cabins": typeof model_cabins;
  "model/featureFlags": typeof model_featureFlags;
  "model/messages": typeof model_messages;
  "model/reservations": typeof model_reservations;
  "model/reviews": typeof model_reviews;
  "model/subscribers": typeof model_subscribers;
  "model/users": typeof model_users;
  reservations: typeof reservations;
  reviews: typeof reviews;
  stripeActions: typeof stripeActions;
  subscribers: typeof subscribers;
  testHelpers: typeof testHelpers;
  users: typeof users;
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
