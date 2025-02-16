import { NavItem, NavChangeEvent } from '../types/navigation';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ApiService {
  static async saveNavigationChanges(items: NavItem[], changes: NavChangeEvent[]): Promise<void> {
    // Simulate API call
    console.log('Sending to backend:', { items, changes });
    
    // Simulate network delay (1-2 seconds)
    await delay(Math.random() * 1000 + 1000);
    
    // Simulate potential server error (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Server error: Failed to save changes');
    }
  }
}