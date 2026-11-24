# Meta Pixel & Conversions API (CAPI) Enterprise Knowledge Base

Welcome to the comprehensive, production-ready knowledge base and implementation guide for **Meta Pixel & Server-Side Conversions API (CAPI)** using Google Tag Manager (Web & Server Containers) and Stape.io / Google Cloud.

This repository consolidates official Meta developer specifications, Stape.io best practices, Simo Ahava technical guides, and real-world verified implementations.

---

## 🚀 How to Install and Use this Skill in Google Antigravity

You can load this entire repository as an active **Antigravity Skill** on any computer with a single command.

### Option 1: Global Installation (Recommended)
Installs the skill across **all** your projects and workspaces on your machine:

* **Windows (PowerShell):**
  ```powershell
  git clone https://github.com/raihan675/meta-pixel-capi-skill.git "$env:USERPROFILE\.gemini\config\skills\meta-pixel-capi"
  ```

* **Mac / Linux (Terminal):**
  ```bash
  git clone https://github.com/raihan675/meta-pixel-capi-skill.git ~/.gemini/config/skills/meta-pixel-capi
  ```

---

### Option 2: Project-Specific Installation
If you want to use this skill only within a specific client repository or project workspace, run this command in your project's root folder:

```bash
git clone https://github.com/raihan675/meta-pixel-capi-skill.git .agents/skills/meta-pixel-capi
```

---

### 🔄 Keeping Your Skill Updated
To sync the latest guides and improvements, navigate to the installed skill folder and pull:
```bash
git pull
```

---

## 🎯 Step-by-Step Implementation Playbooks & Template Guide

Get straight to implementation using our dedicated, production-verified playbooks:

* 📘 **[Playbook 1: Meta Pixel Browser-Side Setup Guide (Web GTM)](./setup-guides/01-meta-pixel-browser-setup-guide.md)**
  Complete walkthrough for Web GTM client-side tracking: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`, and Advanced Matching.
* 📗 **[Playbook 2: Meta Conversions API (CAPI) Server-Side Setup Guide (sGTM + Stape)](./setup-guides/02-meta-conversions-api-server-guide.md)**
  Complete 12-step lifecycle: sGTM provisioning, Stape custom domain (`ss.domain.com`), GA4 transport, `x-fb-cd-*` parameter translation, deduplication, and EMQ 8.0+.
* ⚖️ **[Template Selection Guide: Meta Official vs. Stape.io Pixel Template](./03-web-gtm-implementation/meta-official-vs-stape-pixel-template.md)**
  Direct comparison, ad-blocker bypassing analysis, cookie preservation, and decision matrix for choosing between `facebookarchive` and `stape-io` Web GTM templates.

---

## 📂 Repository Structure & Navigation

### [01. Architecture & Fundamentals](./01-architecture-and-fundamentals)
Core architectural concepts, the hybrid tracking model, and data hygiene:
* **[Dual-Tagging Hybrid Architecture](./01-architecture-and-fundamentals/dual-tagging-hybrid-architecture.md):** Why browser-only tracking is failing, how GA4 Web Tag routes to Server GTM, and the complete data flow.
* **[Event Deduplication Guide](./01-architecture-and-fundamentals/event-deduplication-guide.md):** How Meta's 48-hour deduplication works, generating unified `event_id` keys, and avoiding double-counting conversions.
* **[Event Match Quality (EMQ) Optimization](./01-architecture-and-fundamentals/event-match-quality-emq.md):** Parameter priority matrix, data normalization, automatic SHA-256 hashing, and achieving an 8.0+ score.

---

### [02. Meta Events & Parameters](./02-meta-events-and-parameters)
Complete parameter definitions and schemas:
* **[Standard Events Matrix](./02-meta-events-and-parameters/standard-events-matrix.md):** GA4 Event names vs Meta Standard Event names (`view_item` ➔ `ViewContent`, etc.) and regex trigger setup.
* **[Custom Data Parameters (`custom_data`)](./02-meta-events-and-parameters/custom-data-parameters.md):** Mapping `x-fb-cd-*` to `content_ids`, `contents`, `content_type`, `value`, and `currency` for Advantage+ Catalog Ads.
* **[Customer Information Parameters (`user_data`)](./02-meta-events-and-parameters/customer-information-parameters.md):** Advanced Matching parameters (`em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`, `country`, `external_id`).
* **[Click ID (`fbc`) & Browser ID (`fbp`) Handling](./02-meta-events-and-parameters/fbp-fbc-and-cookie-handling.md):** Format, lifespan, extraction, and server-side first-party cookie extension via custom domain.

---

### [03. Web GTM Implementation](./03-web-gtm-implementation)
Step-by-step setup in the client-side Web GTM container:
* **[Meta Official vs. Stape Pixel Template Guide](./03-web-gtm-implementation/meta-official-vs-stape-pixel-template.md):** Architectural comparison, ad-blocker bypassing, cookie duration, and template selection guide.
* **[Web Container Setup Guide](./03-web-gtm-implementation/web-container-setup-guide.md):** High-level roadmap, templates to import, and container settings.
* **[Google Tag Configuration](./03-web-gtm-implementation/google-tag-configuration.md):** Configuring `server_container_url`, `send_page_view`, `first_party_collection`, and base Meta cookie parameters.
* **[Client-Side Meta Pixel Tags](./03-web-gtm-implementation/web-pixel-tags.md):** Tag configuration for `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, and `Purchase`.
* **[DataLayer Variables & cJS Helpers](./03-web-gtm-implementation/datalayer-variables-and-cjs.md):** Ready-to-use GTM variables and JavaScript array transformation functions.

