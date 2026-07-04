import { initialBoardData } from '@/lib/dummy-data';
import { Plus } from 'lucide-react';

export function Board() {
  const { columns } = initialBoardData;

  return (
    <div className="flex flex-1 h-full overflow-x-auto overflow-y-hidden p-6 gap-4 bg-gray-50">
      {columns.map((col) => (
        <div key={col.id} className="flex flex-col w-80 shrink-0 h-full bg-white border border-gray-200 rounded-lg">
          
          {/* Column Header */}
          <div className="flex items-center justify-between w-full shrink-0 p-3 border-b border-gray-200">
            {/* Group title and badge together */}
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">{col.title}</h3>
              <span className="flex items-center justify-center px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">0</span>
            </div>
            
            {/* Add Task Button (Static for now) */}
            <button className="p-1 rounded-md text-gray-400">
              <Plus className="w-4 h-4 shrink-0" />
            </button>
          </div>
          
          {/* Column Drop Zone */}
          <div className="flex flex-col flex-1 overflow-y-auto items-center justify-center w-full p-3 py-8">
            <p className="text-xs text-gray-500 leading-relaxed">Drop tasks here</p>
          </div>
        </div>
      ))}
    </div>
  );
}