# Playbook 1: Meta Pixel Browser-Side Setup Guide (Web GTM)

A comprehensive, production-grade implementation playbook for deploying the Meta (Facebook) Pixel via Web Google Tag Manager. This guide covers everything from container configuration, variable architecture, base PageView tracking, full ecommerce funnel events (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`), to Advanced Matching and QA verification.

---

## 1. Prerequisites & Account Setup

### Step 1.1: Meta Events Manager Preparation
1. Log in to [Meta Business Manager](https://business.facebook.com/).
2. Navigate to **Events Manager** > **Data Sources**.
3. Locate or create your **Dataset / Pixel**:
   * If new, click **Connect Data** > **Web** > Name your Dataset (e.g., `Brand Name - Web Dataset`).
4. Copy your **15–16 digit Dataset/Pixel ID** (e.g., `123456789012345`).

### Step 1.2: Install Google Tag Manager Snippet
Ensure your Web GTM container snippets are placed into your website theme:
* **Head Code**: Placed immediately below the opening `<head>` tag.
  ```html
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
  <!-- End Google Tag Manager -->
  ```
* **Body Code**: Placed immediately after the opening `<body>` tag.
  ```html
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  ```

---

## 2. Choosing Your Web GTM Tag Template

In GTM, navigate to **Templates** > **Tag Templates** > **Search Gallery**. You have two options:

1. **Option A: Meta Official Template (`facebookarchive` / `meta`)**
   * Search for: `Facebook Pixel` by `facebookarchive`.
   * Standard vendor implementation directly from Meta.
2. **Option B: Stape.io Template (`stape-io`)**
   * Search for: `Facebook Pixel` by `stape-io`.
   * Enables Stape's **Custom Loader** to bypass browser ad-blockers and Safari ITP cookie limits, plus native UI fields for `Event ID` and SHA-256 hashing.

*(For detailed pros and cons, see [Meta Official vs. Stape Template Comparison](../03-web-gtm-implementation/meta-official-vs-stape-pixel-template.md)).*

---

## 3. GTM Variable Architecture

Before building tags, configure the supporting variables in GTM (**Variables** > **User-Defined Variables**).

### 3.1 Constant & Utility Variables
| Variable Name | Variable Type | Value / Configuration |
| :--- | :--- | :--- |
| `Const - Meta Pixel ID` | Constant | `123456789012345` (Your Pixel ID) |
| `Stape Unique Event ID` (or `cJS - FB - Event ID`) | Template / Custom JS | Generates timestamped random ID for deduplication |

```javascript
// cJS - FB - Event ID (Alternative if not using Stape template)
function() {
  return 'evt_' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000000);
}
```

### 3.2 Standard DataLayer Variables (GA4 E-commerce Schema)
| Variable Name | Variable Type | Data Layer Variable Name |
| :--- | :--- | :--- |
| `DLV - ecommerce.items` | Data Layer Variable | `ecommerce.items` |
| `DLV - ecommerce.currency` | Data Layer Variable | `ecommerce.currency` |
| `DLV - ecommerce.value` | Data Layer Variable | `ecommerce.value` |
| `DLV - ecommerce.transaction_id` | Data Layer Variable | `ecommerce.transaction_id` |
| `DLV - customer.email` | Data Layer Variable | `customer.email` (or backend user email) |
| `DLV - customer.phone` | Data Layer Variable | `customer.phone` |
| `DLV - customer.first_name` | Data Layer Variable | `customer.first_name` |
| `DLV - customer.last_name` | Data Layer Variable | `customer.last_name` |
| `DLV - customer.city` | Data Layer Variable | `customer.city` |
| `DLV - customer.state` | Data Layer Variable | `customer.state` |
| `DLV - customer.zip` | Data Layer Variable | `customer.zip` |
| `DLV - customer.country` | Data Layer Variable | `customer.country` |

---

### 3.3 Custom JavaScript Helper Variables (cJS)

These functions extract and format items arrays into exact Meta-compliant structures.

#### 1. `cJS - FB - Product ID` (Extracts array of product IDs)
```javascript
function() {
  var items = {{DLV - ecommerce.items}};
  if (!items || !items.length) return [];
  var ids = [];
  for (var i = 0; i < items.length; i++) {
    var id = items[i].item_id || items[i].id;
    if (id) ids.push(String(id));
  }
  return ids;
}
```

#### 2. `cJS - FB - Product Name` (Joined string of item names)
```javascript
function() {
  var items = {{DLV - ecommerce.items}};
  if (!items || !items.length) return '';
  var names = [];
  for (var i = 0; i < items.length; i++) {
    var name = items[i].item_name || items[i].name;
    if (name) names.push(name);
  }
  return names.join(', ');
}
```

#### 3. `cJS - FB - Product Category` (Primary or joined category)
```javascript
function() {
  var items = {{DLV - ecommerce.items}};
  if (!items || !items.length) return '';
  return items[0].item_category || '';
}
```

#### 4. `cJS - FB - Num of Items` (Calculates total item count)
```javascript
function() {
  var items = {{DLV - ecommerce.items}};
  if (!items || !items.length) return 0;
  var count = 0;
  for (var i = 0; i < items.length; i++) {
    count += Number(items[i].quantity) || 1;
  }
  return count;
}
```

#### 5. `cJS - FB - Contents` (Formatted `contents` array for Advantage+ Catalog Ads)
```javascript
function() {
  var items = {{DLV - ecommerce.items}};
  if (!items || !items.length) return [];
  var contents = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var id = item.item_id || item.id;
    if (id) {
      contents.push({
        id: String(id),
        quantity: Number(item.quantity) || 1,
        item_price: Number(item.price) || 0
      });
    }
  }
  return contents;
}
```

---

## 4. Step-by-Step Tag Configurations

### Tag 1: Base Pixel - `FB - Base - PageView`
* **Tag Type**: `Facebook Pixel` (Meta Official or Stape)
* **Pixel ID**: `{{Const - Meta Pixel ID}}`
* **Event Name**: `PageView`
* **Trigger**: `All Pages` (or `Initialization - All Pages`)
* **Tag Firing Options**: Once per event

```text
Tag: FB - Base - PageView
├── Pixel ID: {{Const - Meta Pixel ID}}
├── Event: PageView
└── Trigger: All Pages
```

---

### Tag 2: ViewContent - `FB - Event - ViewContent`
* **Tag Type**: `Facebook Pixel`
* **Pixel ID**: `{{Const - Meta Pixel ID}}`
* **Event Name**: `ViewContent`
* **Object Properties / Custom Data**:
  | Property Key | Property Value |
  | :--- | :--- |
  | `content_type` | `product` |
  | `content_ids` | `{{cJS - FB - Product ID}}` |
  | `content_name` | `{{cJS - FB - Product Name}}` |
  | `content_category` | `{{cJS - FB - Product Category}}` |
  | `value` | `{{DLV - ecommerce.value}}` |
  | `currency` | `{{DLV - ecommerce.currency}}` |
  | `contents` | `{{cJS - FB - Contents}}` |
* **Event ID**: `{{cJS - FB - Event ID}}` (or set custom parameter `eventID`)
* **Trigger**: Custom Event `view_item`

---

### Tag 3: AddToCart - `FB - Event - AddToCart`
* **Tag Type**: `Facebook Pixel`
* **Pixel ID**: `{{Const - Meta Pixel ID}}`
* **Event Name**: `AddToCart`
* **Object Properties / Custom Data**:
  | Property Key | Property Value |
  | :--- | :--- |
  | `content_type` | `product` |
  | `content_ids` | `{{cJS - FB - Product ID}}` |
  | `content_name` | `{{cJS - FB - Product Name}}` |
  | `content_category` | `{{cJS - FB - Product Category}}` |
  | `value` | `{{DLV - ecommerce.value}}` |
  | `currency` | `{{DLV - ecommerce.currency}}` |
  | `contents` | `{{cJS - FB - Contents}}` |
* **Event ID**: `{{cJS - FB - Event ID}}`
* **Trigger**: Custom Event `add_to_cart`

---

### Tag 4: InitiateCheckout - `FB - Event - InitiateCheckout`
* **Tag Type**: `Facebook Pixel`
* **Pixel ID**: `{{Const - Meta Pixel ID}}`
* **Event Name**: `InitiateCheckout`
* **Object Properties / Custom Data**:
  | Property Key | Property Value |
  | :--- | :--- |
  | `content_type` | `product` |
  | `content_ids` | `{{cJS - FB - Product ID}}` |
  | `contents` | `{{cJS - FB - Contents}}` |
  | `num_items` | `{{cJS - FB - Num of Items}}` |
  | `value` | `{{DLV - ecommerce.value}}` |
  | `currency` | `{{DLV - ecommerce.currency}}` |
* **Event ID**: `{{cJS - FB - Event ID}}`
* **Trigger**: Custom Event `begin_checkout`

---

### Tag 5: Purchase with Advanced Matching - `FB - Event - Purchase`
* **Tag Type**: `Facebook Pixel`
* **Pixel ID**: `{{Const - Meta Pixel ID}}`
* **Event Name**: `Purchase`
* **Object Properties / Custom Data**:
  | Property Key | Property Value |
  | :--- | :--- |
  | `content_type` | `product` |
  | `content_ids` | `{{cJS - FB - Product ID}}` |
  | `contents` | `{{cJS - FB - Contents}}` |
  | `num_items` | `{{cJS - FB - Num of Items}}` |
  | `value` | `{{DLV - ecommerce.value}}` |
  | `currency` | `{{DLV - ecommerce.currency}}` |
  | `order_id` | `{{DLV - ecommerce.transaction_id}}` |
* **Event ID**: `{{cJS - FB - Event ID}}`
* **Customer Information / Advanced Matching**:
  | Meta Field | Mapped GTM Variable |
  | :--- | :--- |
  | `Email` | `{{DLV - customer.email}}` |
  | `Phone` | `{{DLV - customer.phone}}` |
  | `First Name` | `{{DLV - customer.first_name}}` |
  | `Last Name` | `{{DLV - customer.last_name}}` |
  | `City` | `{{DLV - customer.city}}` |
  | `State` | `{{DLV - customer.state}}` |
  | `Zip Code` | `{{DLV - customer.zip}}` |
  | `Country` | `{{DLV - customer.country}}` |
* **Trigger**: Custom Event `purchase`
* **Tag Firing Options**: Once per page (avoids duplicate charges on page refreshes)

---

## 5. Verification & Quality Assurance (QA)

### 5.1 Meta Pixel Helper (Chrome Extension)
1. Install **Meta Pixel Helper** from the Chrome Web Store.
2. Navigate through your store:
   * **Homepage**: Verify green checkmark on `PageView`.
   * **Product Page**: Verify `ViewContent` fires with `content_ids`, `value`, and `currency`.
   * **Add to Cart**: Verify `AddToCart` fires with accurate quantity and price.
   * **Checkout**: Verify `InitiateCheckout` captures total basket value and item list.
   * **Order Confirmation**: Verify `Purchase` fires with `order_id`, exact financial total, and customer info indicators.

### 5.2 Meta Events Manager Test Events (Browser Tab)
1. Open **Events Manager** > **Test Events** > Select **Confirm your website's events are set up correctly**.
2. Enter your website URL and click **Open Website**.
3. Perform test actions.
4. Verify events appear in the stream tagged with source: `Browser`.
5. Expand each event and confirm that parameters (`content_ids`, `contents`, `value`, `currency`, `event_id`) are populated with non-null values.
