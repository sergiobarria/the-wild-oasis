## Software Requirements & Product Specification

**Document Version:** 1.0
**Project Type:** Full-Stack Web Application / Demo Product
**Status:** Initial Development Specification
**Primary Stack:** Next.js + Convex
**Package Manager:** Bun

---

# 1. Project Overview

## 1.1 Purpose

This project is a full-stack cabin rental platform for a fictional hospitality company specializing in secluded cabin stays in wooded and natural environments.

The application serves two primary purposes:

1. Provide guests with a polished public website where they can discover cabins, view availability, create accounts, make reservations, and manage their bookings.
2. Provide administrators with a secure internal dashboard for managing cabins, reservations, users, subscriptions, messages, application configuration, and operational statistics.

Although the application is primarily intended as a demonstration/portfolio project, it should be designed and implemented as a realistic production-style application.

The objective is **not** to build an enterprise property-management system. The application should instead demonstrate good software architecture, security practices, user experience, maintainability, and modern full-stack development patterns while keeping the scope manageable.

---

# 2. Product Vision

The product should feel like a small, premium cabin rental business rather than a generic booking marketplace.

The experience should emphasize:

- Nature
- Privacy
- Simplicity
- Premium accommodation
- Quiet escapes
- Minimal friction during booking

The public website should prioritize photography and cabin discovery while keeping interfaces visually restrained.

The administrative interface should prioritize clarity and operational efficiency rather than decorative design.

The overall product should feel polished enough to represent a real hospitality business.

---

# 3. Product Goals

The primary goals are:

- Allow visitors to browse available cabins.
- Present detailed information and photography for each cabin.
- Allow guests to search availability.
- Allow users to create accounts and authenticate securely.
- Allow authenticated users to reserve cabins.
- Support optional Stripe-based online payment.
- Provide a simple guest dashboard.
- Allow administrators to manage reservations.
- Allow administrators to manage cabin inventory.
- Allow administrators to manage users.
- Allow administrators to manage customer inquiries.
- Provide basic operational statistics.
- Allow administrators to control selected functionality using feature flags.
- Provide a professional responsive experience across desktop, tablet, and mobile devices.
- Demonstrate a clean Next.js + Convex application architecture.

---

# 4. Non-Goals

The following functionality is explicitly outside the initial scope unless added later:

- Multi-property owner accounts
- Airbnb/Booking.com synchronization
- Channel management
- Dynamic pricing algorithms
- Complex tax engines
- Loyalty programs
- Gift cards
- Multi-currency payments
- Multi-language support
- Native mobile applications
- Staff scheduling
- Housekeeping management
- Maintenance ticketing
- Accounting integrations
- Full CMS functionality
- Enterprise RBAC systems
- Advanced BI/reporting
- Complex refund workflows
- Split payments
- Multiple payment processors

The architecture should not intentionally prevent these capabilities from being introduced later, but no infrastructure should be created solely to support hypothetical future functionality.

---

# 5. User Types

The application contains three primary user categories.

## 5.1 Visitor

An unauthenticated visitor can:

- View the homepage.
- Browse cabins.
- View cabin details.
- View cabin availability.
- Read company information.
- Submit contact inquiries.
- Create an account.
- Sign in.
- Subscribe to marketing/newsletter updates.
- Review Terms and Privacy Policy.

Authentication should only be required when functionality specifically requires identifying the user.

---

## 5.2 Guest

A Guest is an authenticated customer.

Guests inherit visitor functionality and can additionally:

- Make reservations.
- Complete checkout when payments are enabled.
- View their reservations.
- View reservation details.
- View their basic profile.
- Update permitted profile information.
- Log out.

The Guest Dashboard should intentionally remain small and focused.

It should **not** resemble the much larger administration dashboard.

---

## 5.3 Administrator

Administrators have access to the internal Admin Dashboard.

Administrators can:

- View operational statistics.
- View and manage reservations.
- Create and manage cabins.
- Manage cabin availability/configuration.
- View users.
- Manage customer messages.
- Manage subscribers.
- Modify application settings.
- Manage feature flags.

Administrative authorization must be enforced server-side and must never depend exclusively on hiding routes or interface elements.

---

# 6. Technical Stack

## 6.1 Frontend

