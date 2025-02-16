import React from 'react';
import { NavigationProvider } from './context/NavigationContext';
import { Navigation } from './components/Navigation';
import { NavigationEditor } from './components/NavigationEditor';

function App() {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="container mx-auto py-8">
          <NavigationEditor />
        </main>
      </div>
    </NavigationProvider>
  );
}

export default App;