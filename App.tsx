
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ProcessEditor } from './components/ProcessEditor';
import { ProcessList } from './components/ProcessList';
import { ProcessLibrary } from './components/ProcessLibrary';
import { UserGuide } from './components/UserGuide';
import { ProcessModel, ProcessStatus } from './types';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

const INITIAL_DATA: ProcessModel[] = [
  {
    id: '1',
    processId: 'ENF-ADM-001',
    name: 'Ingreso de Paciente en Planta',
    area: 'Hospitalización General',
    responsiblePerson: 'María García (Supervisora)',
    status: ProcessStatus.VALIDATED,
    createdAt: '2023-10-20T08:00:00Z',
    lastModified: '2023-10-25T10:00:00Z',
    objective: 'Estandarizar la recepción del paciente, asignación de cama y valoración inicial de enfermería.',
    description: 'El proceso inicia cuando el paciente llega a la unidad procedente de urgencias o admisión. Incluye la verificación de identidad, colocación de pulsera, valoración inicial (Barthel, Norton), y registro de constantes.',
    triggerEvent: 'Llegada física del paciente a la unidad de enfermería.',
    endEvent: 'Paciente acomodado y plan de cuidados iniciado.',
    mainActivities: [
        { id: 'ma1', description: 'Recepción y verificación de identidad', performer: 'Enfermera' },
        { id: 'ma2', description: 'Acomodación en habitación', performer: 'TCAE / Celador' },
        { id: 'ma3', description: 'Valoración inicial y escalas de riesgo', performer: 'Enfermera' },
        { id: 'ma4', description: 'Toma de constantes vitales', performer: 'TCAE' }
    ],
    digitalizationPriorities: 'Valoración inicial en tablet a pie de cama.',
    references: [
        { id: 'ref1', description: 'Guía de Práctica Clínica sobre Seguridad del Paciente (Ministerio de Sanidad)', url: '#' },
        { id: 'ref2', description: 'Joint Commission International Accreditation Standards for Hospitals', url: '#' }
    ],
    actors: [
      { id: 'a1', role: 'Enfermera', responsibilities: 'Valoración inicial, administración de medicación de ingreso.' },
      { id: 'a2', role: 'TCAE', responsibilities: 'Acomodación, higiene, toma de constantes.' },
      { id: 'a3', role: 'Celador', responsibilities: 'Traslado del paciente y enseres.' }
    ],
    systems: [
      { id: 's1', name: 'HIS (Admission)', functionality: 'Gestión de camas', actors: '', integrationLevel: 'Alto' },
      { id: 's2', name: 'Carpeta de Enfermería (Papel)', functionality: 'Registro de evolutivos', actors: '', integrationLevel: 'Nulo' }
    ],
    kpis: [
      { id: 'k1', name: 'Tiempo de acogida', description: 'Tiempo desde llegada hasta fin de valoración', formula: '', source: 'Manual/HIS', frequency: 'Diario' }
    ],
    diagram: {
        nodes: [
            { id: 'n1', type: 'start', x: 100, y: 100, label: 'Llegada Paciente', laneId: 'a1' },
            { id: 'n2', type: 'task', x: 250, y: 80, label: 'Traslado a Cama', laneId: 'a1' },
            { id: 'n3', type: 'task', x: 450, y: 80, label: 'Valoración Inicial', laneId: 'a1' },
            { id: 'n4', type: 'task', x: 350, y: 280, label: 'Constantes Vitales', laneId: 'a2' },
            { id: 'n5', type: 'end', x: 650, y: 100, label: 'Paciente Ingresado', laneId: 'a1' }
        ],
        edges: [
            { id: 'e1', sourceId: 'n1', targetId: 'n2' },
            { id: 'e2', sourceId: 'n2', targetId: 'n3' },
            { id: 'e3', sourceId: 'n2', targetId: 'n4' },
            { id: 'e4', sourceId: 'n3', targetId: 'n5' }
        ]
    },
    improvements: [
      { id: 'i1', description: 'Duplicidad de datos entre papel y PC', priority: 'Alta', impact: 'Alto', responsible: 'Equipo TIC' }
    ],
    toBe: {
        vision: 'Un proceso 100% digital donde la enfermera realiza la valoración a pie de cama y los datos vitales se vuelcan automáticamente.',
        expectedBenefits: 'Reducción del tiempo de acogida en un 30%. Eliminación de errores de transcripción.',
        gapAnalysis: 'Falta dotación de tablets (hardware) e integración de monitores de constantes (software).',
        transitionPlan: '1. Piloto en ala Norte. 2. Formación personal. 3. Despliegue completo.'
    },
    policies: '',
    contingencyPlan: ''
  },
  {
    id: '2',
    processId: 'ENF-MED-002',
    name: 'Administración de Medicación en Planta',
    area: 'Hospitalización General',
    responsiblePerson: 'Juan Pérez (Supervisor Nocturno)',
    status: ProcessStatus.REVIEW,
    createdAt: '2023-11-05T08:00:00Z',
    lastModified: '2023-11-05T08:00:00Z',
    objective: 'Garantizar los 7 correctos en la administración de fármacos por vía oral e intravenosa.',
    description: 'Proceso crítico que abarca desde la preparación en el carro de medicación hasta el registro tras la administración.',
    triggerEvent: 'Horario de toma prescrito.',
    endEvent: 'Registro de administración completado.',
    mainActivities: [
        { id: 'm1', description: 'Preparación de dosis unitaria', performer: 'Enfermera' },
        { id: 'm2', description: 'Verificación de identidad', performer: 'Enfermera' },
        { id: 'm3', description: 'Administración y educación', performer: 'Enfermera' },
        { id: 'm4', description: 'Registro en el sistema', performer: 'Enfermera' }
    ],
    digitalizationPriorities: 'Lectura de código de barras.',
    references: [],
    actors: [
        { id: 'a1', role: 'Enfermera', responsibilities: 'Gestión total del ciclo de medicación.' }
    ],
    systems: [
      { id: 's1', name: 'GEMA / EHR', functionality: 'Prescripción y Registro', actors: '', integrationLevel: 'Alto' }
    ],
    kpis: [],
    diagram: { nodes: [], edges: [] },
    improvements: [],
    toBe: { vision: '', expectedBenefits: '', gapAnalysis: '', transitionPlan: '' },
    policies: '',
    contingencyPlan: ''
  }
];

