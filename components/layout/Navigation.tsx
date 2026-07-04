import { LayoutGrid } from 'lucide-react';


export function Navigation() {
  return (
    <nav className="flex flex-col w-full p-2 gap-1 mt-2">
      <button className="flex items-center w-full px-2.5 py-1.5 gap-2  bg-gray-200 text-gray-900 rounded text-sm font-medium">
      <LayoutGrid className="w-4 h-4 shrink-0" />
        <span className="truncate">Kanban Board</span>
        </button>
    </nav >
  );
}