# Shopify DataLayer Specification: Web Pixels API & CAPI

## 1. Modern Shopify Tracking Landscape

Shopify's modern checkout (Checkout Extensibility) runs in an isolated sandbox. Traditional `theme.liquid` script additions cannot access checkout or order status pages on Shopify Plus and non-Plus stores migrating from `additional_scripts`.

To implement Meta Pixel & CAPI on modern Shopify:
1. **Web Pixels API (Custom Pixel):** Runs in Shopify's Web Worker sandbox, subscribing to standard analytics events (`product_viewed`, `product_added_to_cart`, `checkout_started`, `checkout_completed`).
2. **GTM Web Container:** Injected into `theme.liquid` for storefront pages, and a Customer Pixel sandbox script that translates Shopify events into `dataLayer.push` calls.

---

## 2. Shopify Event to GA4 / Meta Event Mapping

| Shopify Event (Web Pixels API) | GA4 DataLayer Event | Meta Standard Event |
| :--- | :--- | :--- |
| `page_viewed` | `page_view` | `PageView` |
| `search_submitted` | `search` | `Search` |
| `product_viewed` | `view_item` | `ViewContent` |
| `product_added_to_cart` | `add_to_cart` | `AddToCart` |
| `checkout_started` | `begin_checkout` | `InitiateCheckout` |
| `payment_info_submitted` | `add_payment_info` | `AddPaymentInfo` |
| `checkout_completed` | `purchase` | `Purchase` |

---

## 3. Web Pixel Customer Data Extraction

On `checkout_completed`, Shopify's event payload provides authoritative customer billing information:
* `event.data.checkout.email` ➔ `user_data.email_address`
* `event.data.checkout.phone` ➔ `user_data.phone_number`
* `event.data.checkout.billingAddress.firstName` ➔ `user_data.address.first_name`
* `event.data.checkout.billingAddress.lastName` ➔ `user_data.address.last_name`
* `event.data.checkout.billingAddress.city` ➔ `user_data.address.city`
* `event.data.checkout.billingAddress.provinceCode` ➔ `user_data.address.region`
* `event.data.checkout.billingAddress.zip` ➔ `user_data.address.postal_code`
* `event.data.checkout.billingAddress.countryCode` ➔ `user_data.address.country`
* `event.data.checkout.order.id` ➔ `ecommerce.transaction_id` / `order_id`
