export type ConsentCategory = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  cookies: string[];
  detailedDescription: string;
};

export const CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    id: 'necessary',
    name: 'Necessary',
    description: 'Essential cookies for website functionality',
    detailedDescription: 'These cookies are required for the website to function properly. They cannot be disabled.',
    required: true,
    cookies: ['session', 'csrf']
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Cookies for website analytics and performance',
    detailedDescription: 'These cookies help us understand how visitors interact with our website, helping us improve our services. This includes Microsoft Clarity for user behavior analytics.',
    required: false,
    cookies: ['_clarity']
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing and advertising cookies',
    detailedDescription: 'These cookies are used to track visitors across websites to display relevant advertisements.',
    required: false,
    cookies: []
  }
];

class CookieManager {
  private static instance: CookieManager;
  
  private constructor() {}

  public static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  public hasConsent(categoryId: string): boolean {
    const category = CONSENT_CATEGORIES.find(c => c.id === categoryId);
    if (category?.required) return true;
    return localStorage.getItem(`cookie_consent_${categoryId}`) === 'true';
  }

  public setConsent(categoryId: string, value: boolean): void {
    const category = CONSENT_CATEGORIES.find(c => c.id === categoryId);
    if (category?.required) return;
    
    localStorage.setItem(`cookie_consent_${categoryId}`, value.toString());
    if (!value) {
      this.cleanupCookies(categoryId);
    }
  }

  public setAllConsent(value: boolean): void {
    CONSENT_CATEGORIES.forEach(category => {
      if (!category.required) {
        this.setConsent(category.id, value);
      }
    });
  }

  public getConsents(): Record<string, boolean> {
    return CONSENT_CATEGORIES.reduce((acc, category) => ({
      ...acc,
      [category.id]: this.hasConsent(category.id)
    }), {});
  }

  public clearAllConsents(): void {
    CONSENT_CATEGORIES.forEach(category => {
      if (!category.required) {
        localStorage.removeItem(`cookie_consent_${category.id}`);
        this.cleanupCookies(category.id);
      }
    });
  }

  public initializeDefaultConsents(): void {
    CONSENT_CATEGORIES.forEach(category => {
      if (category.required) {
        this.setConsent(category.id, true);
      }
    });
  }

  private cleanupCookies(categoryId: string): void {
    const category = CONSENT_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    category.cookies.forEach(cookieName => {
      const domains = [
        window.location.hostname,
        `.${window.location.hostname}`,
        window.location.hostname.split('.').slice(1).join('.'),
        `.${window.location.hostname.split('.').slice(1).join('.')}`
      ];
      
      domains.forEach(domain => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      });
    });
  }

  public verifyAnalyticsState(): boolean {
    const hasAnalyticsConsent = this.hasConsent('analytics');
    if (!hasAnalyticsConsent) {
      this.cleanupCookies('analytics');
      return false;
    }
    return hasAnalyticsConsent;
  }
}

export const cookieManager = CookieManager.getInstance();