**Framework:** Next.js
**Language:** TypeScript
**Styling:** Tailwind CSS
**Component System:** shadcn/ui
**Icons:** Lucide
**Primary Font:** Josefin Sans or any font that helps achieve the expected result
**Package Manager:** Bun

The application should use the modern Next.js App Router architecture.

Server and Client Components should be selected deliberately rather than making the entire application client-rendered

Client Components should primarily be introduced where browser state, interactivity, Convex subscriptions, or client-side APIs require them.

---

# 7. Backend

## 7.1 Convex

Convex will provide the primary application backend.

Responsibilities include:

- Database
- Queries
- Mutations
- Actions
- Real-time updates
- Business logic
- Authorization checks
- Reservation management
- Cabin management
- User/application data
- Feature flags
- Administrative statistics
- Contact messages
- Subscriber management

Business rules should reside primarily in the backend rather than being enforced only by frontend components.

---

# 8. Authentication

Authentication will use:

**Better Auth integrated with Convex**

Authentication must support:

- Sign up
- Sign in
- Sign out
- Forgot password
- Password reset
- Session persistence
- Protected routes
- Authenticated Convex operations

The initial implementation can use email/password authentication.

Additional authentication providers are outside the initial scope unless implementation effort is trivial.

---

# 9. Authorization

The application requires two authenticated application roles:

```
guest
admin
```

New users should receive the `guest` role by default.

Admin accounts should not be creatable through public registration.

Administrative permissions must be checked by Convex functions handling protected operations.

For example:

```
Client
   ↓
Admin UI
   ↓
Convex Mutation
   ↓
Authentication Check
   ↓
Admin Authorization Check
   ↓
Database Operation
```

The UI may hide unauthorized functionality for usability, but backend authorization remains authoritative.

---

# 10. Data Fetching

Convex should be the default mechanism for retrieving application data.

TanStack Query should only be introduced where it provides a concrete benefit, such as:

- External API requests
- Specialized caching requirements
- Third-party services
- Non-Convex data sources

The project should avoid adding TanStack Query simply as another abstraction around data already naturally managed by Convex.

---

# 11. Testing

Testing stack:

- Vitest
- React Testing Library
- Convex testing utilities

Testing should focus on meaningful business behavior rather than maximizing coverage percentages.

Priority areas include:

- Reservation date validation
- Availability calculations
- Booking conflicts
- Pricing calculations
- Authentication-dependent behavior
- Admin authorization
- Feature flags
- Payment-disabled booking behavior
- Important UI forms
- Critical Convex mutations

Tests should especially cover backend rules whose failure could create invalid reservations or unauthorized operations.

---

# 12. Brand & Visual Direction

## 12.1 Brand Concept

The fictional company represents premium cabins located in quiet wooded environments.

The brand should communicate:

- Nature
- Warmth
- Seclusion
- Simplicity
- Craftsmanship
- Premium hospitality

The interface should avoid the bright, generic appearance common to travel marketplaces.

Instead, the primary visual identity should use:

- Near-black backgrounds
- Warm white typography
- Gold/yellow accents
- Large cabin photography
- Generous spacing
- Minimal decoration

---

# 13. Color System

The provided shadcn theme is the source of truth for application design tokens.

The application supports light and dark themes technically, but **dark mode should be the primary brand experience**.

Important dark-mode colors include:

### Background

```
oklch(0.145 0 0)
```

Near-black primary background.

### Foreground

```
oklch(0.985 0 0)
```

Warm near-white primary text.

### Primary

```
oklch(0.7394 0.112 83.18)
```

Warm gold/yellow brand accent.

The primary color should be used intentionally for:

- Primary buttons
- Important links
- Active states
- Small decorative accents
- Important statistics
- Selected controls

It should not dominate large surfaces.

### Cards

```
oklch(0.205 0 0)
```

Cards should sit subtly above the background.

### Borders

```
oklch(0.275 0 0)
```

Borders should remain subtle.

### Destructive

Used for:

- Delete actions
- Dangerous administrative operations
- Errors
- Failed/cancelled states where appropriate

---

# 14. Typography

Primary font:

**Josefin Sans**

Fallback:

```
Josefin Sans, ui-sans-serif, sans-serif, system-ui
```

Typography should use clear hierarchy.

Large marketing headings can use lighter or medium weights with generous spacing.

