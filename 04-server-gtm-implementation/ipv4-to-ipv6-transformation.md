# IPv4 to IPv6 Transformation for Meta CAPI

## 1. Why Convert IPv4 to IPv6?

Meta's matching algorithms and Event Match Quality (EMQ) evaluations are increasingly tuned for IPv6 addresses. 
In many hosting environments (such as cloud proxies or legacy cellular network gateways), user IPs are provided solely in standard IPv4 format (e.g. `192.0.2.1`).

Converting an IPv4 address to its standardized IPv4-mapped IPv6 equivalent (or using an IPv6 lookup transformation) improves server event delivery and network consistency.

---

## 2. IPv4-Mapped IPv6 Representation

According to RFC 4291, an IPv4 address can be represented in IPv6 format using the prefix `::ffff:` followed by the dotted-decimal IPv4 address or its hexadecimal notation:

* **IPv4:** `192.0.2.1`
* **IPv4-Mapped IPv6:** `::ffff:192.0.2.1` or `0:0:0:0:0:ffff:c000:0201`

---

## 3. Server GTM Implementation with Custom Variable Template

In Server GTM:
1. Import the **IPv6 Transformation Variable Template** from the Community Gallery or create a sandboxed variable.
2. Read the client's incoming IP address:
   * **Variable Name:** `{{Event Data - client_ip}}` (Type: Event Data, Key: `client_ip_address` or `ip_override`).
3. Apply the transformation logic:
   ```javascript
   const getRemoteAddress = require('getRemoteAddress');
   const ip = data.ipOverride || getRemoteAddress();

   if (!ip) return undefined;

   // If already IPv6, return as is
   if (ip.indexOf(':') !== -1) {
     return ip;
   }

   // Convert IPv4 to IPv4-mapped IPv6
   return '::ffff:' + ip;
   ```
4. Map the resulting variable into the **Client IP Address** field of your CAPI Tag in Server GTM.
