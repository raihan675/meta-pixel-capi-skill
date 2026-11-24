# Google Tag Configuration: Server-Side Transport & Routing

## 1. Role of the Google Tag in Server-Side Tracking

In GTM Server-Side Tagging, the **Google Tag** (which replaces the legacy GA4 Configuration Tag) serves two vital purposes:
1. It initializes Google Analytics 4 tracking.
2. It overrides Google's default collection endpoint, routing all web event traffic to your **GTM Server Container URL** (`server_container_url`).

---

## 2. Google Tag Setup Parameters

### Tag Configuration:
* **Tag Type:** Google Tag
* **Tag ID:** `{{Const - GA4 Measurement ID}}` (e.g. `G-XXXXXXXXXX`)

### Configuration Settings Parameters:
Add the following key-value pairs under **Configuration settings**:

| Parameter Name | Value | Purpose |
| :--- | :--- | :--- |
| `server_container_url` | `{{Const - Server Container URL}}` | Routes requests to `https://ss.yourdomain.com` (or Stape server URL) |
| `send_page_view` | `true` | Automatically sends the `page_view` event to the server |
| `first_party_collection` | `true` | Allows transport of user-provided data parameters |
| `event_id` | `{{Event ID - De duplication}}` | Synchronizes PageView deduplication between Pixel and CAPI |
| `x-fb-ck-fbp` | `{{DLV - FBP Cookie}}` | Transports Meta browser ID cookie `_fbp` |
| `x-fb-ck-fbc` | `{{DLV - FBC Cookie}}` | Transports Meta click ID cookie `_fbc` |
| `event_time` | `{{cJS - FB - Event Time}}` | Transports exact Unix timestamp (seconds) |

### Triggering:
* **Firing Trigger:** `Initialization - All Pages` OR `All Pages` (Page View)

---

## 3. How the Server Container Processes This
When this Google Tag fires on any page:
1. It generates an HTTP POST request to `https://ss.yourdomain.com/g/collect?...`.
2. The **GA4 Client** in Server GTM intercepts the request.
3. The **Conversions API Tag** in Server GTM detects the incoming `page_view` and automatically sends a `PageView` event to Meta Graph API with matching `event_id`, `fbp`, and `fbc`.