Administrative interfaces should prioritize readability over decorative typography.

Avoid excessive use of uppercase text despite Josefin Sans lending itself well to uppercase branding.

---

# 15. Shape & Elevation

Base radius:

```
0.625rem
```

Interfaces should use moderately rounded corners.

Cards and panels should use subtle elevation based on the supplied shadow tokens.

Avoid:

- Heavy shadows
- Excessive gradients
- Glassmorphism
- Excessive blur
- Highly animated UI
- Excessive rounded/pill components

The visual style should remain understated.

---

# 16. Motion

Animations should primarily communicate state or improve transitions.

Appropriate uses include:

- Dropdowns
- Dialogs
- Mobile navigation
- Image galleries
- Accordion sections
- Toast notifications
- Hover states
- Page/content transitions where subtle

Animations should generally remain within approximately 150–300ms.

Motion should never delay important actions.

---

# 17. Responsive Design

The application must support:

- Mobile
- Tablet
- Desktop
- Large desktop

The public site should be designed mobile-first.

Important booking actions should remain easy to access on small screens.

The Admin Dashboard may be desktop-oriented but must remain functional on tablet and reasonably usable on mobile.

Administrative tables should adapt through approaches such as:

- Horizontal scrolling
- Responsive columns
- Mobile card representations

depending on the content.

---

# 18. Accessibility

The application should target WCAG 2.1 AA practices where reasonably achievable.

Requirements include:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper form labels
- Accessible dialogs
- Sufficient contrast
- Alt text for meaningful images
- Accessible error messages
- `aria-*` attributes where required

shadcn components should retain their underlying accessibility behavior.

---

# 19. Public Application Structure

Primary public routes:

```
/
├── cabins
│   └── [slug]
├── about
├── contact
├── sign-in
├── sign-up
├── forgot-password
├── checkout
│   ├── summary
│   ├── success
│   └── cancel
├── dashboard
├── privacy
└── terms
```

Administrative routes:

```
/admin
├── bookings
├── cabins
├── messages
├── subscribers
├── users
├── feature-flags
└── settings
```

---

# 20. Shared Public Layout

The public website should contain a consistent navigation system.

## Header

Suggested navigation:

- Home
- Cabins
- About
- Contact

Right-side actions:

Unauthenticated:

- Sign In
- Book a Cabin / Explore Cabins

Authenticated:

- Dashboard / profile menu

The header should remain visually minimal.

A transparent or dark overlay header may be used over large hero photography.

---

# 21. Footer

The footer should contain:

- Company branding
- Short company description
- Navigation
- Cabins link
- Contact link
- Privacy Policy
- Terms
- Newsletter subscription
- Social placeholders if desired
- Copyright

Example:

```
© 2026 [Company Name]. All rights reserved.
```

---

# 22. Home Page

Route:

```
/
```

The homepage is primarily a marketing and discovery page.

## 22.1 Hero

The hero should feature:

- High-quality cabin/nature photography
- Strong headline
- Short supporting copy
- Primary CTA
- Optional secondary CTA

Example concept:

```
Disappear for a while.

Private cabins surrounded by woods,
designed for slower days and quieter nights.

[Explore Cabins]
```

---

# 23. Availability Search

The homepage should provide a simple availability/search interface.

Inputs:

- Check-in
- Check-out
- Number of guests

Action:

```
Search Cabins
```

Search should redirect users to the Cabins page with appropriate search parameters.

Example:

```
/cabins?checkIn=...&checkOut=...&guests=2
```

---

# 24. Featured Cabins

Display a curated selection of cabins.

Each card should contain:

- Cover image
- Cabin name
- Location
- Maximum guests
- Bedrooms/beds where appropriate
- Starting nightly price
- Short description
- View Cabin action

---

# 25. Marketing Sections

The homepage may include sections such as:

### Escape the noise

Short explanation of the cabin experience.

### Built for slowing down

Highlight:

- Privacy
- Nature
- Comfort
- Thoughtful amenities

### Featured amenities

Examples:

- Fireplace
- Hot tub
- Forest views
- Wi-Fi
- Kitchen
- Outdoor firepit

### Final CTA

Encourage visitors to browse available cabins.

---

# 26. Cabins Page

Route:

```
/cabins
```

