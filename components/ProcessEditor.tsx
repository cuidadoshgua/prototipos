
import React, { useState } from 'react';
import { ProcessModel, ProcessStatus, KPI, SystemDependency, ImprovementOpportunity, Actor, BpmnDiagram, MainActivity, ReferenceLink } from '../types';
import { Save, Printer, ArrowLeft, Plus, Trash, FileText, Users, Activity, Database, ShieldAlert, Sparkles, Download, HelpCircle, Lightbulb, Link as LinkIcon } from 'lucide-react';
import { BpmnModeler } from './BpmnModeler';

declare var html2pdf: any;

interface EditorProps {
  process: ProcessModel;
  onSave: (process: ProcessModel) => void;
  onCancel: () => void;
  onPublish: (process: ProcessModel) => void;
}

const TABS = [
  { id: 'general', label: '1. Ficha General', icon: FileText },
  { id: 'actors', label: '2. Actores y Roles', icon: Users },
  { id: 'diagram', label: '3. Modelado AS-IS', icon: Activity },
  { id: 'systems', label: '4. Sistemas y KPIs', icon: Database },
  { id: 'analysis', label: '5. Análisis y Mejoras', icon: ShieldAlert },
  { id: 'tobe', label: '6. Definición TO-BE', icon: Sparkles },
];

