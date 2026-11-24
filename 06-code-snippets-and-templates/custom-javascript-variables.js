/**
 * META PIXEL & CAPI - GTM CUSTOM JAVASCRIPT VARIABLES
 * 
 * Paste these functions directly into GTM "Custom JavaScript" variables.
 */

// ============================================================================
// 1. VARIABLE NAME: cJS - FB - Event Time
// Description: Returns current Unix timestamp in seconds for Meta CAPI event_time
// ============================================================================
function getEventTime() {
  return Math.round(new Date().getTime() / 1000);
}


// ============================================================================
// 2. VARIABLE NAME: cJS - FB - Product ID
// Description: Extracts array of product IDs from ecommerce.items for content_ids
// Requires GTM Variable: {{DLV - Items}} (maps to ecommerce.items)
// ============================================================================
function getProductIds() {
  var items = {{DLV - Items}};
  if (!items || !items.length) {
    return [];
  }
  var ids = [];
  for (var i = 0; i < items.length; i++) {
    var id = items[i].item_id || items[i].id;
    if (id !== undefined && id !== null && id !== '') {
      ids.push(String(id));
    }
  }
  return ids;
}


// ============================================================================
// 3. VARIABLE NAME: cJS - FB - Product Name
// Description: Returns comma-separated list of product names for content_name
// Requires GTM Variable: {{DLV - Items}} (maps to ecommerce.items)
// ============================================================================
function getProductNames() {
  var items = {{DLV - Items}};
  if (!items || !items.length) {
    return '';
  }
  return items.map(function(item) {
    return item.item_name || item.name || '';
  }).filter(Boolean).join(', ');
}


// ============================================================================
// 4. VARIABLE NAME: cJS - FB - Product Category
// Description: Returns comma-separated list of product categories
// Requires GTM Variable: {{DLV - Items}} (maps to ecommerce.items)
// ============================================================================
function getProductCategories() {
  var items = {{DLV - Items}};
  if (!items || !items.length) {
    return '';
  }
  return items.map(function(item) {
    return item.item_category || item.category || '';
  }).filter(Boolean).join(', ');
}


// ============================================================================
// 5. VARIABLE NAME: cJS - FB - Num of Items
// Description: Calculates total quantity of all items in cart/checkout
// Requires GTM Variable: {{DLV - Items}} (maps to ecommerce.items)
// ============================================================================
function getNumOfItems() {
  var items = {{DLV - Items}};
  if (!items || !items.length) {
    return 1;
  }
  return items.reduce(function(total, item) {
    var qty = parseInt(item.quantity, 10);
    return total + (isNaN(qty) ? 1 : qty);
  }, 0);
}


// ============================================================================
// 6. VARIABLE NAME: cJS - FB - Contents
// Description: Maps ecommerce.items into Meta Catalog contents array format:
//              [{ id: '123', quantity: 2, item_price: 19.99 }]
// Requires GTM Variable: {{DLV - Items}} (maps to ecommerce.items)
// ============================================================================
function getContentsArray() {
  var items = {{DLV - Items}};
  if (!items || !items.length) {
    return [];
  }
  return items.map(function(item) {
    var price = parseFloat(item.price || item.item_price || 0);
    var qty = parseInt(item.quantity, 10) || 1;
    return {
      id: String(item.item_id || item.id || ''),
      item_price: isNaN(price) ? 0 : price,
      quantity: qty
    };
  });
}