Displays available cabin inventory.

## Search Controls

Users can filter by:

- Check-in
- Check-out
- Guests

Optional simple filters may include:

- Maximum price
- Amenities

Avoid building a complex marketplace filtering system.

---

# 27. Cabin Cards

Each cabin card should display:

- Cover image
- Cabin name
- Short location
- Short description
- Guest capacity
- Bedroom/bed information
- Nightly price
- Important amenities
- View Details action

Cards should prioritize photography.

---

# 28. Cabin Details

Route:

```
/cabins/[slug]
```

The cabin details page should contain:

- Cabin name
- Location
- Image gallery
- Description
- Guest capacity
- Bedrooms
- Beds
- Bathrooms
- Amenities
- Pricing
- Availability
- Booking panel

---

# 29. Image Gallery

Cabins should support multiple images.

Desktop may use a large primary image plus smaller secondary images.

Users should be able to open a larger gallery/lightbox.

Mobile should provide a swipe-friendly gallery.

---

# 30. Amenities

Amenities should use Lucide icons where appropriate.

Example:

```
Wifi
Fireplace
Hot Tub
Kitchen
Heating
Parking
Forest View
Outdoor Firepit
Coffee Maker
```

Amenities should be configurable per cabin.

---

# 31. Cabin Booking Panel

The booking panel should allow selection of:

- Check-in date
- Check-out date
- Number of guests

It should calculate:

```
Nightly Rate × Number of Nights
+ Cleaning Fee
+ Taxes
-----------------
Total
```

Optional configurable fees should remain simple.

The system must validate availability before allowing checkout.

---

# 32. Availability Rules

Reservations should follow these rules:

- Check-out must occur after check-in.
- Reservations cannot start in the past.
- Guest count cannot exceed cabin capacity.
- Existing confirmed reservations block overlapping dates.
- Pending reservations may temporarily block dates depending on payment flow.
- Administratively blocked dates are unavailable.

Availability must be validated again on the backend before creating or confirming a reservation.

Frontend availability indicators are not authoritative.

---

# 33. Booking Flow

Recommended standard booking flow:

```
Cabin
   ↓
Select dates + guests
   ↓
Validate availability
   ↓
Sign in / Sign up if required
   ↓
Checkout Summary
   ↓
Payment
   ↓
Reservation confirmed
   ↓
Success
```

---

# 34. Authentication During Booking

Visitors should be able to browse and configure a reservation without authentication.

Authentication should be requested when the user attempts to continue into checkout.

After authentication, booking context should be preserved where practical.

---

# 35. Checkout Summary

Route:

```
/checkout/summary
```

Display:

- Cabin
- Cover image
- Check-in
- Check-out
- Number of nights
- Number of guests
- Nightly rate
- Fees
- Taxes
- Total
- Guest information

Primary CTA:

```
Pay & Confirm
```

when payments are enabled.

---

# 36. Stripe Integration

Stripe should be used for payment processing.

The application should prefer Stripe-hosted Checkout unless the project specifically requires a custom payment form.

Advantages include:

- Reduced payment UI complexity
- Stripe-hosted PCI-sensitive interactions
- Familiar checkout UX
- Reliable payment handling

The application must never store raw credit card information.

---

# 37. Payment Confirmation

Successful browser redirection must not be treated as authoritative proof of payment.

Reservation payment status should ultimately be synchronized through Stripe's server-side event/webhook flow.

Relevant concepts include:

```
pending
paid
failed
refunded
```

A successful payment should transition the reservation into its appropriate confirmed state.

Webhook processing must be idempotent.

---

# 38. Checkout Success

Route:

```
/checkout/success
```

Display:

- Confirmation message
- Reservation reference
- Cabin
- Dates
- Total
- Link to Guest Dashboard

Example:

```
Your cabin is waiting.

Your reservation has been confirmed.
```

---

# 39. Checkout Cancel

Route:

```
/checkout/cancel
```

Explain that checkout was cancelled and no completed payment was recorded.

Provide:

- Return to cabin
- Retry checkout

The application should avoid creating permanently confirmed reservations from cancelled checkout attempts.

---

# 40. Feature Flag System

Feature flags are an important administrative capability.

Initial feature:

```
stripePaymentsEnabled
```

