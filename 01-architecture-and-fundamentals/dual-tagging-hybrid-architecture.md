# Dual-Tagging Hybrid Architecture: Meta Pixel & Conversions API (CAPI)

## 1. Overview & The Need for Hybrid Tracking

Relying exclusively on the client-side Meta Pixel is no longer sufficient due to modern browser privacy restrictions:
* **Apple ITP (Intelligent Tracking Prevention):** Caps client-side cookies set via JavaScript (like `_fbp`) to 7 days or as little as 24 hours.
* **Ad Blockers & Privacy Extensions:** Block standard browser network requests to `connect.facebook.net` and `facebook.com/tr/`, causing an average of 15% to 30% data loss.
* **Network & Device Interruptions:** Slow mobile connections, dropped packets, or immediate tab closure before client scripts execute.

To achieve maximum measurement accuracy, **Meta strongly recommends a redundant/hybrid setup**: sending events simultaneously via the **Browser (Meta Pixel)** and the **Server (Conversions API)**, with unified deduplication.

---

## 2. End-to-End Architecture Flow

```
[ User Browser / Client ]
      │
      ├─── 1. Client-Side Meta Pixel Tag ───────> [ Meta Graph API / Edge ]
      │    (Payload: Event + Event ID + Cookies)         │
      │                                                  │
      └─── 2. Google Tag / GA4 Web Event Tag             │
           (Payload: Event Data + x-fb-* + event_id)     │
                  │                                      │
                  ▼ (HTTPS / Custom Subdomain)           │
       [ Stape.io / Cloud Run sGTM Server ]              │
                  │                                      │
                  ├─ GA4 Client (Parses incoming event)  │
                  │                                      │
                  └─ Facebook CAPI Tag (Conversions API) │
                     (Normalizes & hashes payload)       │
                            │                            │
                            └────────────────────────────┘
                                         │
                                         ▼
                             [ Meta Events Engine ]
                                  (Deduplication)
                             Matches by: event_id + event_name
```

---

## 3. Key Components of the Hybrid Architecture

### A. Web Google Tag Manager (Client-Side)
1. **Meta Pixel Tag:** Fires directly in the visitor's browser. It captures standard events (`PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`) and customer details (if available).
2. **GA4 Web Tag (Transport Layer):** Acts as the transport vehicle. It forwards the identical event data to the server container URL along with dedicated Meta parameters (`x-fb-cd-*`, `x-fb-ck-*`, `x-fb-ud-*`) and the shared `event_id`.

### B. Server Google Tag Manager (Cloud Side)
1. **Custom Domain / First-Party Endpoint:** E.g., `ss.yourdomain.com` mapped to Stape.io or GCP. This allows scripts and requests to run in a first-party context, preventing third-party cookie blocking.
2. **GA4 Client (Data Receiver):** Listens to incoming HTTP requests from the web container, parses the event data, and creates the internal event object.
3. **Facebook Conversions API Tag (by Facebook Incubator or Stape):**
   * Automatically maps incoming GA4 event names to Meta standard events (e.g., `view_item` ➔ `ViewContent`, `purchase` ➔ `Purchase`).
   * Automatically maps `x-fb-cd-*` parameters to `custom_data`.
   * Automatically hashes and structures user parameters (`em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`, `country`, `external_id`).
   * Forwards the payload directly to `https://graph.facebook.com/vXX.X/{PIXEL_ID}/events`.

### C. Meta Events Engine (Ingestion & Deduplication)
* Receives both requests within a rolling 48-hour window.
* When two events arrive with the **identical `event_id` and `event_name`**, Meta processes the first received event and uses the second to enrich attribution and user matching data, discarding duplicate count.

---

## 4. Key Advantages of This Architecture

| Feature | Browser-Only Pixel | Server-Only CAPI | Hybrid Dual-Tagging |
| :--- | :---: | :---: | :---: |
| **Ad Blocker Resilience** | ❌ Blocked | ✅ High | ✅ Maximum |
| **Instant Real-Time Reporting** | ✅ Instant | ⚠️ Slight Lag | ✅ Instant (Browser fast-path) |
| **Click ID (`fbc`) & Browser ID (`fbp`) Capture** | ✅ Native | ⚠️ Requires manual extraction | ✅ Native extraction + Server retention |
| **Data Enrichment (Backend CRM / Offline)** | ❌ No | ✅ Yes | ✅ Full Enrichment |
| **Event Match Quality (EMQ)** | Moderate (4-6/10) | Good (6-7/10) | **Superior (8-9.5/10)** |
| **Meta Recommended** | No | Fallback | **Yes (Gold Standard)** |
