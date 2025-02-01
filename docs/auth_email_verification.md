# **Supabase Email Verification & Gmail SMTP Configuration**

## **1. Configure Gmail SMTP for Supabase Auth**
To use **Gmail** as the SMTP server for authentication emails in Supabase, follow these steps:

### **Step 1: Enable App Password in Gmail**
Since Google has disabled "Less Secure Apps," you need to create an **App Password**:

1. Go to **[Google Account Security](https://myaccount.google.com/security)**.
2. Scroll down to **"Signing in to Google"**.
3. Enable **2-Step Verification** (if not enabled).
4. Click **"App Passwords"**.
5. Choose **Other (Custom Name)** and enter `"Supabase SMTP"`, then click **Generate**.
6. Copy the **16-character App Password** (you will need it for Supabase).

### **Step 2: Configure SMTP Settings in Supabase**
1. Log in to **[Supabase](https://app.supabase.com/)**.
2. Select your project.
3. Navigate to **Authentication** → **Settings** → **Email Settings**.
4. Enter the following SMTP details:

   ```plaintext
   SMTP Host: smtp.gmail.com
   SMTP Port: 465 (SSL) or 587 (TLS)
   SMTP Username: your-email@gmail.com
   SMTP Password: (Paste the App Password from Step 1)
   Sender Email: your-email@gmail.com
   Sender Name: Your App Name
   ```

5. Click **Save**.

---

## **2. Enable Email Verification in Supabase**
To force users to verify their email before accessing the app:

1. Go to **Authentication** → **Providers**.
2. Click **Email**.
3. Ensure **"Confirm email"** is **enabled**.
4. Save the settings.

This ensures that **users must verify their email** before logging in.

---

## **3. Enforce Verification with Row-Level Security (RLS)**
Even if email verification is enabled, users might try to access the database before confirming their email. Prevent this using an **RLS policy**:

### **Step 1: Enable RLS on the Users Table**
Run this SQL in **Supabase SQL Editor**:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### **Step 2: Create a Policy to Allow Only Verified Users**
```sql
CREATE POLICY "Allow only verified users"
ON profiles
FOR SELECT USING (auth.jwt()->>'email_confirmed_at' IS NOT NULL);
```
This ensures that users **cannot access data** until their email is verified.

---

## **4. Resend Email Verification (If Needed)**
If a user hasn’t received a verification email, you can **manually resend it** via the Supabase API.

### **Using Supabase JavaScript API**
```javascript
const { error } = await supabase.auth.resend({
  type: 'signup',
  email: 'user@example.com'
});

if (error) {
  console.error('Error resending email:', error.message);
} else {
  console.log('Verification email sent!');
}
```

---

## **5. Redirect Users After Verification**
To **redirect users after they confirm their email**:

1. Go to **Authentication → URL Configuration**.
2. Under **Site URL**, enter your app's verification page.

For example:
```
https://yourapp.com/auth/callback
```
Supabase will append a `token` to the URL for email confirmation.

In your frontend, use:
```javascript
const { data: user } = await supabase.auth.getUser();
console.log(user);
```

---

## **Final Outcome**
- ✅ Users **must verify their email** before logging in.
- ✅ If unverified, they **cannot access restricted data**.
- ✅ You can manually **resend verification emails** via API.
- ✅ You can **redirect users** after verification.




## **Other Free SMTP Providers for Supabase Auth**

If you want to send authentication emails in **Supabase** without paying for an SMTP service, here are some **free SMTP providers** you can use.

---

## **1. Free SMTP Providers**
| Provider      | Free Tier | SMTP Limits | Notes |
|--------------|----------|-------------|-------|
| **Zoho Mail** | Free for 5 users | 50 emails/day | Requires domain verification |
| **Yandex Mail** | Free for personal use | 500 emails/day | Needs domain setup |
| **Gmail SMTP (via App Password)** | Free | ~500 emails/day | Can be blocked if flagged as spam |
| **Sendinblue (Brevo)** | 300 emails/day | SMTP API | Best free-tier for transactional emails |
| **Mailgun** | 1000 emails (first month only) | No free after trial | Good for testing |
| **SMTP2Go** | 1,000 emails/month | SMTP API | Limited but reliable |

---
