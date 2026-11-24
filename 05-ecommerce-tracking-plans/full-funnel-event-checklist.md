# Full-Funnel QA & Event Verification Checklist

Before publishing your GTM Web & Server containers to production, execute this complete QA audit:

---

## 1. Client-Side (Meta Pixel Helper Extension)

| Funnel Step | Expected Event | Check Parameters in Pixel Helper |
| :--- | :--- | :--- |
| **Homepage** | `PageView` | Event ID present, 1 Pixel detected, no warnings. |
| **Category Page** | `PageView` | Event ID present. |
| **Product Detail** | `ViewContent` | `content_type: 'product'`, `content_ids` matches product SKU/ID, `value`, `currency`, matching `event_id`. |
| **Add to Cart** | `AddToCart` | `content_type: 'product'`, `content_ids`, `value`, `currency`, matching `event_id`. |
| **Cart Page** | `PageView` | Verified. |
| **Checkout Page**| `InitiateCheckout`| `content_ids`, `num_items`, `value`, `currency`, matching `event_id`. |
| **Order Completed**| `Purchase` | `order_id`, `value`, `currency`, `contents`, `num_items`, Advanced Matching parameters populated (Email, Phone, Name, City, etc.). |

---

## 2. Server-Side (Server GTM Preview & Stape Logs)

| Verification Item | What to Check | Expected Result |
| :--- | :--- | :--- |
| **Request Ingestion** | Incoming request to `/g/collect` in Server GTM Preview | Claimed by `GA4 Client` (Status 200). |
| **Event Name Mapping** | Check outgoing event name from CAPI tag | `view_item` converted to `ViewContent`, `purchase` to `Purchase`. |
| **Custom Data (`x-fb-cd-*`)** | Check `custom_data` object in outgoing HTTP request | All `x-fb-cd-*` converted into clean Meta keys (`content_ids`, `content_type`, etc.). |
| **User Data Normalization** | Check `user_data` object in outgoing CAPI request | Emails and phone numbers are SHA-256 hashed. |
| **Cookie Extension** | Check response headers from sGTM custom domain | `Set-Cookie: _fbp=...` and `Set-Cookie: _fbc=...` returned in first-party context. |
| **GA4 Tag Exclusion** | Check outgoing request to Google Analytics | Unhashed PII and `x-fb-*` parameters are completely omitted. |

---

## 3. Meta Events Manager (Test Events Tab)

1. Input your `Test Event Code` into Server GTM Conversions API tag.
2. Clear browser cookies / open an incognito window.
3. Perform a test purchase from homepage to order confirmation.
4. **Inspect Test Events Stream:**
   - [ ] Every event (`PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`) appears with two entries:
     - **Browser:** `Processed`
     - **Server:** `Deduplicated`
   - [ ] Event IDs between Browser and Server match character-for-character.
   - [ ] Event Match Quality (EMQ) displays a score of **7.5 or higher** (ideally 8.0–9.5 for `Purchase`).
   - [ ] Catalog diagnostics show 0 missing `content_ids`.