The system should nevertheless use a generic feature flag data model so additional flags can be introduced later without redesigning the feature.

Example:

```
key
name
description
enabled
updatedAt
updatedBy
```

# 41. Payment Feature Flag Behavior

When:

```
stripePaymentsEnabled = true
```

the normal booking process applies:

```
Cabin
→ Booking Details
→ Checkout Summary
→ Stripe Checkout
→ Payment Confirmation
→ Reservation Confirmed
```

When:

```
stripePaymentsEnabled = false
```

the application should use a **demo booking flow rather than disabling reservations entirely**.

This provides a better demonstration of the complete product while preventing visitors from creating real Stripe Checkout sessions or transactions.

The alternative flow should be:

```
Cabin
→ Booking Details
→ Checkout Summary
→ Demo Confirmation
→ Reservation Confirmed
```

The Checkout Summary should clearly communicate that online payments are currently disabled and that the reservation is being processed in demonstration mode.

For example:

> Online payments are currently disabled. You may continue with this reservation without payment.

The primary action becomes:

```
Confirm Reservation
```

instead of:

```
Pay & Confirm
```

The resulting reservation should record that no payment was required.

This distinction is important because a demo reservation should never appear internally as a successfully paid Stripe reservation.

Suggested fields include:

```
paymentRequired: boolean
paymentStatus:
  - not_required
  - pending
  - paid
  - failed
  - refunded
```

For demo reservations:

```
paymentRequired = false
paymentStatus = "not_required"
```

This approach provides several advantages:

- The entire booking UX remains demonstrable.
- Stripe cannot be spammed through the public demo.
- Developers and reviewers can test reservations.
- Admin statistics continue to receive realistic data.
- Demo bookings are clearly distinguishable from paid bookings.
- No fake payment records need to be created.

The feature flag must be validated by the backend when creating the reservation. Hiding the Stripe button in the frontend is not sufficient.

---

# 42. Feature Flag Evaluation

Feature flags should be queried through a centralized backend utility rather than querying the database independently throughout the application.

Conceptually:

```
isFeatureEnabled("stripePayments")
```

Feature flag evaluation should have sensible defaults.

For security-sensitive or potentially expensive features such as payment creation, the preferred default is:

```
disabled
```

if the flag cannot be retrieved.

The frontend may use the same flag to adjust the interface, but backend validation remains authoritative.

---

# 43. Guest Dashboard

Route:

```
/dashboard
```

The Guest Dashboard should provide a deliberately lightweight account experience.

It should not reuse the full Admin Dashboard navigation.

Suggested layout:

```
┌───────────────────────────────────────────────┐
│ Logo                             User Menu    │
├──────────────┬────────────────────────────────┤
│ Overview     │                                │
│ Bookings     │          Content               │
│ Profile      │                                │
│              │                                │
│ Logout       │                                │
└──────────────┴────────────────────────────────┘
```

On mobile, the sidebar should collapse into an appropriate mobile navigation pattern.

---

# 44. Guest Dashboard Overview

The overview should contain a small number of useful pieces of information.

Recommended sections:

### Welcome

```
Welcome back, {firstName}
```

### Upcoming Stay

If an upcoming reservation exists, display:

- Cabin
- Cover image
- Check-in
- Check-out
- Number of guests
- Reservation status

### Recent Bookings

Display the user's most recent reservations.

### No Booking State

Users without reservations should receive a useful empty state.

Example:

```
No stays yet.

Your next escape could be closer than you think.

[Explore Cabins]
```

Avoid filling the guest dashboard with artificial metrics that provide little value.

---

# 45. Guest Bookings

The booking history should display:

- Reservation reference
- Cabin
- Dates
- Guests
- Total
- Reservation status
- Payment status

Reservations may be grouped into:

- Upcoming
- Past
- Cancelled

A dedicated reservation details view may be implemented through a page, drawer, or dialog depending on the final UX.

---

# 46. Guest Profile

Guests should be able to view and edit basic account information.

Initial fields:

- First name
- Last name
- Email
- Phone number, optional

Email changes should only be supported if they can be handled safely through Better Auth.

If email verification/re-authentication would make this unnecessarily complex for the first version, email can initially remain read-only.

The application should avoid storing unnecessary personal information.

---

# 47. Reservation Cancellation

Guests should be able to view whether a reservation can be cancelled.

