# WooCommerce DataLayer Specification for Meta Pixel & CAPI

## 1. Standard WooCommerce GA4 DataLayer Events

For standard WooCommerce tracking (via official plugins or custom snippets), events follow the GA4 e-commerce standard:

| User Action | DataLayer Event | Primary Payload Keys |
| :--- | :--- | :--- |
| **Product Detail View** | `view_item` | `ecommerce.currency`, `ecommerce.value`, `ecommerce.items` |
| **Add to Cart (AJAX/Page)** | `add_to_cart` | `ecommerce.currency`, `ecommerce.value`, `ecommerce.items` |
| **Remove from Cart** | `remove_from_cart` | `ecommerce.currency`, `ecommerce.value`, `ecommerce.items` |
| **View Cart Page** | `view_cart` | `ecommerce.currency`, `ecommerce.value`, `ecommerce.items` |
| **Checkout Page Load** | `begin_checkout` | `ecommerce.currency`, `ecommerce.value`, `ecommerce.items` |
| **Order Placed (Thank You)**| `purchase` | `ecommerce.transaction_id`, `ecommerce.value`, `ecommerce.tax`, `ecommerce.shipping`, `ecommerce.currency`, `ecommerce.items`, `customerBilling*` |

---

## 2. Stape GTM Server-Side WooCommerce Plugin Specification

As audited on production stores running the Stape WooCommerce GTM plugin (such as [Maindish.in](https://maindish.in/)):

### Key Characteristics:
* **Custom Event Name Suffix:** `is_custom_event_name: "yes"` appends `_stape` to standard event names:
  * `view_item_stape`
  * `add_to_cart_stape`
  * `remove_from_cart_stape`
  * `view_cart_stape`
  * `begin_checkout_stape`
  * `purchase_stape`
* **Real-Time `cart_state` Object:** Includes server-side verified cart contents:
  ```json
  "cart_state": {
    "cart_id": "e14d4b64-4a8c-413b-acba-b377fadd0b02",
    "cart_quantity": 3,
    "cart_value": "2714",
    "currency": "INR",
    "lines": [
      {
        "item_id": "80406",
        "item_name": "150g Salmon & 100g Green Tobikko Combo",
        "quantity": 3,
        "line_total_price": "2714",
        "price": "950"
      }
    ]
  }
  ```
* **Store API & AJAX Observers:** Watches WooCommerce Store API (`/wc/store/cart/update-item`, `/wc/store/cart/remove-item`) and AJAX endpoints (`wc-ajax=add_to_cart`) to automatically trigger events with no DOM scraping.

---

## 3. Trigger Adaptation for Stape Custom Suffix

If tracking a WooCommerce site using Stape's `_stape` suffix, update your Web GTM Custom Event triggers to support both standard and `_stape` events using Regex:

| Event | Trigger Event Name (Regex) |
| :--- | :--- |
| **View Item** | `^(view_item\|view_item_stape)$` |
| **Add to Cart** | `^(add_to_cart\|add_to_cart_stape)$` |
| **View Cart** | `^(view_cart\|view_cart_stape)$` |
| **Begin Checkout** | `^(begin_checkout\|begin_checkout_stape)$` |
| **Purchase** | `^(purchase\|purchase_stape)$` |