const INITIAL_TEMPLATES: ProcessModel[] = [
  { ...INITIAL_DATA[0], id: 'lib-1', processId: 'TMP-001', name: 'Prevención de UPP' },
  { ...INITIAL_DATA[0], id: 'lib-2', processId: 'TMP-002', name: 'Admin. Hemoderivados' },
  { ...INITIAL_DATA[0], id: 'lib-3', processId: 'TMP-003', name: 'Prevención de Caídas' },
  { ...INITIAL_DATA[0], id: 'lib-4', processId: 'TMP-004', name: 'Manejo del Dolor Agudo' },
  { ...INITIAL_DATA[0], id: 'lib-5', processId: 'TMP-005', name: 'Sondaje Vesical' },
  { ...INITIAL_DATA[0], id: 'lib-6', processId: 'TMP-006', name: 'Alta Hospitalaria' },
  { ...INITIAL_DATA[0], id: 'lib-7', processId: 'TMP-007', name: 'Recepción Recién Nacido' },
  { ...INITIAL_DATA[0], id: 'lib-8', processId: 'TMP-008', name: 'Nutrición Enteral SNG' },
  { ...INITIAL_DATA[0], id: 'lib-9', processId: 'TMP-009', name: 'Aislamiento de Contacto' }
];

function AppContent() {
  const [processes, setProcesses] = useState<ProcessModel[]>(() => {
    const stored = localStorage.getItem('nurseflow_processes');
    if (stored) return JSON.parse(stored);
    return INITIAL_DATA;
  });

  const [libraryTemplates] = useState<ProcessModel[]>(INITIAL_TEMPLATES);
  const [currentProcess, setCurrentProcess] = useState<ProcessModel | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('nurseflow_processes', JSON.stringify(processes));
  }, [processes]);

  const handleCreateNew = () => {
    const newId = Date.now().toString();
    const newProcess: ProcessModel = {
      ...INITIAL_DATA[0],
      id: newId,
      processId: 'PRO-NEW',
      name: 'Nuevo Proceso',
      status: ProcessStatus.DRAFT,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      mainActivities: [],
      actors: [],
      systems: [],
      kpis: [],
      improvements: [],
      diagram: { nodes: [], edges: [] }
    };
    setProcesses([newProcess, ...processes]);
    setCurrentProcess(newProcess);
    navigate(`/edit/${newProcess.id}`);
  };

  const handleEdit = (id: string) => {
    const found = processes.find(p => p.id === id);
    if (found) {
      setCurrentProcess(found);
      navigate(`/edit/${id}`);
    }
  };

  const handleSave = (updatedProcess: ProcessModel) => {
    setProcesses(processes.map(p => p.id === updatedProcess.id ? updatedProcess : p));
    setCurrentProcess(null);
    navigate('/list');
  };

  const handleDelete = (id: string) => {
    if(confirm('¿Está seguro de eliminar este proceso?')) {
        setProcesses(processes.filter(p => p.id !== id));
    }
  };

  const handleImport = (template: ProcessModel) => {
      const newProcess = { ...template, id: Date.now().toString(), status: ProcessStatus.DRAFT };
      setProcesses([newProcess, ...processes]);
      setCurrentProcess(newProcess);
      navigate(`/edit/${newProcess.id}`);
  };

  return (
    <Layout onCreateNew={handleCreateNew}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard processes={processes} />} />
        <Route path="/list" element={<ProcessList processes={processes} onEdit={handleEdit} onDelete={handleDelete} onPublish={() => {}} />} />
        <Route path="/library" element={<ProcessLibrary templates={libraryTemplates} onImport={handleImport} onUpload={() => {}} />} />
        <Route path="/guide" element={<UserGuide />} />
        <Route path="/edit/:id" element={currentProcess ? <ProcessEditor process={currentProcess} onSave={handleSave} onCancel={() => navigate('/list')} onPublish={() => {}} /> : <Navigate to="/list" />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
