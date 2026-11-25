# Customer Information Parameters (`user_data`)

## 1. Overview & Automatic Server-Side Hashing

Meta requires customer information parameters to be normalized and SHA-256 hashed before processing (except IP address and User Agent).
When utilizing **Server GTM with the Facebook Conversions API Tag**, the tag handles:
1. Normalization (trimming whitespace, converting to lowercase).
2. SHA-256 hashing.
3. Formatting according to Meta API specifications.

---

## 2. Parameter Mapping Reference

| Customer Data Field | Meta Key | GA4 Web Tag Parameter | Accepted Formats & Normalization |
| :--- | :---: | :--- | :--- |
| **Email** | `em` | `user_data.email_address` | Lowercase, whitespace trimmed. Plaintext or pre-hashed SHA-256. |
| **Phone** | `ph` | `user_data.phone_number` | E.164 standard without spaces/hyphens (e.g. `+15551234567` or `919876543210`). |
| **First Name** | `fn` | `user_data.address.first_name` | Lowercase letters only, special characters removed. |
| **Last Name** | `ln` | `user_data.address.last_name` | Lowercase letters only, special characters removed. |
| **Street** | *(address)* | `user_data.address.street` | Street and number for the address of the user (`123 Fake St`). |
| **City** | `ct` | `user_data.address.city` | Lowercase, all spaces removed (e.g. `newyork`, `kolkata`). |
| **State / Region** | `st` | `user_data.address.region` | 2-letter lowercase code (e.g. `ca`, `ny`, `dl`, `wb`). |
| **Zip / Postcode** | `zp` | `user_data.address.postal_code`| Trimmed, lowercase, space removed (e.g. `90210`, `700001`). |
| **Country** | `country` | `user_data.address.country` | 2-letter lowercase ISO 3166-1 alpha-2 (e.g. `us`, `in`, `ca`). |
| **External ID** | `external_id` | `x-fb-ud-external_id` | Unique CRM user ID, database user ID, or persistent Stape cookie. |
| **Gender** | `ge` | `x-fb-ud-ge` | Single letter: `'m'` (male) or `'f'` (female). |
| **Date of Birth** | `db` | `x-fb-ud-db` | `YYYYMMDD` format (e.g. `19900524`). |
| **Facebook Login ID**| `fb_login_id` | `user_data.fb_login_id` | Numeric Facebook user ID when Facebook Login is used. |

---

## 3. Web Tag Customer Data Configuration

In Web GTM, inside your GA4 Event Tag (e.g. for `purchase` or `sign_up`), configure:
* **`first_party_collection`**: `true` (Enables the collection of user-provided data).
* Under **Event Parameters**:
  * `user_data.email_address`: `{{DLV - Customer Email}}`
  * `user_data.phone_number`: `{{DLV - Customer Phone}}`
  * `user_data.address.first_name`: `{{DLV - Customer First Name}}`
  * `user_data.address.last_name`: `{{DLV - Customer Last Name}}`
  * `user_data.address.street`: `{{DLV - Customer Street}}`
  * `user_data.address.city`: `{{DLV - Customer City}}`
  * `user_data.address.region`: `{{DLV - Customer State}}`
  * `user_data.address.postal_code`: `{{DLV - Customer Postcode}}`
  * `user_data.address.country`: `{{DLV - Customer Country}}`
  * `user_id`: `{{DLV - Customer ID}}`
  * `x-fb-ud-external_id`: `{{DLV - Customer ID}}`

> **Reference:** [Google sGTM Common Event Data](https://developers.google.com/tag-platform/tag-manager/server-side/common-event-data) (Pre-hashed `user_data.sha256_email_address`, `user_data.sha256_phone_number`, `user_data.address.sha256_first_name`, and `user_data.address.sha256_last_name` are also supported.)
