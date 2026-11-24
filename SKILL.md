---
name: meta-pixel-capi
description: >-
  Enterprise-grade implementation, audit, and troubleshooting skill for Meta Pixel
  and Server-Side Conversions API (CAPI). Covers GTM Web & Server containers, Stape.io,
  event deduplication (event_id), Event Match Quality (EMQ 8.0+), x-fb-cd-* parameters,
  and full-funnel ecommerce tracking.
---

# Meta Pixel & Conversions API (CAPI) Skill

Use this skill whenever you need to design, implement, audit, or troubleshoot Meta Pixel and Conversions API (CAPI) tracking setups across web and server containers.

---

## 1. Core Operating Principles

1. **Always Implement Dual-Tagging:**
   * Browser Pixel (client-side) + Conversions API (server-side via GA4 transport in Web GTM).
   * Host Server GTM on a first-party custom domain (`ss.domain.com`) to extend `_fbp`/`_fbc` cookie lifetime to 90 days.

2. **Strict Event Deduplication:**
   * Generate a unique `event_id` per user interaction.
   * Pass the exact same `event_id` and standard event name (`PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`) to both Browser Pixel and Server CAPI tags.

3. **Maximize Event Match Quality (EMQ):**
   * Capture customer information parameters (`em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`, `country`, `external_id`) as early as possible.
   * Server GTM automatically handles SHA-256 hashing and normalization.

4. **100% Catalog Matching for Advantage+ Ads:**
   * Ensure `content_ids` in tracking tags strictly matches the `id` / `retailer_id` in the Meta Product Catalog feed.
   * Send the structured `contents` array with item `id`, `quantity`, and `item_price`.

5. **Exclude Facebook PII from Google Analytics:**
   * In Server GTM GA4 tags, always exclude `x-fb-*` and raw `user_data.*` parameters to comply with Google Anti-PII policies.

---

## 2. Standard Event & Parameter Reference

* **Event Mapping:**
  * `page_view` ➔ `PageView`
  * `view_item` ➔ `ViewContent`
  * `add_to_cart` ➔ `AddToCart`
  * `begin_checkout` ➔ `InitiateCheckout`
  * `purchase` ➔ `Purchase`
  * `search` ➔ `Search`

* **Key Parameter Prefixes in GA4 Web Tag:**
  * `x-fb-cd-*` ➔ Automatically converted by the CAPI tag into `custom_data` (`content_ids`, `content_type`, `num_items`, etc.).
  * `x-fb-ck-*` ➔ Automatically converted into cookie identifiers (`_fbp`, `_fbc`).
  * `x-fb-ud-*` ➔ Automatically converted into user data (`external_id`, `db`, `ge`).

---

## 3. Skill Documentation Index

Refer to the included modular guides for step-by-step procedures:

* [Architecture & Data Flow](./01-architecture-and-fundamentals/dual-tagging-hybrid-architecture.md)
* [Event Deduplication Guide](./01-architecture-and-fundamentals/event-deduplication-guide.md)
* [Event Match Quality (EMQ) Guide](./01-architecture-and-fundamentals/event-match-quality-emq.md)
* [Standard Events Matrix](./02-meta-events-and-parameters/standard-events-matrix.md)
* [Custom Data Parameters](./02-meta-events-and-parameters/custom-data-parameters.md)
* [Customer Information Parameters](./02-meta-events-and-parameters/customer-information-parameters.md)
* [FBP & FBC Cookie Handling](./02-meta-events-and-parameters/fbp-fbc-and-cookie-handling.md)
* [Web GTM Setup Guide](./03-web-gtm-implementation/web-container-setup-guide.md)
* [Web Pixel Tags Setup](./03-web-gtm-implementation/web-pixel-tags.md)
* [DataLayer Variables & cJS Helpers](./03-web-gtm-implementation/datalayer-variables-and-cjs.md)
* [Server GTM Setup Guide](./04-server-gtm-implementation/server-container-setup-guide.md)
* [GA4 Client Configuration](./04-server-gtm-implementation/ga4-client-configuration.md)
* [Conversions API Tag Setup](./04-server-gtm-implementation/conversions-api-tag-setup.md)
* [Why x-fb-cd-* Format is Used](./04-server-gtm-implementation/x-fb-parameter-mapping-explained.md)
* [Exclude FB Parameters from GA4](./04-server-gtm-implementation/exclude-parameters-from-ga4.md)
* [IPv4 to IPv6 Transformation](./04-server-gtm-implementation/ipv4-to-ipv6-transformation.md)
* [WooCommerce DataLayer Spec](./05-ecommerce-tracking-plans/woocommerce-datalayer-spec.md)
* [Shopify DataLayer Spec](./05-ecommerce-tracking-plans/shopify-datalayer-spec.md)
* [Full-Funnel QA Checklist](./05-ecommerce-tracking-plans/full-funnel-event-checklist.md)
* [Custom JavaScript Helpers](./06-code-snippets-and-templates/custom-javascript-variables.js)
* [Troubleshooting & Error Catalog](./06-code-snippets-and-templates/troubleshooting-and-error-catalog.md)
