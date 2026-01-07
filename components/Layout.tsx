import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, Settings, Activity, ClipboardList, BookOpen, Book } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onCreateNew: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onCreateNew }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path) 
    ? "bg-teal-800 text-white" 
    : "text-teal-100 hover:bg-teal-800 hover:text-white";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden print:h-auto print:overflow-visible">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-900 shadow-xl flex flex-col print:hidden">
        <div className="p-6 border-b border-teal-800">
          <div className="flex items-center gap-3 text-white">
            <Activity className="h-8 w-8 text-teal-400" />
            <div>
              <h1 className="text-lg font-bold tracking-wide">NurseFlow</h1>
              <p className="text-xs text-teal-300">AS-IS Modeler</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard')}`}>
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link to="/list" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/list')}`}>
            <ClipboardList className="h-5 w-5" />
            <span className="font-medium">Catálogo de Procesos</span>
          </Link>

          <Link to="/library" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/library')}`}>
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Biblioteca</span>
          </Link>

          <Link to="/guide" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/guide')}`}>
            <Book className="h-5 w-5" />
            <span className="font-medium">Guía de Usuario</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-teal-400 uppercase tracking-wider">Acciones</p>
          </div>

          <button 
            onClick={onCreateNew}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-teal-100 hover:bg-teal-800 hover:text-white transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="font-medium">Nuevo Proceso</span>
          </button>
        </nav>

        <div className="p-4 border-t border-teal-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-teal-100 hover:bg-teal-800 hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Configuración</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto print:overflow-visible print:h-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 print:hidden">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.pathname.includes('dashboard') ? 'Panel General' : 
             location.pathname.includes('list') ? 'Inventario de Procesos' : 
             location.pathname.includes('library') ? 'Biblioteca de Plantillas' : 
             location.pathname.includes('guide') ? 'Guía y Metodología' :
             'Editor de Procesos'}
          </h2>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Usuario: Supervisión Enfermería</p>
                <p className="text-xs text-gray-500">Unidad: Hospitalización</p>
             </div>
             <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                SE
             </div>
          </div>
        </header>
        <div className="p-8 print:p-0">
          {children}
        </div>
      </main>
    </div>
  );
};