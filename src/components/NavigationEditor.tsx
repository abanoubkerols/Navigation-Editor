import React from 'react';
import { GripVertical, Eye, EyeOff, Save } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export function NavigationEditor() {
  const { items, updateItemVisibility, updateItemTitle, reorderItems, saveChanges } = useNavigation();
  const [draggedItem, setDraggedItem] = React.useState<number | null>(null);
  const [saveStatus, setSaveStatus] = React.useState<string>('');

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null) return;
    
    if (draggedItem !== index) {
      reorderItems(draggedItem, index);
      setDraggedItem(index);
    }
  };

  const handleSave = () => {
    saveChanges();
    setSaveStatus('Changes saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Navigation Editor</h2>
        <p className="text-gray-600">Customize your navigation items below. Changes are automatically saved to your browser.</p>
      </div>

      <div className="space-y-4">
        {items.sort((a, b) => a.order - b.order).map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="cursor-move">
              <GripVertical className="text-gray-400" />
            </div>
            
            <div className="flex-1">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItemTitle(item.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="text-gray-500 px-3 py-2">
              {item.url}
            </div>

            <button
              onClick={() => updateItemVisibility(item.id, !item.visible)}
              className={`p-2 rounded-md ${
                item.visible 
                  ? 'text-green-600 hover:bg-green-50' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              {item.visible ? <Eye /> : <EyeOff />}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
        {saveStatus && (
          <span className="text-green-600 animate-fade-in">
            {saveStatus}
          </span>
        )}
      </div>
    </div>
  );
}