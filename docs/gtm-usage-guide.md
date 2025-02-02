# Using Google Tag Manager in the Application

This guide explains how to use Google Tag Manager (GTM) in the application, including testing, automation scripts, and implementing event tracking.

## Table of Contents

1. [Testing GTM Setup](#1-testing-gtm-setup)
2. [Automation Scripts](#2-automation-scripts)
3. [Implementing Event Tracking](#3-implementing-event-tracking)
4. [Available Events](#4-available-events)
5. [Testing and Validation](#5-testing-and-validation)

## 1. Testing GTM Setup

### 1.1 Test GTM API Access

Run the test script to verify your GTM setup:

```bash
npm run test:gtm
```

This script will:
- Validate your environment variables
- Test authentication with GTM API
- List available GTM accounts and containers

### 1.2 Preview Mode

1. In GTM interface, click "Preview"
2. Enter your website URL
3. Debug mode will open in a new window
4. Verify that:
   - GA4 Configuration tag fires
   - Custom events are tracked
   - Variables contain correct values

## 2. Automation Scripts

### 2.1 Setup Script

Run the GTM setup script to configure your container:

```bash
npm run setup:gtm
```

This script will create:
- Custom variables
- Triggers for events
- GA4 configuration
- Event tags

### 2.2 Script Components

The setup script (`scripts/setup-gtm.ts`) includes:

1. **Custom Variables**:
   ```typescript
   const customVars = [
     {
       name: 'User ID',
       type: 'v',
       parameter: [{
         type: 'template',
         key: 'name',
         value: 'user_properties.userId'
       }]
     },
     // ... more variables
   ];
   ```

2. **Triggers**:
   ```typescript
   const triggers = [
     {
       name: 'All Pages',
       type: 'pageview'
     },
     {
       name: 'Login Event',
       type: 'customEvent',
       customEventFilter: [{
         type: 'equals',
         parameter: [{
           type: 'template',
           key: 'arg0',
           value: 'login'
         }]
       }]
     },
     // ... more triggers
   ];
   ```

3. **Tags**:
   ```typescript
   const eventTags = [
     {
       name: 'GA4 - Login',
       type: 'gaawe',
       parameter: [
         {
           type: 'template',
           key: 'eventName',
           value: 'login'
         },
         // ... parameters
       ],
       firingTriggerId: [createdTriggers['Login Event']]
     },
     // ... more tags
   ];
   ```

## 3. Implementing Event Tracking

### 3.1 Basic Implementation

Use the `tagManager` utility to push events:

```typescript
import { tagManager } from '../utils/tagManager';

// Track a simple event
tagManager.pushEvent('login', {
  method: 'email',
  success: true
});
```

### 3.2 Common Events

1. **Page Views**:
   ```typescript
   // Automatically tracked by GA4 Configuration tag
   ```

2. **Login Events**:
   ```typescript
   tagManager.pushEvent('login', {
     method: 'email', // or 'google', 'apple', etc.
     success: true,
     error_message?: string
   });
   ```

3. **Profile Updates**:
   ```typescript
   tagManager.pushEvent('profile_update', {
     updated_fields: ['name', 'email', 'avatar']
   });
   ```

4. **E-commerce Events**:
   ```typescript
   tagManager.pushEvent('view_item', {
     items: [{
       item_id: 'SKU_12345',
       item_name: 'Product Name',
       price: 99.99
     }]
   });

   tagManager.pushEvent('begin_checkout', {
     items: cartItems,
     value: totalValue,
     currency: 'USD'
   });
   ```

## 4. Available Events

### 4.1 User Events
- `login`
- `signup`
- `profile_update`
- `logout`

### 4.2 E-commerce Events
- `view_item`
- `add_to_cart`
- `remove_from_cart`
- `begin_checkout`
- `purchase`

### 4.3 Custom Events
Add new events by:
1. Creating a trigger in `setup-gtm.ts`
2. Adding an event tag
3. Implementing the event in code

## 5. Testing and Validation

### 5.1 Development Testing

1. Use GTM Preview mode
2. Check browser console for dataLayer events
3. Verify GA4 DebugView

### 5.2 Production Validation

1. Use GA4 Real-Time reports
2. Check Event reports in GA4
3. Verify User Properties
4. Monitor E-commerce reports

### 5.3 Common Issues

1. **Events not firing**:
   - Check trigger conditions
   - Verify dataLayer push format
   - Check for JavaScript errors

2. **Missing data**:
   - Verify variable names match
   - Check parameter types
   - Ensure required fields are present

3. **Duplicate events**:
   - Check trigger conditions
   - Verify tag firing rules
   - Check for multiple event pushes

## Best Practices

1. **Event Naming**:
   - Use snake_case for event names
   - Follow GA4 recommended events when possible
   - Be consistent with naming conventions

2. **Data Quality**:
   - Validate data before pushing to dataLayer
   - Include all relevant parameters
   - Use appropriate data types

3. **Performance**:
   - Minimize number of variables
   - Use efficient trigger conditions
   - Avoid excessive event firing

4. **Maintenance**:
   - Document custom events
   - Keep setup script updated
   - Regular testing and validation 



## 🐛 Error debugging

### 5.1 404 Error

If you still get a 404 error, it means the service account definitely doesn't have write permissions. In that case:

1. Go to Google Tag Manager UI
2. Navigate to Admin > Container Access
3. Find the service account email: gtm-automation@apppop-449717.iam.gserviceaccount.com
4. Change its permission from "Read" to "Edit" or "Publish"

### 5.2 403 Error

If you get a 403 error, it means the service account has the wrong permissions. In that case:

1. Go to Google Tag Manager UI
2. Navigate to Admin > Container Access
3. Find the service account email: gtm-automation@apppop-449717.iam.gserviceaccount.com
4. Change its permission from "Read" to "Edit" or "Publish"

