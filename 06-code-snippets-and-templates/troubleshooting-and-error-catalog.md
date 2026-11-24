# Meta Conversions API (CAPI) Error Catalog & Troubleshooting

## 1. Top Meta CAPI Errors & Solutions

| Error Code / Name | Meaning | Root Cause | Solution |
| :--- | :--- | :--- | :--- |
| **Error 100: Invalid Parameter** | Meta rejected one or more parameters in the payload. | Value is formatted improperly (e.g. currency not 3-letter ISO, or value formatted with commas/currency symbols like `$20.00`). | Ensure `value` is a numeric float (`20.00`), `currency` is ISO-4217 (`USD`), and `contents` is an array of objects. |
| **Error 190: Invalid OAuth Access Token** | Access Token expired, revoked, or invalid. | The generated token in Events Manager was revoked or expired. | Go to **Events Manager** > **Settings** > **Generate access token**, and replace the token in Server GTM. |
| **Error 200: Permissions Error** | Account lacks permission to send events to this Pixel/Dataset. | Access token was created by a user without "Manage Pixel" admin permissions. | Ensure the System User in Meta Business Manager has full Admin control on the Dataset/Pixel. |
| **Missing `event_id` Warning** | Deduplication warning in Events Manager Diagnostics. | The browser Pixel sent the event with an `event_id`, but the server did not (or vice versa). | Ensure `event_id` is passed identically in both the Web Pixel tag and the GA4 tag (`event_id: {{Event ID - De duplication}}`). |
| **Duplicate Events Not Deduplicating** | Events Manager counts conversions twice. | `event_name` mismatch (e.g., Browser sent `Purchase`, Server sent `purchase`), or `event_id` values differed between browser and server. | In Server GTM, ensure the CAPI tag maps `purchase` to `Purchase` and passes the identical `event_id`. |
| **Low Event Match Quality (< 4.0)** | Server events are not matching users. | No customer data (`em`, `ph`, `fbp`, `fbc`) is being sent with the server event. | Ensure `x-fb-ck-fbp`, `x-fb-ck-fbc`, and customer information parameters are collected on checkout and purchase events. |
| **Catalog Mismatch (0% Matched)** | Advantage+ Dynamic Ads cannot find products. | `content_ids` in the event does not match the `id` or `retailer_id` in the Meta Product Catalog feed. | Check whether your catalog uses parent IDs or variant SKUs. Adjust `{{cJS - FB - Product ID}}` accordingly. |
| **`event_time` Older than 7 Days** | Event timestamp out of acceptable bounds. | Timestamp passed in milliseconds instead of seconds, or event was sent too late. | Meta CAPI requires Unix epoch time in **seconds** (`Math.round(Date.now() / 1000)`), within the last 7 days. |

---

## 2. Common Debugging Steps in Server GTM Preview

If events are not showing in Meta Events Manager Test Events:
1. **Check Server GTM Preview:**
   - Did the `GA4 Client` claim the incoming request (`Status 200`)?
   - If not, verify that `server_container_url` in the Web Google Tag matches your server URL exactly.
2. **Check the Conversions API Tag:**
   - Did the tag fire on the event?
   - If not, verify that the trigger condition (`Client Name equals GA4` AND `Event Name matches regex`) matches the incoming event name.
3. **Inspect the Outgoing HTTP Request:**
   - Click on the CAPI Tag in Server GTM Preview > **Outgoing HTTP Requests**.
   - Check the Response Code:
     * `200 OK`: Meta accepted the event.
     * `400 Bad Request`: Click on the response body to read Meta's exact error message (e.g., invalid parameter or expired token).
