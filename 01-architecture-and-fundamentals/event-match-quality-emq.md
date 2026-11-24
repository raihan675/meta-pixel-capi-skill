# Event Match Quality (EMQ): Optimization & Best Practices

## 1. What is Event Match Quality (EMQ)?

Event Match Quality (EMQ) is a score from **1 to 10** in Meta Events Manager that measures how effectively customer information parameters sent with your server events match to Meta user profiles (Facebook & Instagram accounts).

### Why a High EMQ Score Matters:
* **Lower Cost per Acquisition (CPA):** Accurate matching helps Meta attribute conversions to the exact ads users clicked or viewed.
* **Larger Custom Audiences:** Increases retargeting audience match rates.
* **Better Ad Optimization:** Meta's machine learning engine finds higher-intent users based on verified converters.

---

## 2. Customer Information Parameters Priority Matrix

The more verified parameters sent with an event, the higher the EMQ score:

| Parameter | Meta CAPI Key | Priority | Format / Normalization Requirement |
| :--- | :---: | :---: | :--- |
| **Email Address** | `em` | **Highest** | Lowercase, trim whitespace, SHA-256 hashed. |
| **Phone Number** | `ph` | **High** | E.164 format (with country code, no symbols or leading zeros, e.g., `+15551234567` or `919876543210`), SHA-256 hashed. |
| **External ID** | `external_id` | **High** | Unique customer identifier from database / CRM / Stape cookie. Plaintext or hashed. |
| **Click ID** | `fbc` | **High** | From `_fbc` cookie (e.g. `fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890`). |
| **Browser ID** | `fbp` | **Medium** | From `_fbp` cookie (e.g. `fb.1.1558571057005.1112494888`). |
| **First Name** | `fn` | **Medium** | Lowercase, punctuation removed, SHA-256 hashed. |
| **Last Name** | `ln` | **Medium** | Lowercase, punctuation removed, SHA-256 hashed. |
| **City** | `ct` | **Medium** | Lowercase, spaces/punctuation removed, SHA-256 hashed. |
| **State / Region** | `st` | **Medium** | 2-letter state code (lowercase, e.g. `ca`, `dl`, `wb`), SHA-256 hashed. |
| **Zip / Postal Code**| `zp` | **Medium** | Lowercase, spaces/hyphens removed, SHA-256 hashed. |
| **Country** | `country` | **Medium** | 2-letter lowercase ISO country code (`us`, `in`, `gb`), SHA-256 hashed. |
| **IP Address** | `client_ip_address`| **Medium** | Extracted from HTTP request headers (`X-Forwarded-For`). Not hashed. |
| **User Agent** | `client_user_agent`| **Medium** | Full browser user-agent string. Not hashed. |

---

## 3. How to Achieve an 8.0+ EMQ Score

### 1. Leverage First-Party Cookies (`_fbp` & `_fbc`)
* Extract `_fbp` and `_fbc` in Web GTM using 1st Party Cookie variables.
* Pass them in the GA4 Web tag via:
  * `x-fb-ck-fbp`: `{{DLV - FBP Cookie}}`
  * `x-fb-ck-fbc`: `{{DLV - FBC Cookie}}`
* In Server GTM, the CAPI tag automatically extracts and sends them to Meta.

### 2. Capture Early User Data (Pre-Checkout)
Do not wait for the `Purchase` event to send user data. Extract user information as early as possible:
* When a user is logged in: read from backend user session.
* On form submission / newsletter signup: capture email.
* On Checkout start (`InitiateCheckout`): capture email and phone as soon as typed into input fields.

### 3. Implement Persistent `external_id`
* Assign a persistent ID to users. Stape provides an **External ID generator** that stores a unique identifier in a first-party HTTP cookie for 1–2 years, bridging sessions across time.

### 4. Automatic Hashing in GTM Server Container
* The official Facebook Incubator / Stape Conversions API tag automatically hashes incoming plaintext parameters (`em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`, `country`) using SHA-256 before forwarding to Meta.
* You do not need to pre-hash them in Web GTM if using standard GA4 `user_data` or `x-fb-ud-*` parameters.