For the initial version, cancellation rules should remain simple.

Suggested setting:

```
cancellationWindowHours
```

Example:

```
48
```

Meaning reservations cannot be self-cancelled within 48 hours of check-in.

If Stripe payment/refund functionality is not implemented for the initial version, paid reservation cancellations should require administrator intervention.

Demo reservations can be cancelled directly when permitted by the cancellation policy.

The interface must clearly distinguish between:

- Cancelling a reservation
- Requesting a refund

These should not be treated as equivalent operations.

---

# 48. About Page

Route:

```
/about
```

The About page should reinforce the fictional brand.

Suggested content sections:

- Company story
- Philosophy
- Cabin experience
- Sustainability/nature philosophy
- Photography
- CTA to explore cabins

The page should remain marketing-oriented rather than functioning as a corporate information page.

---

# 49. Contact Page

Route:

```
/contact
```

The contact page should contain:

- Name
- Email
- Subject
- Message

Optional:

- Phone number

Submission should create a contact message in Convex.

After submission, display a clear success state.

Basic abuse protection should be considered.

For a demonstration project, simple measures such as server-side validation, submission throttling/rate limiting where practical, and honeypot fields are sufficient.

A full CAPTCHA system should only be introduced if necessary.

---

# 50. Newsletter Subscription

Visitors should be able to subscribe using their email address.

The subscription form may appear:

- In the footer
- On the homepage
- Or both

Required field:

```
email
```

Subscribers should be stored separately from application users because newsletter subscription does not require an account.

Duplicate subscriptions should be handled gracefully.

---

# 51. Privacy Page

Route:

```
/privacy
```

The Privacy Policy should contain realistic placeholder/demo legal content covering:

- Information collected
- Account information
- Reservation information
- Payment processing
- Cookies
- Third-party services
- Data retention
- Contact information

Stripe should be identified as an external payment processor where applicable.

Because this is a fictional demonstration application, the legal content should not claim certifications or compliance that have not actually been established.

---

# 52. Terms Page

Route:

```
/terms
```

The Terms page should contain realistic sections covering:

- Booking terms
- Payment terms
- Cancellation
- Guest responsibilities
- Property rules
- Liability
- Privacy
- Account usage
- Contact

Again, these are demonstration terms and should not falsely imply legally reviewed policies.

---

# 53. Authentication Pages

Authentication pages should maintain the visual identity of the public website.

They should use a focused layout with minimal distractions.

Possible layout:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│       Cabin photography       Sign In              │
│                               Email                │
│                               Password             │
│                                                     │
│                               [Sign In]             │
│                                                     │
│                               Forgot password?     │
│                               Create an account    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Mobile should collapse into a single-column form.

---

# 54. Sign Up

Route:

```
/sign-up
```

Required fields:

- First name
- Last name
- Email
- Password
- Password confirmation

Requirements:

- Valid email
- Reasonable password requirements
- Matching passwords
- Terms acknowledgement where appropriate

New accounts receive:

```
role = "guest"
```

Users must never be able to specify their own role during registration.

---

# 55. Sign In

Route:

```
/sign-in
```

Fields:

- Email
- Password

Additional actions:

- Forgot password
- Create account

If the user arrived from a protected booking flow, successful authentication should return them to the appropriate booking process when possible.

---

# 56. Forgot Password

Route:

```
/forgot-password
```

The page allows users to request a password reset.

For privacy and security, the response should not reveal whether a specific email address exists.

Example:

```
If an account exists for that email address, we've sent password reset instructions.
```

Password reset tokens should be:

- Time-limited
- Single-purpose
- Invalidated appropriately after use

The exact implementation should follow Better Auth's supported password recovery flow.

---

# 57. Admin Application

The Admin Dashboard is the operational interface for the fictional cabin business.

Route:

```
/admin
```

Only administrators may access this route hierarchy.

Unauthorized authenticated users should receive an appropriate unauthorized response or redirect.

Unauthenticated users should be directed to authentication.

---

# 58. Admin Layout

Suggested desktop structure:

