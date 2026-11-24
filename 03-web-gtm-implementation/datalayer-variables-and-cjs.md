# DataLayer Variables & Custom JavaScript Snippets

## 1. Core DataLayer Variables (GA4 Standard Schema)

Create the following **Data Layer Variables** in Web GTM:

| Variable Name in GTM | Data Layer Variable Name | Description |
| :--- | :--- | :--- |
| `{{DLV - Items}}` | `ecommerce.items` | Full array of product objects |
| `{{DLV - Currency}}` | `ecommerce.currency` | 3-letter currency code (e.g. `INR`, `USD`) |
| `{{DLV - Value}}` | `ecommerce.value` | Total monetary value of the event |
| `{{DLV - Transaction ID}}` | `ecommerce.transaction_id` | Order ID (for `purchase`) |
| `{{DLV - Product ID}}` | `ecommerce.items.0.item_id` | ID of the first/primary item |
| `{{DLV - Product Name}}` | `ecommerce.items.0.item_name` | Name of the first/primary item |
| `{{DLV - Product Category}}`| `ecommerce.items.0.item_category` | Category of the first/primary item |
| `{{DLV - Product Price}}` | `ecommerce.items.0.price` | Price of the first/primary item |
| `{{DLV - Product Quantity}}`| `ecommerce.items.0.quantity` | Quantity of the first/primary item |

---

## 2. Customer Information DataLayer Variables (Checkout / Purchase)

Depending on your CMS (WooCommerce, Shopify, Custom):

### Option A: Standard WooCommerce / Custom DataLayer
* `{{DLV - Customer Email}}`: `customerBillingEmail` OR `orderData.customer.billing.email`
* `{{DLV - Customer Phone}}`: `customerBillingPhone` OR `orderData.customer.billing.phone`
* `{{DLV - Customer First Name}}`: `customerBillingFirstName` OR `orderData.customer.billing.first_name`
* `{{DLV - Customer Last Name}}`: `customerBillingLastName` OR `orderData.customer.billing.last_name`
* `{{DLV - Customer City}}`: `customerBillingCity` OR `orderData.customer.billing.city`
* `{{DLV - Customer State}}`: `customerBillingState` OR `orderData.customer.billing.country`
* `{{DLV - Customer Postcode}}`: `customerBillingPostcode` OR `orderData.customer.billing.postcode`
* `{{DLV - Customer Country}}`: `customerBillingCountry` OR `orderData.customer.billing.country`

---

## 3. Custom JavaScript (cJS) Variables

### 1. `cJS - FB - Event Time`
Returns current Unix timestamp in seconds (required for Meta CAPI `event_time`):
```javascript
function() {
  return Math.round(new Date().getTime() / 1000);
}
```

---

### 2. `cJS - FB - Product ID` (Extracts Array of Item IDs)
Extracts all product IDs from `ecommerce.items` as an array of strings:
```javascript
function() {
  var items = {{DLV - Items}};
  if (!items || !items.length) {
    return [];
  }
  return items.map(function(item) {
    return String(item.item_id || item.id || '');
  });
}
```

---

### 3. `cJS - FB - Product Name` (Joined Names)
Extracts product names joined by comma:
```javascript
function() {
  var items = {{DLV - Items}};
  if (!items || !items.length) {
    return '';
  }
  return items.map(function(item) {
    return item.item_name || item.name || '';
  }).join(', ');
}
```

---

### 4. `cJS - FB - Product Category` (Joined Categories)
Extracts product categories joined by comma:
```javascript
function() {
  var items = {{DLV - Items}};
  if (!items || !items.length) {
    return '';
  }
  return items.map(function(item) {
    return item.item_category || item.category || '';
  }).join(', ');
}
```

---

### 5. `cJS - FB - Num of Items` (Calculates Total Cart Quantity)
Calculates the exact total quantity of all items in cart/checkout:
```javascript
function() {
  var items = {{DLV - Items}};
  if (!items || !items.length) {
    return 1;
  }
  return items.reduce(function(acc, item) {
    return acc + (parseInt(item.quantity, 10) || 1);
  }, 0);
}
```

---

### 6. `cJS - FB - Contents` (Formatted for Meta Catalog Ads)
Transforms `ecommerce.items` into Meta's exact `contents` array structure:
```javascript
function() {
  var items = {{DLV - Items}};
  if (!items || !items.length) {
    return [];
  }
  return items.map(function(item) {
    return {
      id: String(item.item_id || item.id || ''),
      item_price: parseFloat(item.price || 0),
      quantity: parseInt(item.quantity, 10) || 1
    };
  });
}
```
