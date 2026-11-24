# Exclude Facebook Parameters from GA4 Server-Side Tags

## 1. Why Exclude Facebook Parameters from GA4?

When you add `x-fb-cd-*`, `x-fb-ck-*`, `event_id`, and `user_data.*` to your GA4 Web Tags, the GA4 Client receives all of these parameters in the Server Container.

If you have a downstream **Google Analytics 4 Tag** in Server GTM that forwards events to Google's servers (`google-analytics.com`), you **must exclude these Facebook-specific parameters and Personally Identifiable Information (PII)**:
1. **Google Terms of Service Violation:** Sending unhashed PII (like email, phone, physical address) directly into GA4 standard dimensions violates Google's anti-PII policies and can result in account suspension.
2. **Quota & Dimension Pollution:** Prevents cluttering GA4 event parameter limits with vendor-specific `x-fb-` parameters.

---

## 2. Configuration Steps in Server GTM

1. In Server GTM, open your **Google Analytics 4** server-side tag.
2. Under **Event Parameters**, find **Parameters to Exclude**.
3. Add the following parameter names to exclude:

```
event_id
x-fb-ck-fbp
x-fb-ck-fbc
first_party_collection
x-fb-cd-content_type
x-fb-cd-content_name
x-fb-cd-content_ids
x-fb-cd-content_category
x-fb-cd-num_items
event_time
user_data.email_address
user_data.phone_number
user_data.address.first_name
user_data.address.last_name
user_data.address.city
user_data.address.region
user_data.address.postal_code
user_data.address.country
x-fb-ud-external_id
```

4. Save and publish the Server Container.

---

## 3. Result
* **Facebook CAPI Tag:** Receives all Meta parameters and customer data.
* **GA4 Tag:** Receives only standard GA4 ecommerce metrics (`items`, `value`, `currency`, `transaction_id`), keeping your Google Analytics clean and strictly compliant.