```
┌────────────────────────────────────────────────────────────┐
│ Sidebar │ Header                                           │
│         ├──────────────────────────────────────────────────│
│ Home    │                                                  │
│ Booking │                                                  │
│ Cabins  │                  Page Content                    │
│ Messages│                                                  │
│ Users   │                                                  │
│ Subs    │                                                  │
│ Flags   │                                                  │
│ Settings│                                                  │
│         │                                                  │
│ Logout  │                                                  │
└─────────┴──────────────────────────────────────────────────┘
```

Navigation should use Lucide icons.

Recommended icons could include:

- Home
- CalendarDays
- House
- MessageSquare
- Users
- Mail
- Flag
- Settings
- LogOut

The sidebar should clearly indicate the current section.

---

# 59. Admin Home

Route:

```
/admin
```

The Admin Home should function as an operational overview.

It should answer questions such as:

- How many reservations are upcoming?
- How many bookings were recently created?
- How much paid revenue has been recorded?
- Which cabins are being booked?
- Are there unread messages?

The dashboard should remain useful without becoming a full analytics product.

---

# 60. Admin KPI Cards

Suggested metrics:

### Total Bookings

Bookings within the selected reporting period.

### Upcoming Reservations

Confirmed future stays.

### Revenue

Successfully paid reservation revenue.

Demo reservations where:

```
paymentStatus = "not_required"
```

must not contribute to actual revenue.

### Occupancy

Approximate percentage of available cabin nights booked during the selected period.

### Unread Messages

Number of customer inquiries awaiting review.

A subset of these metrics may be selected if the complete set adds unnecessary implementation complexity.

---

# 61. Admin Recent Bookings

Display recent reservations with:

- Reference
- Guest
- Cabin
- Check-in
- Check-out
- Total
- Payment
- Status

Administrators should be able to navigate from a reservation to its details.

---

# 62. Admin Analytics

Basic charts may include:

### Bookings Over Time

Simple line/bar visualization.

### Revenue Over Time

Paid Stripe revenue only.

### Reservations by Cabin

Useful for understanding cabin popularity.

The application should not implement a dedicated analytics warehouse.

Statistics can be calculated directly from the application's operational data at the scale expected for this product.

---

# 63. Admin Bookings

Route:

```
/admin/bookings
```

Administrators should be able to browse all reservations.

The primary interface should be a table.

Columns:

- Reservation
- Guest
- Cabin
- Check-in
- Check-out
- Guests
- Booking status
- Payment status
- Total
- Created
- Actions

---

# 64. Booking Filters

Administrators should be able to filter reservations by:

- Search
- Reservation status
- Payment status
- Cabin
- Date range

Search should support useful identifiers such as:

- Reservation reference
- Guest name
- Guest email

Filters should remain simple and should not attempt to provide enterprise-level query building.

---

# 65. Reservation Status

Suggested booking lifecycle:

```
pending
confirmed
completed
cancelled
```

Definitions:

### Pending

Reservation has been initiated but is not yet confirmed.

Primarily useful during payment processing.

### Confirmed

Reservation is valid and scheduled.

### Completed

Stay has finished.

This status may initially be derived from dates instead of requiring a background job.

### Cancelled

Reservation is no longer active.

The system should avoid unnecessary status values unless a concrete workflow requires them.

---

# 66. Payment Status

Payment lifecycle:

```
not_required
pending
paid
failed
refunded
```

Possible future addition:

```
partially_refunded
```

should only be introduced if partial refunds are actually supported.

Reservation status and payment status must remain separate concepts.

For example:

```
reservationStatus = "confirmed"
paymentStatus = "not_required"
```

is valid for demo reservations.

---

# 67. Booking Details

Administrators should be able to inspect:

### Reservation

- Reference
- Status
- Creation date

### Guest

- Name
- Email
- Phone

### Stay

- Cabin
- Check-in
- Check-out
- Nights
- Guests

### Financial

- Nightly subtotal
- Cleaning fee
- Taxes
- Total
- Payment status
- Stripe reference where applicable

### Administrative Actions

Depending on state:

- Cancel reservation
- Mark/adjust status where appropriate
- View guest
- View cabin

Avoid allowing arbitrary editing of financial data after payment unless necessary.

---

# 68. Admin Cabins

Route:

```
/admin/cabins
```

Administrators should be able to:

- View cabins
- Create cabin
- Edit cabin
- Publish/unpublish cabin
- Manage images
- Manage amenities
- Configure pricing
- Configure capacity
- Block availability

