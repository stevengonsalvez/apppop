declare global {
  interface Window {
    clarity: (command: string, ...args: any[]) => void;
  }
}

class ClarityManager {
  private clarityId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.clarityId = import.meta.env.VITE_CLARITY_ID || '';
  }

  init() {
    if (this.isInitialized || !this.clarityId) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${this.clarityId}`;
    
    script.onload = () => {
      this.isInitialized = true;
      console.log('Clarity initialized');
    };

    document.head.appendChild(script);
  }

  stop() {
    if (!this.isInitialized) return;

    // Remove the Clarity script
    const clarityScript = document.querySelector(`script[src*="clarity.ms/tag"]`);
    if (clarityScript) {
      clarityScript.remove();
    }

    // Clear any existing Clarity cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=').map(c => c.trim());
      if (name.startsWith('_clarity')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });

    this.isInitialized = false;
    console.log('Clarity stopped');
  }
}

export const clarityManager = new ClarityManager(); 