// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY as string

// Add at the top with other class definitions
class CircuitBreaker {
  private failures = new Map<string, number>();
  private lastFailure = new Map<string, number>();
  private readonly threshold = 3;
  private readonly resetTime = 30000; // 30 seconds

  shouldAllow(endpoint: string): boolean {
    const now = Date.now();
    const lastFail = this.lastFailure.get(endpoint) || 0;
    const failures = this.failures.get(endpoint) || 0;

    // Reset after resetTime
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

    if (failures >= this.threshold) {
      console.error(`Circuit breaker triggered for ${endpoint}. Too many failures.`);
    }
  }
}

const circuitBreaker = new CircuitBreaker();

// Request queue implementation
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private maxConcurrent = 3;
  private currentRequests = 0;
  private requestCounts = new Map<string, number>();

  async add<T>(request: () => Promise<T>, endpoint: string): Promise<T> {
    // Check if we're already processing too many of this type of request
    const currentCount = this.requestCounts.get(endpoint) || 0;
    if (currentCount > 5) { // Max 5 pending requests per endpoint
      console.warn(`Too many pending requests for ${endpoint}. Dropping request.`);
      return Promise.reject(new Error('Too many pending requests'));
    }

    // Check circuit breaker
    if (!circuitBreaker.shouldAllow(endpoint)) {
      console.warn(`Circuit breaker active for ${endpoint}. Request blocked.`);
      return Promise.reject(new Error('Circuit breaker active'));
    }

    this.requestCounts.set(endpoint, currentCount + 1);

    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          circuitBreaker.recordFailure(endpoint);
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
        } catch (error) {
          console.error('Request failed:', error);
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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth state change handler
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token has been refreshed');
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'USER_UPDATED') {
    console.log('User updated');
  } else if (event === 'AUTH_ERROR') {
    console.error('Auth error occurred:', session?.error);
    if (session?.error?.message?.includes('Token expired')) {
      console.warn('Session expired, attempting to refresh...');
      supabase.auth.refreshSession();
    } else if (session?.error?.message?.includes('Invalid token')) {
      console.error('Invalid authentication, clearing session...');
      supabase.auth.signOut();
    }
  }
});

// Modified batch requests to use the queue
export const batchRequests = async <T>(
  requests: Promise<T>[],
  batchSize = 2
): Promise<T[]> => {
  const results: T[] = [];
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(promise => 
        promise.catch(error => {
          console.error('Batch request error:', error);
          return null;
        })
      )
    );
    results.push(...batchResults.filter(Boolean));
    if (i + batchSize < requests.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return results;
};
