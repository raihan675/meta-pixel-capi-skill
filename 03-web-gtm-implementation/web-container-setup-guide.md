# Web GTM Container: Complete Setup Guide

## 1. Overview

This guide details the step-by-step setup in the **Web Google Tag Manager (GTM) Container** for firing the client-side Meta Pixel and simultaneously routing verified data to your GTM Server Container for Conversions API (CAPI).

---

## 2. Implementation Checklist

- [ ] **Step 1:** Create GTM Web Container (`Domain - Web`) at [tagmanager.google.com](https://tagmanager.google.com).
- [ ] **Step 2:** Place GTM code immediately after `<head>` and `<body>` on your website.
- [ ] **Step 3:** Create Constants:
  - `{{Const - Meta Pixel ID}}`: Your Meta Pixel / Dataset ID.
  - `{{Const - GA4 Measurement ID}}`: Your GA4 ID (`G-XXXXXXXXXX`).
  - `{{Const - Server Container URL}}`: Your tagging server endpoint (e.g. `https://ss.yourdomain.com`).
- [ ] **Step 4:** Import Community Templates:
  - **Facebook Pixel** (by `facebookarchive` or `stape-io`)
  - **Unique Event ID** (by `stape-io`)
- [ ] **Step 5:** Create Variables:
  - `{{Event ID - De duplication}}` (Type: Unique Event ID)
  - `{{DLV - FBP Cookie}}` (Type: 1st Party Cookie `_fbp`)
  - `{{DLV - FBC Cookie}}` (Type: 1st Party Cookie `_fbc`)
  - `{{cJS - FB - Event Time}}` (Unix timestamp in seconds)
  - DataLayer variables for items, currency, value, and customer fields.
  - Custom JavaScript variables for product IDs, names, categories, and item counts.
- [ ] **Step 6:** Configure Triggers:
  - `All Pages` (Page View)
  - `view_item` (Custom Event)
  - `add_to_cart` (Custom Event)
  - `begin_checkout` (Custom Event)
  - `purchase` (Custom Event)
- [ ] **Step 7:** Configure Tags:
  - Client-side Meta Pixel Tags (Base `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`).
  - GA4 Transport Tags (Google Tag config + GA4 Event Tags with `x-fb-*` parameters).
- [ ] **Step 8:** Test in GTM Preview Mode + Meta Pixel Helper.

---

## 3. High-Priority Settings

> [!IMPORTANT]
> **Tag Firing Options:**
> For `view_item` and other catalog events that might re-render, set Tag Firing Options to:
> * **Once per event:** Default for user-initiated actions (`AddToCart`, `InitiateCheckout`).
> * **Once per page:** Use if your CMS or single-page application re-pushes `view_item` multiple times during page render to avoid duplicate client requests.
