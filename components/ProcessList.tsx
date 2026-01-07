import React from 'react';
import { ProcessModel, ProcessStatus } from '../types';
import { Edit2, Trash2, Eye, Share2 } from 'lucide-react';

interface ProcessListProps {
  processes: ProcessModel[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (process: ProcessModel) => void;
}

export const ProcessList: React.FC<ProcessListProps> = ({ processes, onEdit, onDelete, onPublish }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Proceso</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre del Proceso</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Área / Unidad</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Responsable</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha Creación</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {processes.map((process) => (
            <tr key={process.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{process.processId}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{process.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{process.area}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{process.responsiblePerson}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {process.createdAt ? new Date(process.createdAt).toLocaleDateString() : '-'}
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                  ${process.status === 'Validado' ? 'bg-green-100 text-green-700' : 
                    process.status === 'Borrador' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'}`}>
                  {process.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                {process.status === ProcessStatus.VALIDATED && (
                    <button 
                        onClick={() => onPublish(process)} 
                        className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                        title="Publicar en Biblioteca"
                    >
                        <Share2 className="h-4 w-4" />
                    </button>
                )}
                <button onClick={() => onEdit(process.id)} className="text-teal-600 hover:text-teal-800 p-1 hover:bg-teal-50 rounded" title="Editar">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(process.id)} className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded" title="Eliminar">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
          {processes.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                No hay procesos registrados. Comience creando uno nuevo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};