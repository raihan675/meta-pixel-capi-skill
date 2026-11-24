const assert = require('assert');

// Sample data extracted from maindish.in live product page dataLayer
const mockDataLayerItems = [
  {
    item_name: "Traditional Udon Bundle set",
    item_brand: "",
    item_id: "79903",
    item_sku: "",
    price: "390",
    imageUrl: "https://maindish.in/wp-content/uploads/2026/10/udon-combo.webp",
    item_category: "DEALS",
    item_category2: "DEALS & OFFERS",
    quantity: 2
  }
];

// 1. cJS - FB - Product ID
function getProductIds(items) {
  if (!items || !items.length) return [];
  var ids = [];
  for (var i = 0; i < items.length; i++) {
    var id = items[i].item_id || items[i].id;
    if (id !== undefined && id !== null && id !== '') {
      ids.push(String(id));
    }
  }
  return ids;
}

// 2. cJS - FB - Product Name
function getProductNames(items) {
  if (!items || !items.length) return '';
  return items.map(function(item) {
    return item.item_name || item.name || '';
  }).filter(Boolean).join(', ');
}

// 3. cJS - FB - Product Category
function getProductCategories(items) {
  if (!items || !items.length) return '';
  return items.map(function(item) {
    return item.item_category || item.category || '';
  }).filter(Boolean).join(', ');
}

// 4. cJS - FB - Num of Items
function getNumOfItems(items) {
  if (!items || !items.length) return 1;
  return items.reduce(function(total, item) {
    var qty = parseInt(item.quantity, 10);
    return total + (isNaN(qty) ? 1 : qty);
  }, 0);
}

// 5. cJS - FB - Contents
function getContents(items) {
  if (!items || !items.length) return [];
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

// Execute tests
console.log('Testing cJS functions against maindish.in dataLayer...');

const ids = getProductIds(mockDataLayerItems);
assert.deepStrictEqual(ids, ['79903'], 'Product ID should be ["79903"]');
console.log('✔ cJS - FB - Product ID:', ids);

const names = getProductNames(mockDataLayerItems);
assert.strictEqual(names, 'Traditional Udon Bundle set');
console.log('✔ cJS - FB - Product Name:', names);

const categories = getProductCategories(mockDataLayerItems);
assert.strictEqual(categories, 'DEALS');
console.log('✔ cJS - FB - Product Category:', categories);

const numItems = getNumOfItems(mockDataLayerItems);
assert.strictEqual(numItems, 2);
console.log('✔ cJS - FB - Num of Items:', numItems);

const contents = getContents(mockDataLayerItems);
assert.deepStrictEqual(contents, [{ id: '79903', item_price: 390, quantity: 2 }]);
console.log('✔ cJS - FB - Contents:', contents);

// Test regex trigger matching
const regex = /^(view_item|view_item_stape)$/i;
assert.ok(regex.test('view_item_stape'), 'Regex should match view_item_stape');
assert.ok(regex.test('view_item'), 'Regex should match view_item');
assert.ok(!regex.test('view_item_other'), 'Regex should not match partial strings');
console.log('✔ Regex Triggers: Successfully validated for standard & _stape events');

console.log('\nAll 6 tests passed with 0 failures!');
