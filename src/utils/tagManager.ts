/// <reference types="vite/client" />

declare global {
  interface Window {
    dataLayer: any[];
    tagManager: TagManager;
  }
}

class TagManager {
  private containerId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.containerId = import.meta.env.VITE_GTM_CONTAINER_ID || '';
    if (!this.containerId) {
      console.warn('GTM Container ID is not set. Google Tag Manager will not be initialized.');
    }
    if (process.env.NODE_ENV === 'development') {
      window.tagManager = this;
    }
  }

  init() {
    if (this.isInitialized) {
      console.debug('GTM already initialized');
      return;
    }
    
    if (!this.containerId) {
      console.warn('GTM Container ID is missing. Events will not be tracked.');
      return;
    }

    try {
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];

      // Debug GA4 configuration
      const ga4MeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
      if (!ga4MeasurementId) {
        console.error('GA4 Measurement ID is missing. Analytics will not be tracked.');
      } else {
        console.log('🔍 GA4 Configuration:', {
          measurementId: ga4MeasurementId,
          containerId: this.containerId
        });
      }

      // GTM snippet with proper TypeScript types
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${this.containerId}`;
      
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }

      // Push initial event with debug mode
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
        debug_mode: process.env.NODE_ENV === 'development'
      });

      this.isInitialized = true;
      console.log('Google Tag Manager initialized successfully with container ID:', this.containerId);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 To test GTM/GA4:');
        console.log('1. Run: window.tagManager.testGA4Connection()');
        console.log('2. Check GTM Preview mode');
        console.log('3. Check GA4 DebugView and Real-Time reports');
      }
    } catch (error) {
      console.error('Failed to initialize Google Tag Manager:', error);
    }
  }

  // Test GA4 connectivity
  testGA4Connection() {
    if (!this.isInitialized) {
      console.warn('GTM not initialized. Cannot test GA4 connection.');
      return;
    }

    try {
      const ga4MeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
      
      console.log('🔍 Current Configuration:', {
        gtmContainerId: this.containerId,
        ga4MeasurementId,
        isInitialized: this.isInitialized,
        dataLayerExists: !!window.dataLayer,
        dataLayerLength: window.dataLayer?.length || 0
      });

      // Check for ad-blockers
      const checkForBlockers = () => {
        const img = new Image();
        img.src = 'https://www.google-analytics.com/collect?v=1&t=event';
        img.onload = () => console.log('✅ Analytics requests are not blocked');
        img.onerror = () => {
          console.error('❌ Analytics requests are being blocked!');
          console.log('To fix this:');
          console.log('1. Disable ad-blocker for your site');
          console.log('2. Or test in an Incognito window');
          console.log('3. Or whitelist google-analytics.com domain');
        };
      };
      checkForBlockers();

      // Push a test event
      const testEvent = {
        event: 'test_ga4_connection',
        timestamp: new Date().toISOString(),
        test_id: Math.random().toString(36).substring(7),
        debug_mode: true
      };
      
      window.dataLayer.push(testEvent);
      
      console.log('🔍 GA4 Test Event Pushed:', testEvent);
      console.log('To verify this event:');
      console.log('1. Go to Google Analytics');
      console.log('2. Click "Reports" in the left sidebar');
      console.log('3. Click "Real-time"');
      console.log('4. Look for "test_ga4_connection" event in the events list');
      
      // Enhanced network request checking
      const checkAnalyticsRequests = () => {
        // Check Performance API
        const requests = performance.getEntriesByType('resource')
          .filter(r => r.name.includes('google-analytics') || r.name.includes('collect'));
        
        // Use fetch to test if requests are blocked
        fetch('https://www.google-analytics.com/analytics.js', { mode: 'no-cors' })
          .then(() => console.log('✅ Analytics endpoints are accessible'))
          .catch(() => console.error('❌ Analytics endpoints are blocked'));
        
        console.log('Recent analytics requests:', requests);
        
        if (requests.length === 0) {
          console.warn('⚠️ No analytics requests detected. This might be due to:');
          console.log('1. Ad-blocker or privacy extension');
          console.log('2. Network issues');
          console.log('3. Incorrect configuration');
        }
      };
      
      // Check after a short delay to allow requests to be made
      setTimeout(checkAnalyticsRequests, 1000);
      
    } catch (error) {
      console.error('Failed to push GA4 test event:', error);
    }
  }

  // Push events to dataLayer
  pushEvent(eventName: string, eventParams?: { [key: string]: any }) {
    if (!this.isInitialized) {
      console.warn('GTM not initialized. Event not sent:', { eventName, eventParams });
      return;
    }
    
    try {
      const eventData = {
        event: eventName,
        ...eventParams
      };
      window.dataLayer.push(eventData);
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 GTM Event Pushed:', {
          name: eventName,
          params: eventParams,
          dataLayer: window.dataLayer
        });
      }
    } catch (error) {
      console.error('Failed to push GTM event:', { eventName, eventParams, error });
    }
  }

  // Set user properties
  setUser(properties: { userId?: string; email?: string; [key: string]: any }) {
    if (!this.isInitialized) {
      console.warn('GTM not initialized. User properties not set:', properties);
      return;
    }

    try {
      const eventData = {
        event: 'set_user_properties',
        user_properties: properties
      };
      window.dataLayer.push(eventData);
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 GTM User Properties Set:', {
          properties,
          dataLayer: window.dataLayer
        });
      }
    } catch (error) {
      console.error('Failed to set GTM user properties:', { properties, error });
    }
  }

  // Clear user data on logout
  clearUser() {
    if (!this.isInitialized) {
      console.warn('GTM not initialized. User data not cleared.');
      return;
    }

    try {
      window.dataLayer.push({
        event: 'clear_user_data'
      });
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 GTM User Data Cleared');
      }
    } catch (error) {
      console.error('Failed to clear GTM user data:', error);
    }
  }
}

export const tagManager = new TagManager(); 
