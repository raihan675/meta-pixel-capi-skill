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

## ⚠️ Mandatory Pre-Implementation Discovery Gate (ALWAYS ASK FIRST)

**CRITICAL OPERATING RULE:** Whenever this skill is invoked to implement, audit, or modify tracking, **NEVER proceed blindly or generate arbitrary configurations without verification**. You MUST first ask the user the following structured discovery questions (or confirm any parameters not already established in context):

1. **Target Platform / CMS:**
   * What platform or framework does the website use? *(e.g., WooCommerce, Shopify, PrestaShop, Magento, Next.js / Custom Headless)*
2. **Tracking Architecture Scope:**
   * **Option A (Recommended):** Full Hybrid Dual-Tagging (Browser Pixel + Server-Side CAPI with strict deduplication).
   * **Option B:** Browser-Side Meta Pixel only (Web GTM).
   * **Option C:** Server-Side Conversions API only (Server GTM / Direct API).
3. **Server-Side Infrastructure (If CAPI is involved):**
   * Are you hosting Server GTM on **Stape.io** (recommended) or **Google Cloud Platform (GCP)**?
   * Do you have access to DNS to map a first-party custom tagging subdomain (e.g., `ss.yourdomain.com`)?
4. **Web GTM Tag Template Preference:**
   * **Stape.io Facebook Pixel Template:** *(Recommended for Stape users)* — Enables the Custom Loader to bypass browser ad-blockers (recovers 15–25% lost browser hits), extends Safari ITP cookies, and provides automatic client-side hashing.
   * **Meta Official Template (`facebookarchive`):** — Direct Meta-maintained standard for strict corporate compliance.
5. **DataLayer Availability:**
   * Is a standard GA4-compliant ecommerce DataLayer already active on the site, or does the DataLayer need to be audited/implemented first?
6. **Meta Credentials Readiness:**
   * Do you already have the **Meta Dataset / Pixel ID**, **Conversions API Access Token**, and optional **Test Event Code** (`TESTxxxxx`)?

*Wait for the user's response or confirm reasonable defaults based on their specific answers before executing tag creation, script deployment, or container JSON exports.*

---

## 1. Core Operating Principles

1. **Always Implement Dual-Tagging:**
   * Browser Pixel (client-side) + Conversions API (server-side via GA4 transport in Web GTM).
   * Host Server GTM on a first-party custom domain (`ss.domain.com`) to extend `_fbp`/`_fbc` cookie lifetime to 90 days.

2. **Mandatory Protocol for Meta Conversions API (CAPI) / Server-Side Tracking:**
   Whenever asked to implement or update Meta Conversions API or Server-Side Tracking, the agent **MUST STRICTLY EXECUTE BOTH SIDES** following **[Playbook 2: Meta Conversions API (CAPI) Server-Side Setup Guide (sGTM + Stape.io)](./setup-guides/02-meta-conversions-api-server-guide.md)** and the modular guides in **[04-server-gtm-implementation/](./04-server-gtm-implementation/)**:
   
   * **PART A: Web GTM Transport Layer (Playbook 2, Steps 7 & 8)**
     1. **First-Party Cookie & User Variables**:
        * `Cookie - _fbp` (1st Party Cookie: `_fbp`)
        * `Cookie - _fbc` (1st Party Cookie: `_fbc`)
        * `DLV - Customer User ID` (`user_data.customer_id` or `customerId`)
     2. **Google Tag - Server Transport (`googtag`)**:
        * Config Settings: `server_container_url: {{Const - Server Container URL}}`, `first_party_collection: true`, `send_page_view: true`.
        * Shared Event Settings: `event_id: {{Event ID - De duplication}}`, `x-fb-ck-fbp: {{Cookie - _fbp}}`, `x-fb-ck-fbc: {{Cookie - _fbc}}`.
        * Trigger: `All Pages`.
     3. **GA4 Ecommerce Event Tags with Mandatory `x-fb-cd-*` Convention**:
        * The `x-fb-cd-*` format is mandatory per [x-fb-parameter-mapping-explained.md](./04-server-gtm-implementation/x-fb-parameter-mapping-explained.md) because Server CAPI templates automatically strip the prefix and map parameters into Meta's authoritative `custom_data` object without manual server scripting.
        * `GA4 - Event - ViewItem` (`view_item`): `event_id`, `x-fb-cd-content_type: product`, `x-fb-cd-content_ids`, `x-fb-cd-content_name`, `x-fb-cd-content_category`, `x-fb-cd-value`, `x-fb-cd-currency`, `x-fb-cd-contents`, `x-fb-ck-fbp`, `x-fb-ck-fbc`. Trigger: `Custom Event - View Item`.
        * `GA4 - Event - AddToCart` (`add_to_cart`): Identical parameters to `view_item`. Trigger: `Custom Event - Add to Cart`.
        * `GA4 - Event - BeginCheckout` (`begin_checkout`): Identical parameters + `x-fb-cd-num_items: {{cJS - FB - Num of Items}}`. Trigger: `Custom Event - Begin Checkout`.
        * `GA4 - Event - Purchase` (`purchase`): Identical parameters + `x-fb-cd-order_id: {{DLV - Transaction ID}}`, `x-fb-ud-external_id: {{DLV - Customer User ID}}`, and customer billing parameters (`email`, `phone`, `first_name`, `last_name`, `city`, `state`, `postal_code`, `country`) for **EMQ 8.0+**. Trigger: `Custom Event - Purchase`.

   * **PART B: Server GTM CAPI Layer (Playbook 2, Steps 6 & 11 & [04-server-gtm-implementation/](./04-server-gtm-implementation/))**
     1. **Template Installation**: Install `stape-io/facebook-tag` (or `facebookincubator/conversions-api-tag`) into Server GTM.
     2. **Server Variables**:
        * `Const - Meta Pixel ID`
        * `Const - Meta CAPI Access Token`
        * `Const - Meta Test Event Code`
        * `ED - Event ID` (Event Data variable: `event_id`)
        * `ED - Client Name` (Event Data variable: `client_name`)
     3. **Server Trigger**: `All Events - GA4 Client` (Custom Event matching `.*` when client is `GA4`).
     4. **Server Tag**: `Meta CAPI - All Events` (Event Name: `inherit`, Pixel ID, Access Token, Test ID, auto-map server data: `true`, auto-map user data: `true`, auto-map custom data: `true`, generate `_fbp`: `true`).
     5. **Anti-PII Protection**: If a downstream GA4 Server Tag exists, exclude `x-fb-*`, `user_data`, `email`, and `phone` per [exclude-parameters-from-ga4.md](./04-server-gtm-implementation/exclude-parameters-from-ga4.md).

