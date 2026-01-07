import React from 'react';
import { Book, Activity, Info, CheckCircle2, AlertTriangle, ArrowRight, MousePointer2, Layers, Sparkles, FileText, Share2 } from 'lucide-react';

export const UserGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <div className="bg-teal-900 rounded-2xl p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Manual de Usuario y Guía Metodológica</h1>
          <p className="text-teal-100 text-lg max-w-2xl">
            Aprende a documentar procesos asistenciales con precisión quirúrgica. NurseFlow combina el estándar BPMN 2.0 con la visión clínica necesaria para la transformación digital.
          </p>
        </div>
        <Activity className="absolute right-[-20px] bottom-[-20px] h-64 w-64 text-teal-800 opacity-50" />
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="#manejo" className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-teal-500 transition-all group">
          <MousePointer2 className="h-8 w-8 text-teal-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-gray-900">Manejo de la App</h3>
          <p className="text-sm text-gray-500">Navegación, guardado y exportación de archivos.</p>
        </a>
        <a href="#bpmn" className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-teal-500 transition-all group">
          <Layers className="h-8 w-8 text-teal-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-gray-900">Simbología BPMN</h3>
          <p className="text-sm text-gray-500">Uso correcto de eventos, tareas y decisiones.</p>
        </a>
        <a href="#metodologia" className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-teal-500 transition-all group">
          <Sparkles className="h-8 w-8 text-teal-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-gray-900">AS-IS vs TO-BE</h3>
          <p className="text-sm text-gray-500">Cómo modelar el hoy y diseñar el mañana digital.</p>
        </a>
      </div>

      {/* App Handling Section */}
      <section id="manejo" className="space-y-6 scroll-mt-24">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
          <div className="bg-teal-100 p-2 rounded-lg text-teal-700"><Info className="h-6 w-6" /></div>
          <h2 className="text-2xl font-bold text-gray-800">1. Manejo de la Aplicación</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Creación y Edición
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Utilice el botón <strong>"Nuevo Proceso"</strong> del menú lateral para iniciar una ficha desde cero, o explore la <strong>"Biblioteca"</strong> para importar plantillas validadas.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-800">
                <strong>Tip:</strong> El sistema guarda los cambios localmente en su navegador, pero se recomienda usar <strong>"Exportar PDF"</strong> para tener copias físicas o para compartir en reuniones.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" /> Validación de Datos
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              NurseFlow no le permitirá guardar un proceso si faltan campos críticos: <strong>ID, Nombre y Objetivo</strong>. Si intenta guardar y hay errores, la aplicación le redirigirá automáticamente a la pestaña correspondiente y resaltará los campos en rojo.
            </p>
          </div>
        </div>
      </section>

      {/* BPMN Section */}
      <section id="bpmn" className="space-y-6 scroll-mt-24">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
          <div className="bg-teal-100 p-2 rounded-lg text-teal-700"><Layers className="h-6 w-6" /></div>
          <h2 className="text-2xl font-bold text-gray-800">2. Guía de Modelado Gráfico</h2>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-600 font-bold">●</div>
              <h5 className="font-bold text-sm">Evento de Inicio</h5>
              <p className="text-xs text-gray-500">¿Qué dispara el proceso? Ej: "Llegada del paciente", "Orden médica recibida". Solo debe haber uno por proceso.</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="w-12 h-8 rounded border-2 border-blue-500 flex items-center justify-center text-blue-600 text-[10px] font-bold">TAREA</div>
              <h5 className="font-bold text-sm">Actividad / Tarea</h5>
              <p className="text-xs text-gray-500">Un paso atómico del proceso. Use verbos de acción. Ej: "Valorar riesgo UPP", "Administrar medicación".</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="w-8 h-8 rotate-45 border-2 border-orange-500 flex items-center justify-center text-orange-600 font-bold">?</div>
              <h5 className="font-bold text-sm">Comuerta (Decisión)</h5>
              <p className="text-xs text-gray-500">Un punto de bifurcación. Siempre debe tener al menos dos caminos de salida etiquetados (Ej: "Sí" / "No").</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-red-500 flex items-center justify-center text-red-600 font-bold">■</div>
              <h5 className="font-bold text-sm">Evento de Fin</h5>
              <p className="text-xs text-gray-500">El resultado final. Ej: "Paciente ingresado", "Alta tramitada".</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3">Uso de Carriles (Swimlanes)</h4>
          <p className="text-sm text-gray-600 mb-4">
            Cada carril representa un <strong>Actor o Rol</strong>. Arrastre las tareas al carril de la persona que las ejecuta físicamente. Esto es vital para detectar cuellos de botella y exceso de pasos entre diferentes profesionales.
          </p>
          <div className="flex gap-2">
            <span className="text-xs bg-white px-3 py-1 border border-gray-300 rounded text-gray-500 italic">Personalice colores para diferenciar áreas críticas</span>
            <span className="text-xs bg-white px-3 py-1 border border-gray-300 rounded text-gray-500 italic">Colapse carriles secundarios para mejorar la lectura</span>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="metodologia" className="space-y-6 scroll-mt-24">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
          <div className="bg-teal-100 p-2 rounded-lg text-teal-700"><Sparkles className="h-6 w-6" /></div>
          <h2 className="text-2xl font-bold text-gray-800">3. Metodología AS-IS vs TO-BE</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-orange-50 rounded-2xl border border-orange-200">
            <h4 className="text-orange-900 font-bold text-xl mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" /> AS-IS: La Realidad
            </h4>
            <ul className="space-y-3 text-sm text-orange-800">
              <li className="flex gap-2"><ArrowRight className="h-4 w-4 shrink-0" /> No documente "lo que dice el protocolo", documente <strong>lo que realmente sucede</strong>.</li>
              <li className="flex gap-2"><ArrowRight className="h-4 w-4 shrink-0" /> Incluya los pasos manuales, las llamadas telefónicas y el registro en papel.</li>
              <li className="flex gap-2"><ArrowRight className="h-4 w-4 shrink-0" /> Identifique fallos en la pestaña <strong>"Análisis y Mejoras"</strong> (Pestaña 5).</li>
            </ul>
          </div>

          <div className="p-8 bg-purple-50 rounded-2xl border border-purple-200">
            <h4 className="text-purple-900 font-bold text-xl mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> TO-BE: El Futuro Digital
            </h4>
            <ul className="space-y-3 text-sm text-purple-800">
              <li className="flex gap-2"><ArrowRight className="h-4 w-4 shrink-0" /> Utilice la <strong>"Guía de Ayuda"</strong> (Pestaña 6) para inspirar su diseño.</li>
              <li className="flex gap-2"><ArrowRight className="h-4 w-4 shrink-0" /> Piense en la eliminación de duplicidades y registros redundantes.</li>
              <li className="flex gap-2"><ArrowRight className="h-4 w-4 shrink-0" /> El TO-BE debe ser ambicioso pero ejecutable con la tecnología actual.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Publishing and Library Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
          <div className="bg-teal-100 p-2 rounded-lg text-teal-700"><Share2 className="h-6 w-6" /></div>
          <h2 className="text-2xl font-bold text-gray-800">4. Compartir y Estandarizar</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Cuando un proceso ha sido validado por el equipo de calidad, puede <strong>"Publicarlo en la Biblioteca"</strong>. Esto permite que otras unidades utilicen su trabajo como referencia, fomentando la estandarización asistencial en toda la organización.
        </p>
      </section>

      {/* Footer Support */}
      <div className="bg-gray-100 p-8 rounded-xl text-center">
        <p className="text-sm text-gray-500">¿Necesitas soporte técnico adicional o ayuda con el modelado avanzado?</p>
        <p className="font-bold text-teal-700 mt-1">Contacte con la Unidad de Calidad y Procesos - Interno 4055</p>
      </div>
    </div>
  );
};