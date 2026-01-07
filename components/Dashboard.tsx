import React from 'react';
import { ProcessModel, ProcessStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle2, AlertCircle, FileText, Clock } from 'lucide-react';

interface DashboardProps {
  processes: ProcessModel[];
}

export const Dashboard: React.FC<DashboardProps> = ({ processes }) => {
  const statusCounts = {
    [ProcessStatus.DRAFT]: processes.filter(p => p.status === ProcessStatus.DRAFT).length,
    [ProcessStatus.REVIEW]: processes.filter(p => p.status === ProcessStatus.REVIEW).length,
    [ProcessStatus.VALIDATED]: processes.filter(p => p.status === ProcessStatus.VALIDATED).length,
    [ProcessStatus.IMPLEMENTED]: processes.filter(p => p.status === ProcessStatus.IMPLEMENTED).length,
  };

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#94a3b8', '#facc15', '#4ade80', '#2563eb'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Procesos</p>
            <h3 className="text-2xl font-bold text-gray-900">{processes.length}</h3>
          </div>
          <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Borradores</p>
            <h3 className="text-2xl font-bold text-gray-900">{statusCounts[ProcessStatus.DRAFT]}</h3>
          </div>
          <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Validados</p>
            <h3 className="text-2xl font-bold text-gray-900">{statusCounts[ProcessStatus.VALIDATED]}</h3>
          </div>
          <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Prioridad Alta</p>
            <h3 className="text-2xl font-bold text-gray-900">
                {processes.filter(p => p.improvements.some(i => i.priority === 'Alta')).length}
            </h3>
          </div>
          <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado de los Modelados</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Progreso Global</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Instructions Card based on PDF intro */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h4 className="text-blue-900 font-semibold mb-2">Guía Rápida BPMN 2.0 (AS-IS)</h4>
        <p className="text-blue-800 text-sm mb-4">
          Recuerde que el objetivo es documentar la realidad actual ("AS-IS") del proceso, no como debería ser ("TO-BE"). 
          Identifique claramente eventos de inicio (círculo verde) y fin (círculo rojo), así como los roles implicados usando "Carriles" (Lanes).
        </p>
        <div className="flex gap-4 text-sm text-blue-700">
           <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border-2 border-green-500"></div> Evento Inicio</span>
           <span className="flex items-center gap-1"><div className="w-3 h-3 rounded border-2 border-blue-500"></div> Actividad</span>
           <span className="flex items-center gap-1"><div className="w-3 h-3 transform rotate-45 border-2 border-orange-500"></div> Decisión</span>
           <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border-4 border-red-500"></div> Evento Fin</span>
        </div>
      </div>
    </div>
  );
};