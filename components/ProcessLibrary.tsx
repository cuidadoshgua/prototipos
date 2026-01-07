import React, { useRef } from 'react';
import { ProcessModel, ProcessStatus, EMPTY_PROCESS } from '../types';
import { BookOpen, Download, ArrowRight, HeartPulse, Stethoscope, Syringe, Pill, Upload } from 'lucide-react';

interface ProcessLibraryProps {
  templates: ProcessModel[];
  onImport: (template: ProcessModel) => void;
  onUpload: (template: ProcessModel) => void;
}

const ICONS = [HeartPulse, Syringe, Stethoscope, Pill];

export const ProcessLibrary: React.FC<ProcessLibraryProps> = ({ templates, onImport, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                // Basic validation
                if (json.name && json.diagram) {
                    const newTemplate: ProcessModel = {
                        ...EMPTY_PROCESS, // Defaults
                        ...json,
                        id: `lib-up-${Date.now()}`,
                        status: ProcessStatus.VALIDATED
                    };
                    onUpload(newTemplate);
                    alert("Proceso subido correctamente a la biblioteca.");
                } else {
                    alert("El archivo no tiene el formato correcto (faltan campos obligatorios).");
                }
            } catch (err) {
                alert("Error al leer el archivo JSON.");
            }
        };
        reader.readAsText(file);
    }
    // Reset
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="bg-teal-900 rounded-xl p-8 text-white mb-8 flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold mb-2">Biblioteca de Procesos Clínicos</h2>
            <p className="text-teal-200 max-w-2xl">
            Acelere su modelado utilizando plantillas estandarizadas basadas en guías de práctica clínica internacionales. 
            Importe un proceso, adáptelo a su realidad local y documente sus variantes.
            </p>
        </div>
        <div className="bg-teal-800 p-4 rounded-lg border border-teal-700">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json" 
                onChange={handleFileChange}
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-white text-teal-900 px-4 py-2 rounded-lg font-bold hover:bg-teal-50 transition-colors"
            >
                <Upload className="h-5 w-5" />
                Subir Nuevo Proceso
            </button>
            <p className="text-xs text-teal-300 mt-2 text-center">Formato .JSON admitido</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
                <div key={template.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="p-6 flex-1">
                        <div className="h-12 w-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-4">
                            <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{template.area}</span>
                            {template.status === ProcessStatus.VALIDATED && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">Validado</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-3">
                            {template.description}
                        </p>
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                        <button 
                            onClick={() => onImport(template)}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-teal-500 hover:text-teal-600 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Importar Plantilla
                        </button>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};