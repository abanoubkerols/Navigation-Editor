import { NavItem, NavChangeEvent } from '../types/navigation';

const API_BASE_URL = 'https://api.example.com'; // Simulated API endpoint

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ApiService {
  static async saveNavigationChanges(items: NavItem[], changes: NavChangeEvent[]): Promise<void> {
    // Log the request payload
    console.log('Preparing to send:', { items, changes });
    
    // Simulate network delay (1-2 seconds)
    await delay(Math.random() * 1000 + 1000);
    
    try {
      // Simulate fetch request
      const response = await fetch(`${API_BASE_URL}/api/navigation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-jwt-token'
        },
        body: JSON.stringify({
          items,
          changes,
          timestamp: new Date().toISOString()
        })
      });

      // Simulate random server response
      if (Math.random() < 0.1) {
        throw new Error('Server error: Failed to save changes');
      }

      // Log the response
      console.log('Server response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Simulate server validation
      if (changes.length === 0) {
        throw new Error('No changes to save');
      }

      // Return simulated response
      return Promise.resolve();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}