3. **Strict Event Deduplication:**
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

## 3. Step-by-Step Playbooks & Template Decision Engine

### A. Dedicated Implementation Playbooks
* 📘 **Playbook 1: Browser Meta Pixel**: [setup-guides/01-meta-pixel-browser-setup-guide.md](./setup-guides/01-meta-pixel-browser-setup-guide.md)
  * Full Web GTM procedural guide covering base `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`, and Advanced Matching.
* 📗 **Playbook 2: Server-Side Conversions API (CAPI)**: [setup-guides/02-meta-conversions-api-server-guide.md](./setup-guides/02-meta-conversions-api-server-guide.md)
  * Complete 12-step lifecycle covering sGTM, Stape.io, custom domains (`ss.domain.com`), GA4 routing, `x-fb-cd-*` parameter translation, deduplication, and EMQ 8.0+.
* 📙 **Playbook 3: Meta Ads Specialist Collaboration Workflow**: [setup-guides/03-non-technical-meta-ads-specialist-workflow.md](./setup-guides/03-non-technical-meta-ads-specialist-workflow.md)
  * Non-technical, business-oriented guide for Meta media buyers to implement tracking via AI agent collaboration with zero manual coding.
* 📋 **Playbook 4: Specialist Step-by-Step Prompt Sequence**: [setup-guides/04-specialist-prompt-sequence.md](./setup-guides/04-specialist-prompt-sequence.md)
  * Ready-to-use, copy-pasteable prompt sequence to drive the AI agent from project kickoff to production publish.

### B. Template Selection Engine: "Which Tag Template Should I Use?"
When asked which Web GTM Pixel tag template to choose:
* 🏆 **Choose Stape.io Facebook Pixel Template (`stape-io`) IF**:
  1. Server-side tracking / CAPI runs through Stape.io.
  2. You want the Custom Loader to bypass browser ad-blockers (uBlock, Brave, AdGuard) and recover 15–25% lost browser hits.
  3. You want native `event_id` fields and automated client-side SHA-256 user data hashing.
* 🏛️ **Choose Meta Official Template (`facebookarchive` / `meta`) IF**:
  1. The client has strict corporate policies prohibiting third-party vendor templates.
  2. You want direct 1:1 parity with Meta's developer documentation screenshots.
* 👉 Detailed comparison and configuration guide: [03-web-gtm-implementation/meta-official-vs-stape-pixel-template.md](./03-web-gtm-implementation/meta-official-vs-stape-pixel-template.md).

---

## 4. Skill Documentation Index

Refer to the included modular guides for step-by-step procedures:

* [Meta Official vs Stape Pixel Template Guide](./03-web-gtm-implementation/meta-official-vs-stape-pixel-template.md)
* [Playbook 1: Browser Pixel Setup Guide](./setup-guides/01-meta-pixel-browser-setup-guide.md)
* [Playbook 2: Server Conversions API Setup Guide](./setup-guides/02-meta-conversions-api-server-guide.md)
* [Playbook 3: Meta Ads Specialist Collaboration Guide](./setup-guides/03-non-technical-meta-ads-specialist-workflow.md)
* [Playbook 4: Specialist Step-by-Step Prompt Sequence](./setup-guides/04-specialist-prompt-sequence.md)
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
