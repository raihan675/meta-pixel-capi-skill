# Meta Click ID (`fbc`) & Browser ID (`fbp`) Handling

## 1. Understanding `_fbp` (Browser ID)

* **What it is:** A cookie created automatically by the Meta Pixel in the browser or set by the server container via HTTP header (`Set-Cookie`).
* **Format:** `fb.1.<creation_timestamp>.<random_number>`
  * Example: `fb.1.1711823767480.1234567890`
  * `fb`: Subdomain index version.
  * `1`: Version number.
  * `<creation_timestamp>`: Unix epoch timestamp in milliseconds when the cookie was created.
  * `<random_number>`: Random integer generated to uniquely identify the browser.
* **Lifespan:** Up to 90 days (if set via first-party server-side `Set-Cookie` header), but capped to 7 days by Apple Safari ITP when set via client JavaScript `document.cookie`.

---

## 2. Understanding `_fbc` (Click ID)

* **What it is:** When a user clicks an ad on Facebook/Instagram, Meta appends a query parameter to the landing page URL: `?fbclid=IwAR...`.
* The Meta Pixel or Server Container parses `fbclid` and writes the `_fbc` cookie.
* **Format:** `fb.1.<creation_timestamp>.<fbclid>`
  * Example: `fb.1.1554763741205.IwAR1K8HF4y6kkSOSFiQyNf-a4oig92kSXGjkhA-f4DqEYpeo0NbVtHSbxxAs`
* **Lifespan:** 90 days from the click date.

---

## 3. How to Extract and Forward `_fbp` and `_fbc` in GTM

### Step 1: Create 1st Party Cookie Variables in Web GTM
1. **Variable 1:**
   * **Name:** `{{DLV - FBP Cookie}}`
   * **Type:** `1st Party Cookie`
   * **Cookie Name:** `_fbp`
2. **Variable 2:**
   * **Name:** `{{DLV - FBC Cookie}}`
   * **Type:** `1st Party Cookie`
   * **Cookie Name:** `_fbc`

### Step 2: Forward to Server Container via GA4 Tags
In all GA4 Web Tags (Google Tag and GA4 Event Tags), include:
* **Parameter Name:** `x-fb-ck-fbp` | **Value:** `{{DLV - FBP Cookie}}`
* **Parameter Name:** `x-fb-ck-fbc` | **Value:** `{{DLV - FBC Cookie}}`

### Step 3: Server-Side Processing
The Facebook Conversions API Tag in Server GTM detects `x-fb-ck-fbp` and `x-fb-ck-fbc` in the incoming payload and maps them directly to `fbp` and `fbc` in the CAPI payload.

---

## 4. Server-Side Cookie Extension via Custom Domain

In the GTM Server Container:
* Under the **Conversions API Tag** settings:
  * Check **"Extend Meta Pixel cookies (fbp/fbc)"**.
* When enabled and running on a custom domain (e.g., `ss.yourdomain.com`), the server returns `Set-Cookie: _fbp=...; SameSite=Lax; HttpOnly=false` headers.
* Because the cookie is set by an `A`/`CNAME` record matching the parent domain, **Apple ITP restrictions are mitigated**, preserving accurate 90-day ad attribution.
