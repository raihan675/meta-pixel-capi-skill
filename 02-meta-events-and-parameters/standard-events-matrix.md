# Meta Standard Events & GA4 Event Mapping Matrix

## 1. Complete Event Cross-Reference

When setting up Meta Conversions API via GA4 Web Tag transport to a GTM Server Container, standard GA4 event names are converted by the Facebook CAPI tag into Meta Standard Events:

| Funnel Stage | Meta Standard Event Name | GA4 Event Name (`event_name`) | Typical Trigger Context |
| :--- | :--- | :--- | :--- |
| **All Pages** | `PageView` | `page_view` (or `gtm.dom`) | Fires on every page load |
| **Catalog / Search** | `Search` | `search` | Search query executed |
| **Product Detail** | `ViewContent` | `view_item` | Single product detail page loaded |
| **Wishlist** | `AddToWishlist` | `add_to_wishlist` | Visitor adds item to wishlist |
| **Add to Cart** | `AddToCart` | `add_to_cart` | Product added to basket (AJAX or reload) |
| **Checkout Start** | `InitiateCheckout` | `begin_checkout` | Checkout page loaded / "Proceed to checkout" |
| **Payment Info** | `AddPaymentInfo` | `add_payment_info` | Payment method submitted or selected |
| **Conversion / Order**| `Purchase` | `purchase` | Order confirmation / "Thank you" page |
| **Lead / Form** | `Lead` | `generate_lead` | Contact form or quote request submitted |
| **Account Creation** | `CompleteRegistration` | `sign_up` | Customer registers a new account |

---

## 2. Server Tag Regex Trigger Configuration

In GTM Server Container, when configuring the Conversions API Tag, create a single custom event trigger to fire across all required conversion events:

### Trigger Settings:
* **Trigger Type:** Custom Event
* **This trigger fires on:** Some Events
* **Condition:**
  * `Event Name` matches RegEx (ignore case):
  ```regex
  ^(page_view|view_item|add_to_cart|begin_checkout|add_payment_info|purchase|search|generate_lead|sign_up)$
  ```
  * AND `Client Name` equals `GA4`

> [!TIP]
> Using the regex anchors `^` and `$` prevents unintentional firing on partial string matches like `page_view_custom` or `add_to_cart_button_click`.
