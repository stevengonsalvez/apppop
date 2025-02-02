

# Google Analytics Setup Guide Using Google Tag Manager

## Installation

1. **Environment Setup**
```env
VITE_GTM_CONTAINER_ID=GTM-********  # Your GTM container ID
```

2. **HTML Setup**
Add the following snippets to your `index.html`:

```html
<!-- In <head> -->
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','%VITE_GTM_CONTAINER_ID%');</script>
<!-- End Google Tag Manager -->

<!-- After <body> -->
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=%VITE_GTM_CONTAINER_ID%"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## GTM Configuration

### Variables

1. **Built-in Variables**
- Page URL
- Page Path
- Page Hostname
- Click Classes
- Click ID

2. **Custom Variables**
```javascript
// User ID
Name: "User ID"
Type: Data Layer Variable
Data Layer Variable Name: user_properties.userId

// Page Title
Name: "Page Title"
Type: Data Layer Variable
Data Layer Variable Name: page_title
```

### Triggers

```javascript
// Page View
Name: "Page View"
Type: Page View

// Login Event
Name: "Login Event"
Type: Custom Event
Event name: login

// Profile Update
Name: "Profile Update"
Type: Custom Event
Event name: profile_update

// E-commerce Events
Name: "View Item"
Type: Custom Event
Event name: view_item

Name: "Begin Checkout"
Type: Custom Event
Event name: begin_checkout
```

### Tags

1. **GA4 Configuration**
```javascript
Name: "GA4 Configuration"
Type: Google Analytics: GA4 Configuration
Measurement ID: G-XXXXXXXX  // Your GA4 measurement ID
Fields to Set:
  - user_id: {{User ID}}
Triggering: Page View
```

2. **GA4 Events**
```javascript
// Login Event
Name: "GA4 - Login"
Type: GA4 Event
Configuration Tag: GA4 Configuration
Event Name: login
Event Parameters:
  - method: {{Event Method}}
  - success: {{Event Success}}
Triggering: Login Event

// Profile Update
Name: "GA4 - Profile Update"
Type: GA4 Event
Configuration Tag: GA4 Configuration
Event Name: profile_update
Event Parameters:
  - updated_fields: {{Updated Fields}}
Triggering: Profile Update

// View Item
Name: "GA4 - View Item"
Type: GA4 Event
Configuration Tag: GA4 Configuration
Event Name: view_item
Ecommerce Data: Use Data Layer
Triggering: View Item

// Begin Checkout
Name: "GA4 - Begin Checkout"
Type: GA4 Event
Configuration Tag: GA4 Configuration
Event Name: begin_checkout
Ecommerce Data: Use Data Layer
Triggering: Begin Checkout
```

## Events Implementation

### Authentication Events
```typescript
// Login Success
tagManager.pushEvent('login', {
  method: 'email',
  success: true
});

// Login Failure
tagManager.pushEvent('login', {
  method: 'email',
  success: false,
  error_message: error.message
});
```

### Profile Events
```typescript
// Profile Update
tagManager.pushEvent('profile_update', {
  updated_fields: ['name', 'email'],
  marketing_email: true,
  marketing_notifications: false
});
```

### E-commerce Events
```typescript
// View Item
tagManager.pushEvent('view_item', {
  currency: 'USD',
  value: plan.price,
  items: [{
    item_id: plan.id,
    item_name: plan.name,
    price: plan.price,
    item_category: 'Subscription Plan',
    item_variant: plan.billing_period
  }]
});

// Begin Checkout
tagManager.pushEvent('begin_checkout', {
  currency: 'USD',
  value: total,
  items: [/* array of items */]
});
```

## Testing & Debugging

1. **GTM Preview Mode**
- Click "Preview" in GTM interface
- Enter your app URL
- Verify events in the preview panel

2. **Console Debugging**
```javascript
// Add to browser console
dataLayer.push = function(e) {
  console.log('dataLayer:', e);
  Array.prototype.push.call(this, e);
}
```

3. **Key Flows to Test**
- Login/Registration
- Profile updates
- Plan viewing
- Checkout process
- Error scenarios

## Automated Setup

You can use the GTM API to automate the setup. See the accompanying script in `scripts/setup-gtm.ts`. 



# 📊 QUICK READ on APPROACH Google Tag Manager (GTM) & Firebase Analytics for Web and Native (Capacitor) 

## ✅ Can I Use Google Tag Manager (GTM) for Native in Capacitor?
Yes, **but not directly**. GTM is designed for web tracking, so native tracking requires Firebase Analytics.

### **Best Approach for a Capacitor Web + Native App**
✅ **Use Google Tag Manager (GTM) for Web** (tracks browser-based interactions).  
✅ **Use Firebase Analytics for Native** (iOS & Android tracking).  
✅ **Connect Firebase Analytics to GA4** for **cross-platform insights**.

---

## 🚀 **Using Google Tag Manager (GTM) in a Capacitor App**

### **1️⃣ GTM for Web (Works in WebView)**
To integrate GTM in your web-based Capacitor app:

1. Add the GTM snippet inside `<head>` in `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GTM-XXXXXXX');
   </script>
   ```

2. This will track **web traffic inside the Capacitor WebView**.

---

### **2️⃣ GTM for Native (Requires Firebase Analytics)**
Since GTM doesn't have a native SDK, use **Firebase Analytics** instead:

1. Install Firebase Analytics for Capacitor:
   ```sh
   npm install @capacitor-community/firebase-analytics
   npx cap sync
   ```
2. Initialize Firebase Analytics:
   ```typescript
   import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

   FirebaseAnalytics.setCollectionEnabled({ enabled: true });
   FirebaseAnalytics.logEvent({
     name: 'custom_event',
     params: { item: 'product_123' }
   });
   ```
3. Send event data to GTM by linking **Firebase Analytics** in **Google Tag Manager**.

---

## 🔥 **Using Firebase Analytics for Web**
Firebase Analytics can also track **web** interactions.

### **1️⃣ Install Firebase SDK**
```sh
npm install firebase
```

### **2️⃣ Initialize Firebase in Your Web App**
```javascript
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

