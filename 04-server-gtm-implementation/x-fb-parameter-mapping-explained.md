# Why the `x-fb-cd-*` Parameter Format is Required

## 1. The Engineering Reason Behind `x-fb-` Prefixes

When routing tracking through Server GTM via GA4, standard GA4 event parameters (like `value`, `currency`, `items`) are designed for Google Analytics.

However, Meta Conversions API requires specific fields under `custom_data` (such as `content_type`, `content_ids`, `content_name`, `content_category`, `num_items`).

The **Facebook Conversions API Template by facebookincubator** was specifically programmed with built-in regex parsers that scan incoming Event Data for:
1. **`x-fb-cd-*`**: Converted to Meta **Custom Data** (`custom_data`).
2. **`x-fb-ck-*`**: Converted to Meta **Cookies** (`fbp` and `fbc`).
3. **`x-fb-ud-*`**: Converted to Meta **User Data** (`user_data`).

---

## 2. Source Code Snippet from the Facebook Template

Inside the sandboxed JavaScript of the official Facebook CAPI tag template:

```javascript
// Sandboxed JavaScript inside facebookincubator template:
event_data.custom_data.content_category = eventModel['x-fb-cd-content_category'];
event_data.custom_data.content_ids      = eventModel['x-fb-cd-content_ids'];
event_data.custom_data.content_name     = eventModel['x-fb-cd-content_name'];
event_data.custom_data.content_type     = eventModel['x-fb-cd-content_type'];
event_data.custom_data.num_items        = eventModel['x-fb-cd-num_items'];
event_data.custom_data.predicted_ltv    = eventModel['x-fb-cd-predicted_ltv'];
event_data.custom_data.delivery_category = eventModel['x-fb-cd-delivery_category'];

// Cookie parameters:
event_data.user_data.fbp = eventModel['x-fb-ck-fbp'] || getCookieValues('_fbp', true)[0];
event_data.user_data.fbc = eventModel['x-fb-ck-fbc'] || getCookieValues('_fbc', true)[0];

// User parameters:
event_data.user_data.external_id = eventModel['x-fb-ud-external_id'];
```

---

## 3. Practical Summary

By naming your GA4 Web Tag event parameters with the `x-fb-cd-` prefix in Web GTM:
* You **never need to create individual Server-Side variables or manual tag overrides** in Server GTM.
* The CAPI tag extracts, formats, and transmits them to Meta automatically.
* GA4 standard parameters (`items`, `value`, `currency`, `transaction_id`) continue to pass seamlessly.
