# Facebook Conversions API (CAPI) Tag Setup in Server GTM

## 1. Choosing the Tag Template

In GTM Server Container Community Template Gallery, two primary CAPI templates are available:
1. **Conversions API Tag** by **facebookincubator** (Official Meta engineering template).
2. **Facebook Conversion API** by **stape-io** (Alternative with built-in Stape power-up enhancements).

*This guide details the setup for the official **facebookincubator** Conversions API Tag.*

---

## 2. Prerequisites from Meta Events Manager

To configure the tag, retrieve the following from [Meta Events Manager](https://events.facebook.com/):
1. **Pixel ID / Dataset ID:**
   * Go to **Events Manager** > **Data Sources** > Select your Pixel > **Settings**.
   * Copy the numeric **Dataset ID** (e.g., `766398201745229`).
2. **API Access Token:**
   * In **Settings**, scroll to **Conversions API** > **Set up direct integration**.
   * Click **Generate access token**.
   * Copy the token (starts with `EAA...`) and store it securely.
3. **Test Event Code (Optional for Testing):**
   * Go to the **Test Events** tab.
   * Under "Confirm your server events are set up correctly", copy the code (e.g. `TEST78658`).
   * *Note: Test event codes expire after 24 hours.*

---

## 3. Tag Configuration

1. In Server GTM, go to **Tags** > **New**.
2. Click **Tag Configuration** > Select **Conversions API Tag (by facebookincubator)**.
3. **Pixel ID:** Enter your Meta Dataset ID (or create a Constant variable `{{Const - Meta Pixel ID}}`).
4. **API Access Token:** Paste your access token (or create a Constant variable `{{Const - Meta CAPI Token}}`).
5. **Test Event Code:** Enter the test code during testing (leave blank in production).
6. **Action Source:** Set to `Website`.
7. **Cookie & Enhancement Settings:**
   * ✅ Check **Extend Meta Pixel cookies (fbp/fbc)**.
   * ✅ Check **Enable Event Enhancement**.

---

## 4. Trigger Configuration

Attach the conditional regex trigger so the CAPI tag fires only for verified GA4 ecommerce events:

1. Under **Triggering**, click **Add Trigger** > **New Trigger**.
2. **Trigger Type:** Custom
3. **This trigger fires on:** Some Events
4. **Conditions:**
   * `Client Name` equals `GA4`
   * AND `Event Name` matches RegEx (ignore case):
     ```regex
     ^(page_view|view_item|add_to_cart|begin_checkout|purchase|add_payment_info|search|sign_up|generate_lead)$
     ```
5. **Trigger Name:** `CAPI - Meta Events Trigger`
6. Save the Tag as `Meta CAPI - All Events`.
