# Setting Up Google Tag Manager with Google Cloud

This guide walks through the process of setting up Google Tag Manager (GTM) with Google Cloud Platform (GCP) and connecting it with Google Analytics 4 (GA4).

## Prerequisites

- A Google Cloud Platform account
- A Google Tag Manager account
- A Google Analytics 4 property
- Admin access to all the above services

## 1. Google Tag Manager Setup

### 1.1 Create a GTM Container

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click "Create Account" if you don't have one
3. Fill in the account details:
   - Account Name (your organization name)
   - Country
4. Create a Container:
   - Container name (your application name)
   - Target platform (Web)
5. Accept the Terms of Service

Note down the following IDs (you'll need these later):
- GTM Container ID (format: `GTM-XXXXXX`)
- GTM Account ID (visible in the URL when viewing the container)
- GTM Workspace ID (usually "1" for the default workspace)
- GTM Numeric Container ID (visible in the URL after `/containers/`)

### 1.2 Enable Built-in Variables

1. In your GTM container, go to "Variables"
2. Click "Configure" under "Built-in Variables"
3. Enable the following:
   - Page URL
   - Page Path
   - Page Hostname
   - Click Classes
   - Click ID

## 2. Google Analytics 4 Setup

### 2.1 Create a GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property
3. Choose "Web" as the platform
4. Fill in your website details
5. Note down the Measurement ID (format: `G-XXXXXXXXXX`)

### 2.2 Link GA4 with GTM

1. In GTM, create a new tag
2. Choose "Google Analytics: GA4 Configuration"
3. Enter your GA4 Measurement ID
4. Set trigger to "All Pages"
5. Save and publish

## 3. Google Cloud Platform Setup

### 3.1 Create a Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down the Project ID

### 3.2 Enable Required APIs

1. Go to "APIs & Services" > "Library"
2. Search for and enable:
   - Tag Manager API
   - Analytics API
3. Wait a few minutes after enabling for the changes to propagate

> **Note**: The Tag Manager API roles will not be available in IAM until the API is enabled and the changes have propagated.

### 3.3 Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Fill in:
   - Service account name (e.g., "gtm-automation")
   - Description
4. Click "Create"
5. Add roles:
   - Tag Manager API Edit Access
6. Click "Done"

### 3.4 Generate and Download Service Account Key

1. Find your service account in the list
2. Click the three dots (⋮) > "Manage keys"
3. Click "Add Key" > "Create new key"
4. Choose JSON format
5. Click "Create"
6. Save the downloaded file securely as `gtm-credentials.json`

### 3.5 Grant GTM Access to Service Account

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Select your container
3. Click "Admin" in the top navigation
4. Under "Container Access", click "User Management"
5. Click the "+" button to add a new user
6. Enter the service account email (format: `name@project-id.iam.gserviceaccount.com`)
7. Select role:
   - Choose "Edit" for full access (recommended for automation)
   - Or "View" for read-only access
8. Click "Add User"
9. Wait a few minutes for permissions to propagate

> **Important**: The service account needs access at both the Account and Container levels:
> 1. Repeat steps 4-8 at the Account level (click "Admin" > "Account Access")
> 2. This ensures the service account can access both the container and its parent account

### 3.6 Secure the Credentials

1. Create a `config` directory in your project root
2. Move `gtm-credentials.json` to the `config` directory
3. Add to `.gitignore`:
   ```
   config/gtm-credentials.json
   ```

### 3.7 Verify API Access

After setting up the service account and granting permissions:

1. Wait 5-10 minutes for all permissions to propagate
2. Run the test script:
   ```bash
   npm run test:gtm
   ```
3. If you get a 403 or 401 error:
   - Verify the Tag Manager API is enabled
   - Check that the service account has both Account and Container level access in GTM
   - Ensure you're using the correct service account email
   - Wait a few more minutes and try again

## 4. Environment Configuration

Add the following to your `.env` file:

```env
VITE_GTM_CONTAINER_ID=GTM-XXXXXX
VITE_GTM_ACCOUNT_ID=1234567890
VITE_GTM_WORKSPACE_ID=1
VITE_GTM_NUMERIC_CONTAINER_ID=1234567890
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

Add these same variables to `.env.example` (with placeholder values) for documentation.

## 5. Link GTM Container with Google Cloud Project

1. In GTM, go to "Admin"
2. Under Container settings, click "Container"
3. Find "Google Cloud Project Number"
4. Click "Edit" and select your GCP project
5. Save changes

## Security Best Practices

1. Never commit credentials to version control
2. Use environment variables for sensitive values
3. Restrict service account permissions to only what's needed
4. Regularly rotate service account keys
5. Monitor API usage in Google Cloud Console

## Troubleshooting

Common issues and solutions:

1. **403 Forbidden**: Ensure the Tag Manager API is enabled
2. **401 Unauthorized**: Check service account permissions
3. **404 Not Found**: Verify container ID and account ID
4. **409 Conflict**: Resource already exists (usually safe to ignore)

## Next Steps

- Set up GTM preview mode for testing
- Configure custom variables and triggers
- Set up event tracking
- Test data flow in GA4 real-time reports 