export interface NavItem {
  id: string;
  title: string;
  url: string;
  visible: boolean;
  order: number;
}

export interface NavChangeEvent {
  type: 'visibility' | 'title' | 'reorder';
  itemId: string;
  timestamp: string;
  details: {
    from?: string | number | boolean;
    to: string | number | boolean;
  };
}