export const ProcessEditor: React.FC<EditorProps> = ({ process, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProcessModel>(process);
  const [activeTab, setActiveTab] = useState('general');
  const [isReportMode, setIsReportMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (field: keyof ProcessModel, value: any) => {
    setFormData({ ...formData, [field]: value, lastModified: new Date().toISOString() });
  };

  const handleArrayChange = (field: keyof ProcessModel, index: number, subField: string, value: any) => {
    const list = [...(formData[field] as any[])];
    list[index] = { ...list[index], [subField]: value };
    setFormData({ ...formData, [field]: list, lastModified: new Date().toISOString() });
  };

  const addItem = (field: keyof ProcessModel, emptyItem: any) => {
    setFormData({ ...formData, [field]: [...(formData[field] as any[]), emptyItem], lastModified: new Date().toISOString() });
  };

  const removeItem = (field: keyof ProcessModel, index: number) => {
    const list = [...(formData[field] as any[])];
    list.splice(index, 1);
    setFormData({ ...formData, [field]: list, lastModified: new Date().toISOString() });
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    setIsGenerating(true);
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `NurseFlow_${formData.processId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    html2pdf().set(opt).from(element).save().then(() => setIsGenerating(false)).catch(() => setIsGenerating(false));
  };

  if (isReportMode) {
    return (
      <div className="bg-slate-100 min-h-screen p-8">
        <div className="max-w-4xl mx-auto flex justify-between mb-6 print:hidden">
            <button onClick={() => setIsReportMode(false)} className="bg-white border px-4 py-2 rounded-lg font-bold text-slate-600 flex items-center gap-2 shadow-sm hover:bg-slate-50"><ArrowLeft className="h-4 w-4"/> Edición</button>
            <div className="flex gap-3">
                <button disabled={isGenerating} onClick={handleDownloadPdf} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-colors"><Download className="h-4 w-4"/> {isGenerating ? 'Generando...' : 'Descargar PDF'}</button>
                <button onClick={() => window.print()} className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-teal-700 transition-colors"><Printer className="h-4 w-4"/> Imprimir</button>
            </div>
        </div>

        <div id="report-content" className="max-w-4xl mx-auto bg-white p-12 shadow-2xl rounded-sm">
            {/* Cabecera Pag 1 */}
            <div className="flex justify-between items-start mb-8 border-b-2 border-slate-100 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">{formData.name}</h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {formData.processId}</p>
                </div>
                <div className="text-right">
                    <span className="bg-teal-50 text-teal-700 px-4 py-1 rounded-full text-xs font-black border border-teal-200 uppercase">{formData.status}</span>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Última mod: {new Date(formData.lastModified).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Bloque 1: Info General */}
            <section className="mb-12">
                <h2 className="text-lg font-black text-teal-800 mb-6 uppercase tracking-widest border-l-4 border-teal-600 pl-3">1. Información General</h2>
                <div className="grid grid-cols-2 gap-8 text-sm mb-8">
                    <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Unidad / Área:</p><p className="font-bold text-slate-800">{formData.area}</p></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Evento de Inicio (Trigger):</p><p className="italic text-slate-800 font-medium">{formData.triggerEvent}</p></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Responsable:</p><p className="font-bold text-slate-800">{formData.responsiblePerson}</p></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Evento de Fin:</p><p className="italic text-slate-800 font-medium">{formData.endEvent}</p></div>
                </div>
                <div className="mb-8">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Objetivo:</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-sm text-slate-700">{formData.objective}</div>
                </div>
                <div className="mb-8">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Descripción General:</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{formData.description}</p>
                </div>
                <div className="mb-8">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Evidencia Científica y Referencias:</p>
                    <ul className="list-disc pl-5 text-xs text-blue-700 font-medium space-y-1">
                        {formData.references.map((r, i) => (
                          <li key={i}>
                            {r.description} {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-teal-600 hover:underline">(Link)</a>}
                          </li>
                        ))}
                    </ul>
                </div>
                <div className="mb-8">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-3">Actividades Principales:</p>
                    <table className="w-full border-collapse">
                        <thead><tr className="bg-slate-900 text-white"><th className="p-3 text-left text-[9px] font-black uppercase tracking-widest border border-slate-800">Actividad</th><th className="p-3 text-left text-[9px] font-black uppercase tracking-widest border border-slate-800 w-1/3">Responsable</th></tr></thead>
                        <tbody>{formData.mainActivities.map((act, i) => (<tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}><td className="p-3 text-sm border border-slate-100 font-medium">{act.description}</td><td className="p-3 text-sm font-black border border-slate-100 text-slate-700">{act.performer}</td></tr>))}</tbody>
                    </table>
                </div>
            </section>

            {/* Pag 2: Diagrama y Roles */}
            <div className="page-break pt-12 border-t border-slate-100">
                <h2 className="text-lg font-black text-teal-800 mb-6 uppercase tracking-widest flex items-center gap-2 border-l-4 border-teal-600 pl-3">2. Diagrama de Flujo (AS-IS)</h2>
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 mb-12"><BpmnModeler diagram={formData.diagram} actors={formData.actors} readOnly /></div>
                
                <h2 className="text-lg font-black text-teal-800 mb-6 uppercase tracking-widest flex items-center gap-2 border-l-4 border-teal-600 pl-3">3. Matriz de Roles</h2>
                <table className="w-full border-collapse">
                    <thead><tr className="bg-slate-800 text-white"><th className="p-4 text-left text-[9px] font-black uppercase tracking-widest w-1/4">Rol / Perfil</th><th className="p-4 text-left text-[9px] font-black uppercase tracking-widest">Responsabilidades Principales</th></tr></thead>
                    <tbody>{formData.actors.map((a, i) => (<tr key={i} className="border-b"><td className="p-4 text-sm font-black text-slate-900" style={{borderLeft: `10px solid ${a.color || '#e2e8f0'}`}}>{a.role}</td><td className="p-4 text-sm text-slate-600 leading-relaxed">{a.responsibilities}</td></tr>))}</tbody>
                </table>
            </div>

            {/* Pag 3: Sistemas, Mejoras y TO-BE */}
            <div className="page-break pt-12 border-t border-slate-100 grid grid-cols-2 gap-12">
                <section>
                    <h2 className="text-lg font-black text-teal-800 mb-6 uppercase tracking-widest border-l-4 border-teal-600 pl-3">4. Sistemas (IT)</h2>
                    <div className="space-y-3">
                        {formData.systems.map((s, i) => (
                            <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                                <div><p className="text-sm font-black text-slate-800">{s.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{s.functionality}</p></div>
                                <span className={`text-[9px] font-black px-2 py-1 rounded border ${s.integrationLevel === 'Alto' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-500'}`}>Int: {s.integrationLevel}</span>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-lg font-black text-teal-800 mb-6 uppercase tracking-widest border-l-4 border-teal-600 pl-3">5. Indicadores (KPIs)</h2>
                    <div className="space-y-3">
                        {formData.kpis.map((k, i) => (
                            <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                <p className="text-sm font-black text-slate-800">{k.name}</p>
                                <p className="text-[10px] text-slate-500 italic mt-1">{k.description}</p>
                                <div className="flex gap-4 mt-2 text-[9px] font-black text-slate-400 uppercase"><span>Frec: {k.frequency}</span><span>Fuente: {k.source}</span></div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <section className="mt-12">
                <h2 className="text-lg font-black text-teal-800 mb-6 uppercase tracking-widest border-l-4 border-teal-600 pl-3">6. Oportunidades de Mejora</h2>
                <div className="space-y-4">
                    {formData.improvements.map((imp, i) => (
                        <div key={i} className="p-4 border-l-4 border-orange-400 bg-orange-50/30 rounded-r-xl">
                            <p className="text-sm font-bold text-slate-800">{imp.description}</p>
                            <p className="text-[10px] text-orange-700 font-black uppercase mt-1">Impacto: {imp.impact} | Responsable: {imp.responsible}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-12 bg-white p-10 rounded-3xl border-2 border-teal-600 shadow-sm">
                <h2 className="text-xl font-black text-teal-800 mb-8 uppercase tracking-widest flex items-center gap-3"><Sparkles className="h-6 w-6 text-teal-500"/> 7. Visión Futura (TO-BE)</h2>
                <div className="space-y-8">
                    <div><p className="text-[10px] font-black text-teal-600 uppercase mb-2 border-l-4 border-teal-600 pl-3">Visión del Proceso:</p><p className="text-base text-slate-800 font-bold italic">{formData.toBe.vision}</p></div>
                    <div className="grid grid-cols-2 gap-8">
                        <div><p className="text-[10px] font-black text-teal-600 uppercase mb-2 border-l-4 border-teal-600 pl-3">Beneficios Esperados:</p><p className="text-sm text-slate-600 font-medium">{formData.toBe.expectedBenefits}</p></div>
                        <div><p className="text-[10px] font-black text-teal-600 uppercase mb-2 border-l-4 border-teal-600 pl-3">Análisis de Brechas (Gap):</p><p className="text-sm text-slate-600 font-medium">{formData.toBe.gapAnalysis}</p></div>
                    </div>
                    <div><p className="text-[10px] font-black text-teal-600 uppercase mb-2 border-l-4 border-teal-600 pl-3">Plan de Transición:</p><p className="text-sm text-slate-600 font-medium">{formData.toBe.transitionPlan}</p></div>
                </div>
                <div className="mt-10 pt-6 border-t border-teal-100 text-center text-[9px] text-slate-400 font-black uppercase tracking-widest">Generado por NurseFlow AS-IS Modeler | {new Date().toLocaleString()}</div>
            </section>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-[calc(100vh-140px)]">
      <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-800">{formData.processId || 'Nuevo'} - {formData.name}</h3>
        <div className="flex gap-2">
            <button onClick={() => setIsReportMode(true)} className="px-4 py-2 text-sm border bg-white rounded flex items-center gap-2 hover:bg-slate-100 font-bold shadow-sm transition-all"><Printer className="h-4 w-4"/> Vista Reporte / PDF</button>
            <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 font-medium">Cancelar</button>
            <button onClick={() => onSave(formData)} className="px-6 py-2 bg-teal-600 text-white rounded flex items-center gap-2 hover:bg-teal-700 font-bold shadow-sm transition-all"><Save className="h-4 w-4"/> Guardar Cambios</button>
        </div>
      </div>

      <div className="flex border-b px-2 bg-white overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${activeTab === tab.id ? 'border-teal-600 text-teal-800 bg-teal-50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
        {activeTab === 'general' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm grid grid-cols-2 gap-4">
                <div className="col-span-1"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ID Proceso*</label><input type="text" value={formData.processId} onChange={e => handleChange('processId', e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-100 outline-none" /></div>
                <div className="col-span-1"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombre del Proceso*</label><input type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-100 outline-none" /></div>
                <div className="col-span-1"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Área / Unidad</label><input type="text" value={formData.area} onChange={e => handleChange('area', e.target.value)} className="w-full p-2 border rounded" /></div>
                <div className="col-span-1"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Responsable</label><input type="text" value={formData.responsiblePerson} onChange={e => handleChange('responsiblePerson', e.target.value)} className="w-full p-2 border rounded" /></div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Disparador (Evento Inicio)</label><input type="text" value={formData.triggerEvent} onChange={e => handleChange('triggerEvent', e.target.value)} className="w-full p-2 border rounded" /></div>
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Evento de Fin</label><input type="text" value={formData.endEvent} onChange={e => handleChange('endEvent', e.target.value)} className="w-full p-2 border rounded" /></div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Objetivo*</label><textarea value={formData.objective} onChange={e => handleChange('objective', e.target.value)} className="w-full p-2 border rounded h-20 text-sm" /></div>
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Descripción General (Narrativa)</label><textarea value={formData.description} onChange={e => handleChange('description', e.target.value)} className="w-full p-2 border rounded h-24 text-sm" /></div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Evidencia Científica y Referencias</h4>
                {formData.references.map((r, i) => (
                    <div key={i} className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-slate-400" />
                            <input type="text" value={r.description} onChange={e => handleArrayChange('references', i, 'description', e.target.value)} className="w-full p-2 border rounded text-xs bg-white" placeholder="Descripción de la referencia..." />
                          </div>
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-3 w-3 text-slate-400" />
                            <input type="text" value={r.url} onChange={e => handleArrayChange('references', i, 'url', e.target.value)} className="w-full p-2 border rounded text-xs bg-white" placeholder="URL opcional (http://...)" />
                          </div>
                        </div>
                        <button onClick={() => removeItem('references', i)} className="p-1 text-red-300 hover:text-red-500 transition-colors"><Trash className="h-4 w-4"/></button>
                    </div>
                ))}
                <button onClick={() => addItem('references', {id: Date.now().toString(), description: '', url: ''})} className="text-teal-600 font-bold text-xs flex items-center gap-1 hover:text-teal-700 transition-colors"><Plus className="h-4 w-4"/> Añadir Referencia</button>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Secuencia de Actividades</h4>
                {formData.mainActivities.map((act, i) => (
                    <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded">
                        <input type="text" value={act.description} onChange={e => handleArrayChange('mainActivities', i, 'description', e.target.value)} className="flex-[2] p-2 border rounded text-xs" placeholder="Actividad..." />
                        <input type="text" value={act.performer} onChange={e => handleArrayChange('mainActivities', i, 'performer', e.target.value)} className="flex-1 p-2 border rounded text-xs font-bold" placeholder="Responsable..." />
                        <button onClick={() => removeItem('mainActivities', i)}><Trash className="h-4 w-4 text-red-300"/></button>
                    </div>
                ))}
                <button onClick={() => addItem('mainActivities', {id: Date.now().toString(), description: '', performer: ''})} className="text-teal-600 font-bold text-xs flex items-center gap-1"><Plus className="h-4 w-4"/> Añadir Actividad</button>
            </div>
          </div>
        )}

        {activeTab === 'actors' && (
          <div className="max-w-4xl mx-auto space-y-4">
             {formData.actors.map((actor, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border flex gap-4 items-center shadow-sm">
                   <div className="flex-1"><label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Rol / Perfil</label><input type="text" value={actor.role} onChange={e => handleArrayChange('actors', idx, 'role', e.target.value)} className="w-full p-2 border rounded font-bold text-teal-800" /></div>
                   <div className="flex-[2]"><label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Responsabilidades</label><input type="text" value={actor.responsibilities} onChange={e => handleArrayChange('actors', idx, 'responsibilities', e.target.value)} className="w-full p-2 border rounded" /></div>
                   <button onClick={() => removeItem('actors', idx)} className="mt-5 p-2 text-red-300 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                </div>
             ))}
             <button onClick={() => addItem('actors', { id: Date.now().toString(), role: '', responsibilities: '', color: '#ffffff' })} className="w-full py-4 border-2 border-dashed border-teal-200 rounded-xl text-teal-600 font-bold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"><Plus className="h-5 w-5"/> Añadir Profesional al Análisis</button>
          </div>
        )}

        {activeTab === 'diagram' && (
            <div className="h-full bg-white rounded-xl border shadow-sm p-2">
                <BpmnModeler 
                    diagram={formData.diagram} actors={formData.actors} 
                    onChange={d => handleChange('diagram', d)} 
                    onActorChange={(id, changes) => {const idx = formData.actors.findIndex(a => a.id === id); if(idx !== -1) handleArrayChange('actors', idx, Object.keys(changes)[0] as any, Object.values(changes)[0]);}} 
                    onReorderActors={na => handleChange('actors', na)} 
                />
            </div>
        )}

        {activeTab === 'systems' && (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-4">Sistemas e Interoperabilidad (IT)</h4>
                    {formData.systems.map((s, i) => (
                        <div key={i} className="flex gap-2 items-center mb-3">
                            <input type="text" value={s.name} onChange={e => handleArrayChange('systems', i, 'name', e.target.value)} className="flex-1 p-2 border rounded text-xs font-bold" placeholder="Nombre Sistema (Ej: HIS)" />
                            <input type="text" value={s.functionality} onChange={e => handleArrayChange('systems', i, 'functionality', e.target.value)} className="flex-1 p-2 border rounded text-xs" placeholder="Uso..." />
                            <select value={s.integrationLevel} onChange={e => handleArrayChange('systems', i, 'integrationLevel', e.target.value)} className="p-2 border rounded text-xs"><option>Alto</option><option>Medio</option><option>Bajo</option><option>Nulo</option></select>
                            <button onClick={() => removeItem('systems', i)}><Trash className="h-4 w-4 text-red-300"/></button>
                        </div>
                    ))}
                    <button onClick={() => addItem('systems', {id: Date.now().toString(), name: '', functionality: '', actors: '', integrationLevel: 'Medio'})} className="text-teal-600 font-bold text-xs flex items-center gap-1 transition-colors"><Plus className="h-4 w-4"/> Añadir Sistema</button>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-4">Indicadores de Proceso (KPIs)</h4>
                    {formData.kpis.map((k, i) => (
                        <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded mb-3 border border-slate-100">
                            <input type="text" value={k.name} onChange={e => handleArrayChange('kpis', i, 'name', e.target.value)} className="col-span-1 p-2 border rounded text-xs font-bold bg-white" placeholder="Nombre KPI" />
                            <input type="text" value={k.frequency} onChange={e => handleArrayChange('kpis', i, 'frequency', e.target.value)} className="col-span-1 p-2 border rounded text-xs bg-white" placeholder="Frecuencia (Ej: Diario)" />
                            <input type="text" value={k.source} onChange={e => handleArrayChange('kpis', i, 'source', e.target.value)} className="col-span-2 p-2 border rounded text-xs bg-white" placeholder="Fuente de datos (Ej: HIS / Manual)" />
                            <input type="text" value={k.description} onChange={e => handleArrayChange('kpis', i, 'description', e.target.value)} className="col-span-2 p-2 border rounded text-xs bg-white" placeholder="Descripción de la métrica..." />
                            <div className="col-span-2 flex justify-end"><button onClick={() => removeItem('kpis', i)} className="text-red-400 p-1 hover:bg-red-50 rounded transition-colors"><Trash className="h-4 w-4"/></button></div>
                        </div>
                    ))}
                    <button onClick={() => addItem('kpis', {id: Date.now().toString(), name: '', description: '', formula: '', source: '', frequency: ''})} className="text-teal-600 font-bold text-xs flex items-center gap-1 transition-colors"><Plus className="h-4 w-4"/> Añadir Indicador</button>
                </div>
            </div>
        )}

        {activeTab === 'analysis' && (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-200">
                    <h4 className="text-orange-900 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><ShieldAlert className="h-5 w-5"/> 6. Oportunidades de Mejora</h4>
                    {formData.improvements.map((imp, i) => (
                        <div key={i} className="bg-white p-4 border border-orange-200 rounded-xl mb-3 flex gap-4 items-start shadow-sm">
                            <div className="flex-1 space-y-2">
                                <input className="w-full p-2 text-sm font-bold bg-orange-50/20 border-none rounded" value={imp.description} onChange={e => handleArrayChange('improvements', i, 'description', e.target.value)} placeholder="Deficiencia detectada..." />
                                <div className="flex gap-4">
                                    <div className="flex-1"><label className="text-[9px] font-black uppercase text-slate-400 block">Impacto</label><select className="w-full p-1 border rounded text-xs" value={imp.impact} onChange={e => handleArrayChange('improvements', i, 'impact', e.target.value)}><option>Alto</option><option>Medio</option><option>Bajo</option></select></div>
                                    <div className="flex-1"><label className="text-[9px] font-black uppercase text-slate-400 block">Responsable</label><input className="w-full p-1 border rounded text-xs" value={imp.responsible} onChange={e => handleArrayChange('improvements', i, 'responsible', e.target.value)} placeholder="Ej: Equipo TIC" /></div>
                                </div>
                            </div>
                            <button onClick={() => removeItem('improvements', i)} className="p-2 text-red-300 hover:text-red-500 transition-colors"><Trash className="h-4 w-4"/></button>
                        </div>
                    ))}
                    <button onClick={() => addItem('improvements', {id: Date.now().toString(), description: '', priority: 'Media', impact: 'Medio', responsible: ''})} className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold text-xs shadow-md hover:bg-orange-700 transition-colors flex items-center gap-2"><Plus className="h-4 w-4"/> Registrar Punto Crítico</button>
                </div>
            </div>
        )}

        {activeTab === 'tobe' && (
            <div className="max-w-4xl mx-auto flex gap-8">
                <div className="flex-1 space-y-8">
                    <div className="bg-white p-8 rounded-3xl border-2 border-teal-600 shadow-sm">
                        <h4 className="text-xl font-black text-teal-800 mb-8 flex items-center gap-3 uppercase tracking-widest"><Sparkles className="h-6 w-6 text-teal-500"/> Visión de Futuro Digital (TO-BE)</h4>
                        <div className="space-y-8">
                            <div><label className="block text-[10px] font-black text-teal-600 uppercase mb-3 border-l-4 border-teal-600 pl-3">Visión del Proceso Ideal</label><textarea className="w-full p-5 bg-teal-50/20 border-2 border-teal-50 rounded-xl text-slate-800 font-bold italic text-base outline-none focus:ring-4 focus:ring-teal-50 transition-all" value={formData.toBe.vision} onChange={e => handleChange('toBe', {...formData.toBe, vision: e.target.value})} rows={5} placeholder="Ej: Un proceso 100% digital donde..." /></div>
                            <div className="grid grid-cols-1 gap-6">
                                <div><label className="block text-[10px] font-black text-teal-600 uppercase mb-2 border-l-4 border-teal-600 pl-3">Beneficios Esperados</label><textarea className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={formData.toBe.expectedBenefits} onChange={e => handleChange('toBe', {...formData.toBe, expectedBenefits: e.target.value})} rows={3} /></div>
                                <div><label className="block text-[10px] font-black text-teal-600 uppercase mb-2 border-l-4 border-teal-600 pl-3">Análisis de Brechas (Gap Analysis)</label><textarea className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={formData.toBe.gapAnalysis} onChange={e => handleChange('toBe', {...formData.toBe, gapAnalysis: e.target.value})} rows={3} /></div>
                                <div><label className="block text-[10px] font-black text-teal-600 uppercase mb-2 border-l-4 border-teal-600 pl-3">Plan de Transición</label><textarea className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={formData.toBe.transitionPlan} onChange={e => handleChange('toBe', {...formData.toBe, transitionPlan: e.target.value})} rows={3} /></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-72 space-y-4 shrink-0">
                    <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100">
                        <h5 className="font-black text-teal-800 text-[11px] uppercase tracking-widest mb-4 flex items-center gap-2"><HelpCircle className="h-4 w-4 text-teal-600"/> Metodología TO-BE</h5>
                        <p className="text-[11px] text-teal-900/60 leading-relaxed italic border-b border-teal-200 pb-3 mb-3">Diseñe eliminando el papel. Sustituya tareas manuales por alertas automáticas y movilidad.</p>
                        <p className="text-[11px] text-teal-900/60 leading-relaxed italic">Identifique qué datos deben integrarse desde el HIS para evitar la doble entrada.</p>
                    </div>
                    <div className="bg-slate-100 p-6 rounded-2xl flex items-center gap-3"><Lightbulb className="h-5 w-5 text-orange-400 shadow-sm"/><p className="text-[10px] font-bold text-slate-500">Este análisis sirve de base para los requisitos técnicos y la parametrización de la EHR.</p></div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