Deleting cabins that have reservation history should generally be avoided.

Instead, cabins should be unpublished or archived.

---

# 69. Cabin Data

Each cabin should contain approximately:

```
name
slug
shortDescription
description

location
address? (internal/optional)

nightlyRate
cleaningFee

maxGuests
bedrooms
beds
bathrooms

coverImage
galleryImages[]

amenities[]

published

createdAt
updatedAt
```

Optional location information can remain intentionally vague publicly if the brand represents secluded properties.

---

# 70. Cabin Slugs

Cabins should have unique human-readable slugs.

Example:

```
/cabins/pine-ridge
/cabins/hidden-creek
/cabins/blackwood
```

Slug uniqueness must be validated by the backend.

Changing a slug after publication should be treated carefully because it changes the public URL.

For this demonstration project, automatic redirect history is unnecessary.

---

# 71. Cabin Images

Cabin images should use Convex-supported file storage unless another image service is intentionally selected.

The data model should distinguish:

```
coverImage
galleryImages
```

Administrators should be able to:

- Upload
- Remove
- Reorder gallery images
- Select/change cover image

Images should be optimized for web delivery.

The frontend should use the Next.js Image component where compatible with the selected storage approach.

---

# 72. Amenities

Amenities should preferably be represented through reusable amenity definitions rather than arbitrary text duplicated across cabins.

Example conceptual structure:

```
Amenity
-------
name
icon
category
```

Possible categories:

```
Essentials
Kitchen
Outdoor
Comfort
Entertainment
Accessibility
```

The icon can reference an approved Lucide icon identifier.

Avoid allowing arbitrary executable/icon code from stored data.

---

# 73. Cabin Availability Management

Administrators should be able to block dates manually.

Examples:

- Maintenance
- Private use
- Renovation
- Operational closure

Suggested entity:

```
AvailabilityBlock
-----------------
cabinId
startDate
endDate
reason
createdBy
createdAt
```

Availability calculations should consider both:

```
confirmed reservations
+
availability blocks
```

---

# 74. Admin Messages

Route:

```
/admin/messages
```

Messages originate from the public Contact form.

Fields include:

```
name
email
subject
message
status
createdAt
```

Suggested statuses:

```
unread
read
archived
```

Administrators should be able to:

- View message
- Mark read/unread
- Archive

Building a complete email client inside the application is outside scope.

---

# 75. Admin Subscribers

Route:

```
/admin/subscribers
```

Display newsletter subscribers.

Columns:

- Email
- Status
- Subscription date

Suggested status:

```
active
unsubscribed
```

Administrators may:

- Search subscribers
- View status
- Remove/unsubscribe a subscriber

Sending newsletters from the application is outside the initial scope.

The feature primarily demonstrates lead/subscriber management.

---

# 76. Admin Users

Route:

```
/admin/users
```

Administrators should be able to view registered accounts.

Columns:

- Name
- Email
- Role
- Registration date
- Booking count

Optional filters:

- Search
- Role

The first version should avoid complex account impersonation or permission-management functionality.

---

# 77. User Details

Administrators may view:

- Name
- Email
- Role
- Registration date
- Reservation history

Changing user roles should either:

1. Not be exposed in the initial UI, or
2. Be limited to safe admin-only operations.

The application should never allow the last required administrative account to accidentally remove its own access if role management is introduced.

For this version, keeping role assignment outside the normal user-management UI is acceptable and reduces unnecessary security complexity.

---

# 78. Admin Feature Flags

Route:

```
/admin/feature-flags
```

The page should display available application flags.

Example:

```
┌─────────────────────────────────────────────────────────┐
│ Stripe Payments                                        │
│                                                         │
│ Enables real Stripe checkout for cabin reservations.   │
│                                          [ ON / OFF ]   │
│                                                         │
│ Last updated: Aug 8, 2026 by Admin                     │
└─────────────────────────────────────────────────────────┘
```

Changes should require admin authorization.

For consequential flags such as payments, changing the value should display a confirmation dialog.

Example:

```
Disable Stripe payments?

Guests will still be able to create demo reservations,
but no new Stripe Checkout sessions will be created.

[Cancel] [Disable Payments]
```

---

# 79. Feature Flag Audit Information

Track all important actions from the admin dashboard
