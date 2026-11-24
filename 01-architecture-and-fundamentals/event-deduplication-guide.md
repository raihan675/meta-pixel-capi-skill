# Event Deduplication Guide: Meta Pixel & Conversions API

## 1. Why Deduplication is Mandatory
In a hybrid dual-tagging setup, Meta receives two signals for the same customer interaction:
1. One from the browser via the Meta Pixel JavaScript library.
2. One from the server via Conversions API (CAPI).

If deduplication is misconfigured or missing, **Meta will record two conversions instead of one**. This results in:
* Artificially inflated conversion numbers.
* Inaccurate ROAS and CPA calculations in Meta Ads Manager.
* Bidding algorithms optimizing against duplicate, phantom signals.

---

## 2. Meta Deduplication Requirements

Meta's deduplication algorithm relies on two essential keys:
1. **`event_id`**: A unique string generated for each individual user action (e.g., `1711823767480.663219.179`). Both browser tag and server tag must send the **exact same `event_id`**.
2. **`event_name`**: The event type must match (e.g., both must resolve to `Purchase` / `Purchase`, `ViewContent` / `ViewContent`).

> [!IMPORTANT]
> **48-Hour Deduplication Window:** Meta keeps received `event_id`s in memory for up to 48 hours. If the browser event and server event arrive within this window with matching `event_id` and `event_name`, Meta will deduplicate them automatically.

---

## 3. How to Generate `event_id` in Google Tag Manager

### Method 1: Stape's Unique Event ID Variable Template (Recommended)
1. In Web GTM, navigate to **Templates** > **Variable Templates** > **Search Gallery**.
2. Search for **Unique Event ID** by **stape-io** and add it to the workspace.
3. Create a new User-Defined Variable:
   * **Name:** `{{Event ID - De duplication}}`
   * **Type:** `Unique Event ID`
4. This variable generates a unique identifier tied to the specific GTM event instance, ensuring all tags firing on that exact GTM event inherit the identical ID.

### Method 2: Custom JavaScript Epoch + Random Generator
If you prefer not to use a community template, use this Custom JavaScript variable:
```javascript
function() {
  return new Date().getTime() + '.' + Math.floor(Math.random() * 1000000000);
}
```
*Note: Stape's Unique Event ID template is preferred because it caches the value per GTM event loop execution.*

---

## 4. Passing `event_id` into Tags

### In Web GTM:
1. **Facebook Pixel Tag:**
   * Open the Facebook Pixel Tag (by `facebookarchive` or `stape-io`).
   * Under **Event ID**, input: `{{Event ID - De duplication}}`.
2. **GA4 Event Tag (Transport to Server):**
   * Under **Event Parameters**, add:
     * **Parameter Name:** `event_id`
     * **Value:** `{{Event ID - De duplication}}`

### In Server GTM:
* The **Conversions API Tag** (by `facebookincubator` or `stape-io`) automatically reads `event_id` from the incoming GA4 Event Data (`event_id` field or event parameter) and assigns it to Meta's `event_id` field.

---

## 5. Verification & Testing in Meta Events Manager

To verify deduplication:
1. In **Meta Events Manager**, select your Pixel / Dataset.
2. Go to the **Test Events** tab.
3. Open your website in GTM Preview mode and trigger an event (e.g., `ViewContent` or `Purchase`).
4. Watch the Test Events window:
   * You should see two lines for the event:
     * One from **Browser** (`Processed`).
     * One from **Server** (`Deduplicated`).
   * Clicking on either reveals the identical **Event ID**.

```
Events Received                     Received From       Setup Method
────────────────────────────────────────────────────────────────────────
Purchase   [Processed]              Browser             Partner integration
 │
 ├── Purchase  [Processed]          Browser             Partner integration
 └── Purchase  [Deduplicated ℹ]     Server              Manual Setup
```
*(As seen in the official setup test output on page 60–62 of the setup guide).*
