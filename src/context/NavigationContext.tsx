import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { NavItem, NavChangeEvent } from '../types/navigation';
import { ApiService } from '../services/api';

interface NavigationContextType {
  items: NavItem[];
  updateItemVisibility: (id: string, visible: boolean) => void;
  updateItemTitle: (id: string, title: string) => void;
  reorderItems: (sourceIndex: number, destinationIndex: number) => void;
  saveChanges: () => Promise<void>;
  isSaving: boolean;
}

const STORAGE_KEY = 'navigation-state';

const defaultNavItems: NavItem[] = [
  { id: '1', title: 'Home', url: '/', visible: true, order: 0 },
  { id: '2', title: 'About', url: '/about', visible: true, order: 1 },
  { id: '3', title: 'Services', url: '/services', visible: true, order: 2 },
  { id: '4', title: 'Contact', url: '/contact', visible: true, order: 3 },
];

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface StoredState {
  items: NavItem[];
  changes: NavChangeEvent[];
}

function loadFromLocalStorage(): StoredState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading navigation state:', error);
  }
  return null;
}

function saveToLocalStorage(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving navigation state:', error);
  }
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<NavItem[]>(() => {
    const stored = loadFromLocalStorage();
    return stored?.items || defaultNavItems;
  });
  
  const [changes, setChanges] = useState<NavChangeEvent[]>(() => {
    const stored = loadFromLocalStorage();
    return stored?.changes || [];
  });

  const [isSaving, setIsSaving] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage({ items, changes });
  }, [items, changes]);

  const trackChange = useCallback((event: NavChangeEvent) => {
    setChanges(prev => [...prev, event]);
  }, []);

  const updateItemVisibility = useCallback((id: string, visible: boolean) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, visible } : item
    ));
    
    trackChange({
      type: 'visibility',
      itemId: id,
      timestamp: new Date().toISOString(),
      details: {
        from: !visible,
        to: visible
      }
    });
  }, [trackChange]);

  const updateItemTitle = useCallback((id: string, title: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, title } : item
    ));

    trackChange({
      type: 'title',
      itemId: id,
      timestamp: new Date().toISOString(),
      details: {
        from: items.find(item => item.id === id)?.title,
        to: title
      }
    });
  }, [items, trackChange]);

  const reorderItems = useCallback((sourceIndex: number, destinationIndex: number) => {
    setItems(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      return result.map((item, index) => ({ ...item, order: index }));
    });

    trackChange({
      type: 'reorder',
      itemId: items[sourceIndex].id,
      timestamp: new Date().toISOString(),
      details: {
        from: sourceIndex,
        to: destinationIndex
      }
    });
  }, [items, trackChange]);

  const saveChanges = useCallback(async () => {
    if (changes.length === 0) return;
    
    setIsSaving(true);
    try {
      await ApiService.saveNavigationChanges(items, changes);
      setChanges([]);
      saveToLocalStorage({ items, changes: [] });
    } catch (error) {
      console.error('Failed to save changes:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [items, changes]);

  return (
    <NavigationContext.Provider value={{
      items,
      updateItemVisibility,
      updateItemTitle,
      reorderItems,
      saveChanges,
      isSaving
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
