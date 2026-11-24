# Custom Data Parameters (`custom_data`) for Meta Pixel & CAPI

## 1. Overview

In Meta Pixel and CAPI, event-specific details (product IDs, pricing, currency, categories) are passed under `custom_data`.
When using the GA4 Web Tag to send data to a GTM Server Container, the **Facebook Conversions API Tag (by Facebook Incubator)** converts specific prefixed parameters (`x-fb-cd-*`) and standard GA4 parameters directly into Meta `custom_data`.

---

## 2. Parameter Conversion Reference Table

| Meta CAPI `custom_data` Key | GA4 Web Tag Event Parameter | Format / Example | Description |
| :--- | :--- | :--- | :--- |
| `value` | `value` | `2850.00` (Number / Float) | Total monetary value of the event. |
| `currency` | `currency` | `"USD"` or `"INR"` (3-letter ISO-4217) | Currency of the monetary value. |
| `content_type` | `x-fb-cd-content_type` | `"product"` or `"product_group"` | Must match your Meta Product Catalog format. |
| `content_ids` | `x-fb-cd-content_ids` | `["80406"]` or `["80406", "80407"]` | Unique product identifier(s) (SKU or Product ID). |
| `content_name` | `x-fb-cd-content_name` | `"150g Salmon Combo"` | Product name(s). |
| `content_category` | `x-fb-cd-content_category`| `"Deals & Offers"` | Category hierarchy. |
| `contents` | `items` OR `x-fb-cd-contents` | Array of objects: `[{"id":"80406","quantity":1,"item_price":950}]` | Detailed line items for the event. |
| `num_items` | `x-fb-cd-num_items` | `3` (Integer) | Total item quantity in checkout or cart. |
| `order_id` | `transaction_id` | `"80499"` (String) | Unique order identifier for `Purchase`. |
| `search_string` | `search_term` | `"salmon"` (String) | Query term for `Search` events. |
| `delivery_category`| `x-fb-cd-delivery_category`| `"in_store"`, `"curbside"`, `"home_delivery"` | Delivery fulfillment type. |

---

## 3. Advantage+ Catalog Ads Matching Requirements

For Meta Dynamic Ads / Advantage+ Catalog Ads to function properly:
1. **`content_ids`** MUST match the `id` or `retailer_id` in your uploaded Meta Product Catalog feed.
2. If your catalog uses simple item IDs (e.g. `80406`), `content_ids` must be `['80406']`.
3. If your catalog uses variant SKUs (e.g. `SALMON-150G-GRN`), `content_ids` must pass the variant SKU.
4. **`content_type`** should be set to:
   * `'product'` when single item IDs or variant IDs are passed.
   * `'product_group'` if parent IDs are passed.