---

### [04. Server GTM Implementation](./04-server-gtm-implementation)
Cloud setup and server container engineering:
* **[Server Container Setup Guide](./04-server-gtm-implementation/server-container-setup-guide.md):** Stape.io provisioning, Container Config Keys, and Custom Domain DNS setup.
* **[GA4 Client Configuration](./04-server-gtm-implementation/ga4-client-configuration.md):** Path activation, script dependency serving, and Client Name triggers.
* **[Conversions API Tag Setup](./04-server-gtm-implementation/conversions-api-tag-setup.md):** Setting up the official `facebookincubator` template, Pixel ID, Access Token, and Test Event Code.
* **[Why `x-fb-cd-*` Format is Required](./04-server-gtm-implementation/x-fb-parameter-mapping-explained.md):** Deep dive into the internal template logic that auto-converts parameters without manual sGTM variables.
* **[Exclude FB Parameters from GA4](./04-server-gtm-implementation/exclude-parameters-from-ga4.md):** Preventing Google Analytics anti-PII violations and parameter pollution.
* **[IPv4 to IPv6 Transformation](./04-server-gtm-implementation/ipv4-to-ipv6-transformation.md):** Converting client IPv4 to IPv6 mapped format for improved server event delivery.

---

### [05. E-commerce Tracking Plans & Testing](./05-ecommerce-tracking-plans)
Platform-specific DataLayer specifications and testing procedures:
* **[WooCommerce DataLayer Spec](./05-ecommerce-tracking-plans/woocommerce-datalayer-spec.md):** Standard WooCommerce and Stape's `_stape` / `cart_state` implementation.
* **[Shopify DataLayer Spec](./05-ecommerce-tracking-plans/shopify-datalayer-spec.md):** Web Pixels API, Customer Privacy, and Checkout Extensibility integration.
* **[Full-Funnel QA & Event Verification Checklist](./05-ecommerce-tracking-plans/full-funnel-event-checklist.md):** Complete checklist for Pixel Helper, Server GTM Preview, and Meta Events Manager Test Events.

---

### [06. Code Snippets & Templates](./06-code-snippets-and-templates)
Copy-paste utilities and troubleshooting references:
* **[Custom JavaScript Variables (`custom-javascript-variables.js`)](./06-code-snippets-and-templates/custom-javascript-variables.js):** Production-ready JavaScript for `event_time`, `content_ids`, `content_name`, `num_items`, and `contents`.
* **[Troubleshooting & Error Catalog](./06-code-snippets-and-templates/troubleshooting-and-error-catalog.md):** Resolution guide for Error 100, Error 190, Error 200, missing `event_id`, low EMQ, and catalog mismatches.

---

## ⚡ Quick Start: 3 Essential Rules for Success
1. **Always Deduplicate:** Fire client Pixel and server CAPI with the **exact same `event_id`** and matching standard event name.
2. **Use First-Party Domain:** Host your server container on a custom subdomain (`ss.yourdomain.com`) to bypass ITP and ad-blockers.
3. **Capture Early Customer Data:** Extract `_fbp`, `_fbc`, and customer emails/phones as early as possible to maximize Event Match Quality (EMQ).
