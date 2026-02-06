# Cookie Policy

**Last Updated:** February 5, 2026  
**Effective Date:** February 5, 2026

## 1. Introduction

This Cookie Policy explains how SlideTheory ("we," "us," or "our") uses cookies and similar tracking technologies when you visit our website and use our services ("Services").

By using our Services, you consent to the use of cookies as described in this policy. You can manage your cookie preferences through our Cookie Consent Banner or your browser settings.

## 2. What Are Cookies?

Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, understand how you interact with the site, and improve your browsing experience.

Similar technologies include:
- **Local Storage:** Stores data in your browser
- **Session Storage:** Temporary storage for a single session
- **Pixels:** Tiny images that track page views
- **Web Beacons:** Small tags that monitor activity

## 3. Types of Cookies We Use

### 3.1 Essential Cookies (Strictly Necessary)
These cookies are required for the website to function and cannot be disabled.

| Cookie Name | Purpose | Duration |
|-------------|---------|----------|
| `session_id` | Maintains your login session | Session |
| `csrf_token` | Security protection against attacks | Session |
| `auth_token` | Authentication state | 7 days |
| `preferences` | Essential user preferences | 1 year |

**Legal Basis:** Legitimate interest in providing secure services

### 3.2 Functional Cookies
These cookies enable enhanced functionality and personalization.

| Cookie Name | Purpose | Duration |
|-------------|---------|----------|
| `theme` | Dark/light mode preference | 1 year |
| `language` | Language selection | 1 year |
| `recent_templates` | Recently used templates | 30 days |
| `user_settings` | Custom preferences | 1 year |

**Legal Basis:** Consent (can be disabled)

### 3.3 Analytics Cookies
These cookies help us understand how visitors interact with our website.

| Cookie Name | Purpose | Provider | Duration |
|-------------|---------|----------|----------|
| `_ga` | Distinguishes users | Google Analytics | 2 years |
| `_gid` | Distinguishes users | Google Analytics | 24 hours |
| `_gat` | Throttles request rate | Google Analytics | 1 minute |
| `intercom-session` | User session tracking | Intercom | 1 week |

**Legal Basis:** Consent (can be disabled)

### 3.4 Marketing Cookies
These cookies track visitors across websites to display relevant advertisements.

| Cookie Name | Purpose | Provider | Duration |
|-------------|---------|----------|----------|
| `_fbp` | Facebook advertising | Meta | 3 months |
| `fr` | Facebook advertising | Meta | 3 months |
| `IDE` | Google advertising | Google | 13 months |
| `test_cookie` | Ad delivery testing | Google | 15 minutes |

**Legal Basis:** Explicit consent (opt-in only)

## 4. Cookie Categories Summary

| Category | Purpose | Required? | Default |
|----------|---------|-----------|---------|
| Essential | Security, authentication, core functionality | Yes | On |
| Functional | Preferences, customization | No | On |
| Analytics | Usage tracking, improvements | No | On |
| Marketing | Advertising, retargeting | No | Off |

## 5. Third-Party Cookies

We use services from the following providers that may set cookies:

### 5.1 Analytics Providers
- **Google Analytics:** Usage analytics and reporting
- **Mixpanel:** Product analytics
- **Amplitude:** User behavior analytics

### 5.2 Communication
- **Intercom:** Customer messaging and support
- **HubSpot:** Marketing automation

### 5.3 Advertising
- **Google Ads:** Conversion tracking
- **Meta (Facebook/Instagram):** Retargeting campaigns
- **LinkedIn:** B2B advertising

### 5.4 Payment Processing
- **Stripe:** Secure payment processing

## 6. Cookie Consent Banner

### 6.1 Implementation
We display a cookie consent banner when you first visit our site:

