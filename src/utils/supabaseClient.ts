import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log('supabaseUrl', supabaseUrl)
class CircuitBreaker {
  private failures = new Map<string, number>();
  private lastFailure = new Map<string, number>();
  private readonly threshold = 3;
  private readonly resetTime = 30000;

  shouldAllow(endpoint: string): boolean {
    const now = Date.now();
    const lastFail = this.lastFailure.get(endpoint) || 0;
    const failures = this.failures.get(endpoint) || 0;

    if (now - lastFail > this.resetTime) {
      this.failures.delete(endpoint);
      this.lastFailure.delete(endpoint);
      return true;
    }

    return failures < this.threshold;
  }

  recordFailure(endpoint: string) {
    const failures = (this.failures.get(endpoint) || 0) + 1;
    this.failures.set(endpoint, failures);
    this.lastFailure.set(endpoint, Date.now());
  }
}

class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private maxConcurrent = 3;
  private currentRequests = 0;
  private requestCounts = new Map<string, number>();

  async add<T>(request: () => Promise<T>, endpoint: string): Promise<T> {
    const currentCount = this.requestCounts.get(endpoint) || 0;
    if (currentCount > 5) {
      return Promise.reject(new Error('Too many pending requests'));
    }

    this.requestCounts.set(endpoint, currentCount + 1);

    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          const count = this.requestCounts.get(endpoint) || 1;
          this.requestCounts.set(endpoint, count - 1);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.currentRequests >= this.maxConcurrent) return;
    this.processing = true;

    while (this.queue.length > 0 && this.currentRequests < this.maxConcurrent) {
      const request = this.queue.shift();
      if (request) {
        this.currentRequests++;
        try {
          await request();
        } finally {
          this.currentRequests--;
        }
      }
    }

    this.processing = false;
    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }
}

const requestQueue = new RequestQueue();
const circuitBreaker = new CircuitBreaker();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-client-info': 'apppop',
    },
    fetch: (url, options) => {
      const endpoint = new URL(url).pathname;
      return requestQueue.add(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const requestId = crypto.randomUUID();
        options.headers = {
          ...options.headers,
          'x-request-id': requestId,
        };

        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });

          if (!response.ok) {
            circuitBreaker.recordFailure(endpoint);
          }

          if (response.status === 429) {
            const retryAfter = response.headers.get('retry-after') || '5';
            const delay = parseInt(retryAfter) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetch(url, options);
          }

          return response;
        } finally {
          clearTimeout(timeoutId);
        }
      }, endpoint);
    }
  }
});