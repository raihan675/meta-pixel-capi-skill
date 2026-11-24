# Client-Side Meta Pixel Tags Configuration

## 1. Overview

While Server-Side CAPI handles the server dispatch, client-side Meta Pixel tags must run in tandem with matching event names, parameters, and deduplication keys.

We use the official **Facebook Pixel Tag Template** (by `facebookarchive` or `stape-io`).

---

## 2. Tag Configuration Matrix

### Tag 1: Meta Pixel - Base (PageView)
* **Tag Type:** Facebook Pixel
* **Pixel ID:** `{{Const - Meta Pixel ID}}`
* **Event Name:** Standard > `PageView`
* **Event ID:** `{{Event ID - De duplication}}`
* **Trigger:** `All Pages`

---

### Tag 2: Meta Pixel - ViewContent
* **Tag Type:** Facebook Pixel
* **Pixel ID:** `{{Const - Meta Pixel ID}}`
* **Event Name:** Standard > `ViewContent`
* **Event ID:** `{{Event ID - De duplication}}`
* **Object Properties:**
  * `content_type`: `product`
  * `content_ids`: `{{cJS - FB - Product ID}}`
  * `content_name`: `{{DLV - Product Name}}`
  * `content_category`: `{{DLV - Product Category}}`
  * `value`: `{{DLV - Product Price}}`
  * `currency`: `{{DLV - Currency}}`
  * `contents`: `{{cJS - FB - View Content - Contents}}`
* **Trigger:** Custom Event > `view_item`

---

### Tag 3: Meta Pixel - AddToCart
* **Tag Type:** Facebook Pixel
* **Pixel ID:** `{{Const - Meta Pixel ID}}`
* **Event Name:** Standard > `AddToCart`
* **Event ID:** `{{Event ID - De duplication}}`
* **Object Properties:**
  * `content_type`: `product`
  * `content_ids`: `{{cJS - FB - Product ID}}`
  * `content_name`: `{{cJS - FB - Product Name}}`
  * `content_category`: `{{cJS - FB - Product Category}}`
  * `value`: `{{DLV - Value}}`
  * `currency`: `{{DLV - Currency}}`
  * `contents`: `{{cJS - FB - Contents}}`
* **Trigger:** Custom Event > `add_to_cart`

---

### Tag 4: Meta Pixel - InitiateCheckout
* **Tag Type:** Facebook Pixel
* **Pixel ID:** `{{Const - Meta Pixel ID}}`
* **Event Name:** Standard > `InitiateCheckout`
* **Event ID:** `{{Event ID - De duplication}}`
* **Object Properties:**
  * `content_ids`: `{{cJS - FB - Product ID}}`
  * `content_category`: `{{cJS - FB - Product Category}}`
  * `contents`: `{{DLV - Items}}` (or `{{cJS - FB - Contents}}`)
  * `currency`: `{{DLV - Currency}}`
  * `num_items`: `{{cJS - FB - Num of Items}}`
  * `value`: `{{DLV - Value}}`
* **Trigger:** Custom Event > `begin_checkout`

---

### Tag 5: Meta Pixel - Purchase
* **Tag Type:** Facebook Pixel
* **Pixel ID:** `{{Const - Meta Pixel ID}}`
* **Event Name:** Standard > `Purchase`
* **Event ID:** `{{Event ID - De duplication}}`
* **Enable Advanced Matching:** Checked
  * Customer Information Data Parameters:
    * `Email`: `{{DLV - Customer Email}}`
    * `Phone`: `{{DLV - Customer Phone}}`
    * `First Name`: `{{DLV - Customer First Name}}`
    * `Last Name`: `{{DLV - Customer Last Name}}`
    * `City`: `{{DLV - Customer City}}`
    * `State`: `{{DLV - Customer State}}`
    * `Zip Code`: `{{DLV - Customer Postcode}}`
    * `Country`: `{{DLV - Customer Country}}`
* **Object Properties:**
  * `content_type`: `product`
  * `content_ids`: `{{cJS - FB - Product ID}}`
  * `content_name`: `{{cJS - FB - Product Name}}`
  * `content_category`: `{{cJS - FB - Product Category}}`
  * `contents`: `{{DLV - Items}}` (or `{{cJS - FB - Contents}}`)
  * `num_items`: `{{cJS - FB - Num of Items}}`
  * `value`: `{{DLV - Value}}`
  * `currency`: `{{DLV - Currency}}`
  * `order_id`: `{{DLV - Transaction ID}}`
* **Trigger:** Custom Event > `purchase`