```
┌─────────────────────────────────────────────────────────────┐
│  🍪 We value your privacy                                   │
│                                                             │
│  We use cookies to enhance your experience, analyze site    │
│  usage, and assist our marketing efforts.                   │
│                                                             │
│  [Accept All]  [Customize]  [Essential Only]                │
│                                                             │
│  By clicking "Accept All", you agree to our Cookie Policy   │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Consent Options

**Accept All:** Enables all cookie categories

**Customize:** Opens detailed preferences panel allowing individual category selection

**Essential Only:** Disables all non-essential cookies

### 6.3 Consent Management

Users can:
- Change preferences at any time via cookie settings link
- Withdraw consent for non-essential cookies
- View detailed list of all active cookies
- Export cookie preferences

## 7. Cookie Settings Link

A "Cookie Settings" link is available in the footer of every page, allowing users to:
- Review current cookie preferences
- Modify consent choices
- See detailed information about each cookie

## 8. How to Manage Cookies

### 8.1 Browser Settings
You can control cookies through your browser:

**Chrome:**
1. Settings → Privacy and security → Cookies and other site data
2. Choose your preferred setting

**Firefox:**
1. Preferences → Privacy & Security → Cookies and Site Data
2. Manage permissions

**Safari:**
1. Preferences → Privacy → Cookies and website data
2. Select preferred option

**Edge:**
1. Settings → Cookies and site permissions
2. Manage and delete cookies

### 8.2 Do Not Track
We respect "Do Not Track" browser signals for marketing cookies where technically feasible.

### 8.3 Global Privacy Control (GPC)
We support GPC signals for opting out of data sales/sharing as required by CCPA/CPRA.

## 9. Data Retention

| Cookie Type | Retention Period | Reason |
|-------------|-----------------|--------|
| Session cookies | Browser session | Functionality |
| Authentication | 7 days | Security |
| Preferences | 1 year | User experience |
| Analytics | 2 years maximum | Analysis |
| Marketing | 13 months maximum | Advertising regulations |

## 10. Cookie Data Processing

### 10.1 What Data Is Collected
Cookies may collect:
- IP address (anonymized for analytics)
- Browser type and version
- Device information
- Pages visited and time spent
- Referring website
- Click patterns

### 10.2 Data Protection
All cookie data:
- Is encrypted in transit (TLS 1.3)
- Is stored securely
- Is not sold to third parties
- Is processed according to our Privacy Policy

## 11. International Considerations

### 11.1 European Union (GDPR/ePrivacy)
- Prior consent required for non-essential cookies
- Clear information about each cookie's purpose
- Easy withdrawal of consent
- Records of consent maintained

### 11.2 California (CCPA/CPRA)
- Disclosure of categories of cookies
- Opt-out of "sale" of personal information (marketing cookies)
- Notice at collection

### 11.3 United Kingdom (UK GDPR/PECR)
- Similar requirements to EU
- ICO guidance followed

### 11.4 Other Jurisdictions
We comply with local cookie laws applicable to our users.

## 12. Updates to This Policy

We may update this Cookie Policy:
- When we add new cookies or services
- To comply with legal requirements
- To improve clarity

Changes will be:
- Posted with updated date
- Notified via cookie banner for material changes
- Effective 30 days after posting for non-essential changes

## 13. Contact Information

**Cookie Questions:** privacy@slidetheory.com  
**DPO (EU):** dpo@slidetheory.com

## 14. Technical Specifications

### 14.1 Cookie Attributes
Our cookies use these security attributes:

- **Secure:** Only transmitted over HTTPS
- **HttpOnly:** Inaccessible to JavaScript (essential cookies)
- **SameSite:** CSRF protection
  - `Lax` for most cookies
  - `Strict` for authentication cookies
- **Path:** Scoped to appropriate paths
- **Domain:** Set to slidetheory.com

### 14.2 Subdomain Cookies
Cookies may be set on:
- `app.slidetheory.com` (application)
- `www.slidetheory.com` (marketing site)
- `api.slidetheory.com` (API requests)

## 15. Cookie Audit Log

We maintain records of:
- Cookie consent choices
- Cookie deployment dates
- Third-party cookie providers
- Cookie policy version history

These records are maintained for compliance purposes.

---

**By using SlideTheory, you acknowledge that you have read and understood this Cookie Policy.**