### **3️⃣ Track Events in Firebase Analytics**
```javascript
import { logEvent } from "firebase/analytics";

logEvent(analytics, "button_click", { 
  button_name: "signup", 
  user_id: "12345" 
});
```

---

## **📊 Google Analytics (GA4) vs Google Tag Manager (GTM) for a Capacitor App**
| Feature                         | **Google Analytics (GA4) Directly** | **Google Tag Manager (GTM)** |
|----------------------------------|-------------------------------------|------------------------------|
| Setup Complexity                 | Simple (add script & configure GA4) | More complex (needs GTM setup) |
| Flexibility                      | Limited (hardcoded tracking setup) | High (dynamic tag & event management) |
| Event Tracking                   | Manual (hardcoded in JS/native code) | Flexible (defined in GTM UI) |
| Updates & Maintenance            | Requires code updates               | No code changes needed (managed via GTM UI) |
| Multiple Integrations (Ads, Pixels) | Requires individual scripts         | One centralized management UI |
| Native App Support (iOS/Android)  | ❌ No                              | ❌ No (but Firebase Analytics does) |
| Debugging & Testing               | Limited                             | Built-in debug mode |

### **🚀 When to Use Google Analytics (GA4) Directly**
✅ If you **only need basic tracking** (page views, session data).  
✅ If you **don't want to manage multiple tracking tools**.  
✅ If you **want to minimize setup complexity**.

### **🔥 When to Use Google Tag Manager (GTM)**
✅ If you **need advanced tracking** (custom events, eCommerce, button clicks, etc.).  
✅ If you **manage multiple scripts (GA4, Facebook Pixel, Ads, etc.)**.  
✅ If you **want to update tracking without modifying code**.  

🚀 **Best practice for a Capacitor App**: Use **GTM for Web** and **Firebase Analytics for Native**.

---

## 📊 **Firebase Analytics vs Google Analytics (GA4) for Web**
| Feature                     | **Firebase Analytics (Web)** | **Google Analytics (GA4)** |
|-----------------------------|----------------------------|----------------------------|
| Designed for                | Web + Mobile (Apps)        | Web (Traditional Websites) |
| Event Model                 | Event-driven (App-based)   | Event-driven (Web-based)   |
| Web Integration             | Requires Firebase SDK      | Uses GA tracking script    |
| Native Mobile Support       | ✅ Yes (iOS, Android)      | ❌ No (Web-only)           |
| Reporting UI                | Firebase Console           | Google Analytics UI        |
| Google Tag Manager Support  | Limited                    | Full Support               |

- **Use Firebase Analytics** if your app is a **Capacitor app, PWA, or mobile-first**.
- **Use Google Analytics (GA4)** if you're tracking a **standard website**.

---

## 🚀 **How to Use Firebase Analytics + GA4 Together**
You can link **Firebase Analytics to Google Analytics (GA4)** for **unified cross-platform tracking**:

1. In the **Firebase Console**, go to **Project Settings > Integrations**.
2. Connect to **Google Analytics**.
3. Data from Firebase Analytics will now flow into **Google Analytics (GA4)**.

---

## 🎯 **Final Recommendations**
✅ **Use GTM for Web + Firebase Analytics for Native Apps**  
✅ **Use Google Analytics (GA4) for better web tracking**  
✅ **Link Firebase Analytics to GA4 for unified reporting**  
✅ **Use GTM if you need more flexibility and easier tracking updates**  

Would you like a **detailed step-by-step guide** on integrating Firebase Analytics with GTM for full tracking? 🚀