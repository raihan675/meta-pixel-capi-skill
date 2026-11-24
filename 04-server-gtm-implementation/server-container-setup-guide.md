# Server GTM Container: Setup Guide (Stape.io / GCP)

## 1. Overview

The Server GTM Container operates in a cloud environment (such as [Stape.io](https://stape.io) or Google Cloud Platform). It receives HTTP requests dispatched from the Web Container and executes server-side tagging.

---

## 2. Step-by-Step Provisioning with Stape.io

### Step 1: Create GTM Server Container
1. Go to [tagmanager.google.com](https://tagmanager.google.com).
2. Inside your GTM account, click **Create Container**.
3. **Container Name:** `[Your Brand] - Server`
4. **Target Platform:** Select **Server**.
5. Once created, choose **Manually provision tagging server**.
6. Copy the **Container Config Key** (e.g., `aWQ9R1RN...`).

### Step 2: Create Stape.io Cloud Server
1. Log in to [Stape.io](https://stape.io).
2. Click **Create Container**.
3. **Container Name:** Enter your domain/business name.
4. **Container Configuration:** Paste the GTM Container Config Key copied in Step 1.
5. **Server Location:** Choose the region closest to your target audience (e.g., `AP South (India)`, `US East`, `EU West`).
6. Click **Create Container**.

### Step 3: Link Tagging Server URL back to GTM
1. In Stape, copy the generated **Tagging Server URL** (e.g., `https://xxxx.stape.io`).
2. Return to GTM Server Container > **Admin** > **Container Settings**.
3. Under **Server container URLs**, click **Add URL**, paste your tagging URL, and click **Save**.
4. *This step is essential to enable Preview mode for the Server Container.*

---

## 3. Setting Up a Custom Domain (First-Party Context)

Using Stape's default `.stape.io` URL works for initial testing, but using a **custom subdomain** (e.g. `ss.yourdomain.com`) is critical for production:
* Prevents ad blockers from blocking tracking scripts.
* Extends cookie lifespans (`_fbp`, `_fbc`) to 90 days.
* Ensures 100% first-party context.

### DNS Configuration Steps:
1. In Stape.io container settings, click **Add Custom Domain**.
2. Enter your desired subdomain: `ss.yourdomain.com`.
3. In your DNS provider (Cloudflare, GoDaddy, Namecheap), add the DNS record provided by Stape:
   * **Type:** `CNAME` (or `A` record)
   * **Name / Host:** `ss`
   * **Target / Value:** Provided by Stape (e.g., `customer-xxxx.stape.io`)
   * **Proxy:** If using Cloudflare, set proxy to **DNS Only** (Gray Cloud) during SSL issuance.
4. Once verified, update the **Server container URLs** in GTM and the `server_container_url` in your Web GTM Google Tag.
