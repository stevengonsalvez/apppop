declare global {
  interface Window {
    dataLayer: any[];
  }
}

class TagManager {
  private containerId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.containerId = import.meta.env.VITE_GTM_CONTAINER_ID || '';
  }

  init() {
    if (this.isInitialized || !this.containerId) return;

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

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

    // Push initial event
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    this.isInitialized = true;
    console.log('Google Tag Manager initialized');
  }

  // Push events to dataLayer
  pushEvent(eventName: string, eventParams?: { [key: string]: any }) {
    if (!this.isInitialized) return;
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });
  }

  // Set user properties
  setUser(properties: { userId?: string; email?: string; [key: string]: any }) {
    if (!this.isInitialized) return;
    window.dataLayer.push({
      event: 'set_user_properties',
      user_properties: properties
    });
  }

  // Clear user data on logout
  clearUser() {
    if (!this.isInitialized) return;
    window.dataLayer.push({
      event: 'clear_user_data'
    });
  }
}

export const tagManager = new TagManager(); 
