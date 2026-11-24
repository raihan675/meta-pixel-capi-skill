# GA4 Client Configuration in Server GTM

## 1. What is the GA4 Client?

In Server GTM, a **Client** is the data receiver and translator. When your web container sends an HTTP request (`/g/collect`), the **GA4 Client**:
1. Intercepts and claims the incoming request.
2. Unpacks the event payload, parameters, and user data.
3. Converts the request into an internal **Event Data** object that downstream tags (like the Facebook CAPI tag) can consume.

```
[ Web GTM / Google Tag ] ──HTTP POST──> [ GA4 Client (Server GTM) ]
                                                     │
                                           Generates Event Data
                                                     │
                                       ┌─────────────┴─────────────┐
                                       ▼                           ▼
                              [ GA4 Server Tag ]         [ Facebook CAPI Tag ]
```

---

## 2. Recommended Client Configuration Settings

1. In Server GTM, click **Clients** > Select **Google Analytics: GA4**.
2. **Priority:** Set to `0` (default).
3. **Activation Criteria:**
   * ✅ Check **Default GA4 paths** (`/g/collect`).
   * ✅ Check **Default gtag.js paths for specific IDs**.
   * Add your GA4 Measurement ID (`G-XXXXXXXXXX`).
4. **Advanced Serving Settings:**
   * ✅ Check **Automatically serve all dependent Google scripts** (loads `gtag.js` and dependencies through your custom first-party subdomain).
   * ✅ Check **Compress HTTP response**.
5. **Cookies and Client Identification:**
   * Select **JavaScript Managed** (or Server Managed if strict HttpOnly is desired).
6. Save the Client configuration.

---

## 3. Creating the Client Name Variable and Trigger

### Enable the Client Name Built-in Variable:
1. In Server GTM, go to **Variables**.
2. Under **Built-in Variables**, click **Configure**.
3. Check **Client Name** and **Event Name**.

### Create the GA4 Client Trigger:
1. Go to **Triggers** > **New**.
2. **Trigger Type:** Custom
3. **This trigger fires on:** Some Events
4. **Condition:** `Client Name` equals `GA4`
5. **Trigger Name:** `Client Name - GA4`
6. Click **Save**.
