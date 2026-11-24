# Meta Ads Specialist: Step-by-Step Prompt Sequence for Tracking Implementation

A complete, copy-pasteable sequence of prompts to use when working with an AI agent powered by the **`meta-pixel-capi`** skill. Follow these prompts in order from project kickoff to production publish.

---

## Stage 1: Kickoff & Automated Website Audit

Use this prompt to start the project and have the AI agent inspect your store's existing dataLayer before making any changes.

### Prompt 1.1: The Project Kickoff Prompt
```text
I am a Meta Ads Specialist. I need to implement complete, production-grade tracking for this ecommerce store: [INSERT WEBSITE URL].

The store already has an active ecommerce dataLayer. I want to deploy:
1. Browser Meta Pixel (Web GTM)
2. Server-Side Conversions API (sGTM + Stape.io)
3. 100% Event Deduplication (event_id)
4. High Event Match Quality (EMQ 8.0+)
5. Advantage+ Catalog Ads parameter compatibility (contents array, content_ids, value, currency)

Please inspect the website, audit the existing dataLayer events across the funnel (view_item, add_to_cart, begin_checkout, purchase), and tell me what you find in plain English before making any changes.
```

---

## Stage 2: Answering the Discovery Questions

After the agent audits your site, it will ask you discovery questions. Copy, fill in the brackets, and send this prompt back to the agent.

### Prompt 2.1: Discovery Confirmation Prompt
```text
Here are the project and business details:

1. Platform: [WooCommerce / Shopify / PrestaShop / Custom]
2. Tracking Scope: Full Hybrid Dual-Tagging (Browser Pixel + Server CAPI with deduplication)
3. Server Infrastructure: Stape.io cloud server
4. First-Party Tracking Domain: [ss.yourdomain.com OR "Please guide me on how to set this up"]
5. Tag Template Preference: Stape.io Facebook Pixel Template (for ad-blocker bypassing)
6. Meta Dataset / Pixel ID: [INSERT 15-16 DIGIT PIXEL ID]
7. Conversions API Access Token: [INSERT TOKEN OR "I will add this manually in GTM"]
8. Test Event Code: [INSERT TEST CODE FROM EVENTS MANAGER, e.g., TEST12345, OR "None for now"]

Please confirm and design the implementation roadmap based on our existing dataLayer.
```

---

## Stage 3: Web Container Configuration & Custom JavaScript

Ask the agent to generate the exact GTM variables, triggers, and tags without you having to write code.

### Prompt 3.1: Generate Web GTM Setup
```text
Based on our store's dataLayer, please create all required Web GTM components:

1. The 5 Custom JavaScript helper variables:
   - cJS - FB - Product ID
   - cJS - FB - Product Name
   - cJS - FB - Product Category
   - cJS - FB - Num of Items
   - cJS - FB - Contents (Advantage+ Catalog formatted)
   - cJS - Clean Value (numeric formatting)
   - Stape Unique Event ID (for deduplication)
2. The standard Meta Pixel tags:
   - FB - Base - PageView
   - FB - Event - ViewContent
   - FB - Event - AddToCart
   - FB - Event - InitiateCheckout
   - FB - Event - Purchase (with Advanced Matching mapped)
3. Google Tag (GA4 Configuration) routing to my server container URL with x-fb-cd-* parameters.

Please provide this either as an importable GTM JSON container file or step-by-step tag settings.
```

---

## Stage 4: Server-Side GTM & Stape.io Setup

Use this prompt to guide the server-side Conversions API configuration.

### Prompt 4.1: Server Container & CAPI Setup
```text
Now let's configure the Server GTM container for Meta Conversions API:

1. How do I link my GTM Server container to Stape.io?
2. What DNS record do I need to add in my domain registrar for ss.mydomain.com?
3. How do I configure the Conversions API tag (facebookincubator) and trigger it on GA4 ecommerce events?
4. How do I exclude x-fb-* parameters and customer PII from my GA4 server tag so I don't violate Google Anti-PII policies?

Explain each step simply so I can follow along easily.
```

---

## Stage 5: Testing, Debugging & Deduplication Verification

Once both containers are configured, run this prompt to have the agent verify the data flow.

### Prompt 5.1: QA & Verification Prompt
```text
I am now in GTM Preview Mode and Meta Events Manager Test Events tab. I just completed a test purchase of [INSERT PRODUCT NAME AND PRICE].

Here is what I see in my console / GTM preview: [PASTE ANY ERROR OR SCREENSHOT/TEXT].

Please check:
1. Did the browser pixel fire with clean numeric value and currency?
2. Did the server CAPI tag receive the event with status 200 OK?
3. Are the event_id values identical between browser and server?
4. Is Meta Events Manager showing the event as "Deduplicated"?
5. Is my Event Match Quality (EMQ) score on track for 8.0+?
```

---

## Stage 6: Troubleshooting Specific Issues (As Needed)

If you encounter any specific warnings in Meta Events Manager, use these targeted prompts:

### Prompt 6.1: Deduplication Error Fix
```text
Meta Events Manager is giving me an alert: "Same Event ID Received for Different Events" or "Events are not deduplicating". 

Please inspect my event_id configuration across my Web Pixel and Server CAPI tags and tell me how to fix it.
```

### Prompt 6.2: Low EMQ Score Fix
```text
My Event Match Quality (EMQ) on the Purchase event is low (below 6.0). 

Which customer parameters (email, phone, first name, last name, address, external_id, _fbp, _fbc) are missing or not formatted correctly in my dataLayer, and how can we capture them at checkout?
```

### Prompt 6.3: Catalog Missing Parameters
```text
Meta Commerce Manager says my catalog items do not match my pixel events. 

Can you check if my content_ids match my catalog retailer_id (SKU vs Post ID) and verify the format of my contents array?
```

---

## Stage 7: Final Pre-Flight Check & Production Launch

Run this prompt right before pushing changes live to production.

### Prompt 7.1: Pre-Flight Checklist
```text
We are ready to go live. Please run a final pre-flight checklist:

1. Did we remove the temporary Test Event Code (TESTxxxxx) from the Server CAPI tag?
2. Is value strictly formatted as a number without commas or symbols?
3. Are both Web and Server GTM containers ready to be published?
4. What ongoing checks should I monitor in Meta Ads Manager over the next 48 hours to confirm purchases are attributing correctly to my ad sets?
```

---

## Stage 8: Handover & Documentation Request

Use this final prompt to generate a complete handover summary for your agency, team, or client.

### Prompt 8.1: Client Handover Report
```text
The implementation and testing are complete. 

Please generate a professional Client Tracking & Handover Report in plain English including:
1. Executive Tracking Summary (how browser and server work together)
2. Funnel Event & Parameter Mapping Sheet
3. Event Deduplication & EMQ explanation
4. GTM Container Backup and maintenance instructions
```
