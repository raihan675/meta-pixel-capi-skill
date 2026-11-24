const fs = require('fs');
const path = require('path');

const accountId = '6251820990';
const containerId = '288471691';
const publicId = 'GTM-WXBTRX66';
const pixelId = '1514608697234207';

// Variable IDs
let varCounter = 1;
function nextVarId() { return String(varCounter++); }

let trigCounter = 1;
function nextTrigId() { return String(trigCounter++); }

let tagCounter = 1;
function nextTagId() { return String(tagCounter++); }

const variables = [
  // Constant
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'Const - Meta Pixel ID',
    type: 'c',
    parameter: [
      { type: 'template', key: 'value', value: pixelId }
    ]
  },
  // Deduplication Event ID
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'Event ID - De duplication',
    type: 'jsm',
    parameter: [
      {
        type: 'template',
        key: 'javascript',
        value: "function() {\n  return new Date().getTime() + '.' + Math.floor(Math.random() * 1000000000);\n}"
      }
    ]
  },
  // Data Layer Variables
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Items',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'ecommerce.items' }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Currency',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'ecommerce.currency' }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Value',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'ecommerce.value' }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Transaction ID',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'ecommerce.transaction_id' }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Customer Email',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'customerBillingEmail' }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Customer Phone',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'customerBillingPhone' }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Customer First Name',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'customerBillingFirstName' }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Customer Last Name',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'customerBillingLastName' }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Customer City',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'customerBillingCity' }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Customer State',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'customerBillingState' }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Customer Postcode',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'customerBillingPostcode' }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'DLV - Customer Country',
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: 'customerBillingCountry' }
    ]
  },
  // Custom JavaScript Variables
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'cJS - FB - Product ID',
    type: 'jsm',
    parameter: [
      {
        type: 'template',
        key: 'javascript',
        value: "function() {\n  var items = {{DLV - Items}};\n  if (!items || !items.length) {\n    return [];\n  }\n  var ids = [];\n  for (var i = 0; i < items.length; i++) {\n    var id = items[i].item_id || items[i].id;\n    if (id !== undefined && id !== null && id !== '') {\n      ids.push(String(id));\n    }\n  }\n  return ids;\n}"
      }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'cJS - FB - Product Name',
    type: 'jsm',
    parameter: [
      {
        type: 'template',
        key: 'javascript',
        value: "function() {\n  var items = {{DLV - Items}};\n  if (!items || !items.length) {\n    return '';\n  }\n  return items.map(function(item) {\n    return item.item_name || item.name || '';\n  }).filter(Boolean).join(', ');\n}"
      }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'cJS - FB - Product Category',
    type: 'jsm',
    parameter: [
      {
        type: 'template',
        key: 'javascript',
        value: "function() {\n  var items = {{DLV - Items}};\n  if (!items || !items.length) {\n    return '';\n  }\n  return items.map(function(item) {\n    return item.item_category || item.category || '';\n  }).filter(Boolean).join(', ');\n}"
      }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'cJS - FB - Num of Items',
    type: 'jsm',
    parameter: [
      {
        type: 'template',
        key: 'javascript',
        value: "function() {\n  var items = {{DLV - Items}};\n  if (!items || !items.length) {\n    return 1;\n  }\n  return items.reduce(function(total, item) {\n    var qty = parseInt(item.quantity, 10);\n    return total + (isNaN(qty) ? 1 : qty);\n  }, 0);\n}"
      }
    ]
  },
  {
    accountId,
    containerId,
    variableId: nextVarId(),
    name: 'cJS - FB - Contents',
    type: 'jsm',
    parameter: [
      {
        type: 'template',
        key: 'javascript',
        value: "function() {\n  var items = {{DLV - Items}};\n  if (!items || !items.length) {\n    return [];\n  }\n  return items.map(function(item) {\n    var price = parseFloat(item.price || item.item_price || 0);\n    var qty = parseInt(item.quantity, 10) || 1;\n    return {\n      id: String(item.item_id || item.id || ''),\n      item_price: isNaN(price) ? 0 : price,\n      quantity: qty\n    };\n  });\n}"
      }
    ]
  }
];

// Triggers
const trigViewItem = nextTrigId();
const trigAddToCart = nextTrigId();
const trigBeginCheckout = nextTrigId();
const trigPurchase = nextTrigId();

const triggers = [
  {
    accountId,
    containerId,
    triggerId: trigViewItem,
    name: 'Custom Event - View Item',
    type: 'customEvent',
    customEventFilter: [
      {
        type: 'matchRegex',
        parameter: [
          { type: 'template', key: 'arg0', value: '{{_event}}' },
          { type: 'template', key: 'arg1', value: '^(view_item|view_item_stape)$' },
          { type: 'boolean', key: 'ignore_case', value: 'true' }
        ]
      }
    ]
  },
  {
    accountId,
    containerId,
    triggerId: trigAddToCart,
    name: 'Custom Event - Add to Cart',
    type: 'customEvent',
    customEventFilter: [
      {
        type: 'matchRegex',
        parameter: [
          { type: 'template', key: 'arg0', value: '{{_event}}' },
          { type: 'template', key: 'arg1', value: '^(add_to_cart|add_to_cart_stape)$' },
          { type: 'boolean', key: 'ignore_case', value: 'true' }
        ]
      }
    ]
  },
  {
    accountId,
    containerId,
    triggerId: trigBeginCheckout,
    name: 'Custom Event - Begin Checkout',
    type: 'customEvent',
    customEventFilter: [
      {
        type: 'matchRegex',
        parameter: [
          { type: 'template', key: 'arg0', value: '{{_event}}' },
          { type: 'template', key: 'arg1', value: '^(begin_checkout|begin_checkout_stape)$' },
          { type: 'boolean', key: 'ignore_case', value: 'true' }
        ]
      }
    ]
  },
  {
    accountId,
    containerId,
    triggerId: trigPurchase,
    name: 'Custom Event - Purchase',
    type: 'customEvent',
    customEventFilter: [
      {
        type: 'matchRegex',
        parameter: [
          { type: 'template', key: 'arg0', value: '{{_event}}' },
          { type: 'template', key: 'arg1', value: '^(purchase|purchase_stape)$' },
          { type: 'boolean', key: 'ignore_case', value: 'true' }
        ]
      }
    ]
  }
];

// Tags
const tags = [
  // 1. Base PageView
  {
    accountId,
    containerId,
    tagId: nextTagId(),
    name: 'Meta Pixel - Base (PageView)',
    type: 'html',
    parameter: [
      {
        type: 'template',
        key: 'html',
        value: `<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  
  fbq('init', '{{Const - Meta Pixel ID}}');
  fbq('track', 'PageView', {}, { eventID: '{{Event ID - De duplication}}' });
</script>`
      },
      { type: 'boolean', key: 'supportDocumentWrite', value: 'false' }
    ],
    firingTriggerId: [
      '2147479553' // All Pages built-in trigger ID
    ]
  },
  // 2. ViewContent
  {
    accountId,
    containerId,
    tagId: nextTagId(),
    name: 'Meta Pixel - ViewContent',
    type: 'html',
    parameter: [
      {
        type: 'template',
        key: 'html',
        value: `<script>
  fbq('track', 'ViewContent', {
    content_type: 'product',
    content_ids: {{cJS - FB - Product ID}},
    content_name: {{cJS - FB - Product Name}},
    content_category: {{cJS - FB - Product Category}},
    contents: {{cJS - FB - Contents}},
    value: {{DLV - Value}},
    currency: {{DLV - Currency}}
  }, { eventID: '{{Event ID - De duplication}}' });
</script>`
      },
      { type: 'boolean', key: 'supportDocumentWrite', value: 'false' }
    ],
    firingTriggerId: [ trigViewItem ]
  },
  // 3. AddToCart
  {
    accountId,
    containerId,
    tagId: nextTagId(),
    name: 'Meta Pixel - AddToCart',
    type: 'html',
    parameter: [
      {
        type: 'template',
        key: 'html',
        value: `<script>
  fbq('track', 'AddToCart', {
    content_type: 'product',
    content_ids: {{cJS - FB - Product ID}},
    content_name: {{cJS - FB - Product Name}},
    content_category: {{cJS - FB - Product Category}},
    contents: {{cJS - FB - Contents}},
    value: {{DLV - Value}},
    currency: {{DLV - Currency}}
  }, { eventID: '{{Event ID - De duplication}}' });
</script>`
      },
      { type: 'boolean', key: 'supportDocumentWrite', value: 'false' }
    ],
    firingTriggerId: [ trigAddToCart ]
  },
  // 4. InitiateCheckout
  {
    accountId,
    containerId,
    tagId: nextTagId(),
    name: 'Meta Pixel - InitiateCheckout',
    type: 'html',
    parameter: [
      {
        type: 'template',
        key: 'html',
        value: `<script>
  fbq('track', 'InitiateCheckout', {
    content_type: 'product',
    content_ids: {{cJS - FB - Product ID}},
    contents: {{cJS - FB - Contents}},
    num_items: {{cJS - FB - Num of Items}},
    value: {{DLV - Value}},
    currency: {{DLV - Currency}}
  }, { eventID: '{{Event ID - De duplication}}' });
</script>`
      },
      { type: 'boolean', key: 'supportDocumentWrite', value: 'false' }
    ],
    firingTriggerId: [ trigBeginCheckout ]
  },
  // 5. Purchase
  {
    accountId,
    containerId,
    tagId: nextTagId(),
    name: 'Meta Pixel - Purchase',
    type: 'html',
    parameter: [
      {
        type: 'template',
        key: 'html',
        value: `<script>
  var customerData = {};
  var em = {{DLV - Customer Email}};
  var ph = {{DLV - Customer Phone}};
  var fn = {{DLV - Customer First Name}};
  var ln = {{DLV - Customer Last Name}};
  var ct = {{DLV - Customer City}};
  var st = {{DLV - Customer State}};
  var zp = {{DLV - Customer Postcode}};
  var country = {{DLV - Customer Country}};

  if (em) customerData.em = em;
  if (ph) customerData.ph = ph;
  if (fn) customerData.fn = fn;
  if (ln) customerData.ln = ln;
  if (ct) customerData.ct = ct;
  if (st) customerData.st = st;
  if (zp) customerData.zp = zp;
  if (country) customerData.country = country;

  if (Object.keys(customerData).length > 0) {
    fbq('init', '{{Const - Meta Pixel ID}}', customerData);
  }

  fbq('track', 'Purchase', {
    content_type: 'product',
    content_ids: {{cJS - FB - Product ID}},
    content_name: {{cJS - FB - Product Name}},
    contents: {{cJS - FB - Contents}},
    num_items: {{cJS - FB - Num of Items}},
    value: {{DLV - Value}},
    currency: {{DLV - Currency}},
    order_id: {{DLV - Transaction ID}}
  }, { eventID: '{{Event ID - De duplication}}' });
</script>`
      },
      { type: 'boolean', key: 'supportDocumentWrite', value: 'false' }
    ],
    firingTriggerId: [ trigPurchase ]
  }
];

const containerExport = {
  exportFormatVersion: 2,
  exportTime: new Date().toISOString(),
  containerVersion: {
    path: `accounts/${accountId}/containers/${containerId}/versions/0`,
    accountId: accountId,
    containerId: containerId,
    container: {
      path: `accounts/${accountId}/containers/${containerId}`,
      accountId: accountId,
      containerId: containerId,
      name: 'maindish.in',
      publicId: publicId,
      usageContext: ['web']
    },
    tag: tags,
    trigger: triggers,
    variable: variables
  }
};

const outputPath = path.join(__dirname, '..', 'export', `${publicId}_Meta_Pixel_Ecommerce.json`);
fs.writeFileSync(outputPath, JSON.stringify(containerExport, null, 2), 'utf8');
console.log('Successfully generated GTM container export JSON at: ' + outputPath);
