
import React, { useState, useRef } from 'react';
import { BpmnDiagram, BpmnNode, BpmnEdge, BpmnNodeType, Actor } from '../types';
import { MousePointer2, Circle, Square, Diamond, ArrowRight, Trash2, ChevronUp, ChevronDown, Palette } from 'lucide-react';

interface BpmnModelerProps {
  diagram: BpmnDiagram;
  actors: Actor[];
  onChange?: (diagram: BpmnDiagram) => void;
  onActorChange?: (actorId: string, changes: Partial<Actor>) => void;
  onReorderActors?: (newActors: Actor[]) => void;
  readOnly?: boolean;
}

const NODE_WIDTH = 120;
const NODE_HEIGHT = 80;
const EVENT_SIZE = 40;
const DEFAULT_LANE_HEIGHT = 180;
const LANE_COLORS = ['#ffffff', '#f0fdfa', '#f0f9ff', '#fefce8', '#fff1f2', '#f5f3ff'];

export const BpmnModeler: React.FC<BpmnModelerProps> = ({ 
  diagram, 
  actors, 
  onChange, 
  onActorChange, 
  onReorderActors,
  readOnly = false 
}) => {
  const [mode, setMode] = useState<'select' | 'connect' | 'add'>('select');
  const [addType, setAddType] = useState<BpmnNodeType>('task');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [dragNode, setDragNode] = useState<{ id: string, offsetX: number, offsetY: number } | null>(null);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const lanes = actors.length > 0 ? actors : [{ id: 'default', role: 'Sin Asignar', responsibilities: '', color: '#ffffff' }];

  const getLaneLayout = () => {
      let currentY = 0;
      return lanes.map(lane => {
          const height = DEFAULT_LANE_HEIGHT;
          const y = currentY;
          currentY += height;
          return { ...lane, y, height };
      });
  };
  
  const laneLayout = getLaneLayout();
  const totalHeight = Math.max(600, laneLayout[laneLayout.length - 1].y + laneLayout[laneLayout.length - 1].height);

  const handleSvgClick = (e: React.MouseEvent) => {
    if (readOnly || e.defaultPrevented) return;

    if (mode === 'add' && svgRef.current && onChange) {
      const pt = svgRef.current.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
      
      let laneId = lanes[0].id;
      for (const l of laneLayout) {
          if (svgP.y >= l.y && svgP.y < l.y + l.height) { laneId = l.id; break; }
      }

      const newNode: BpmnNode = {
        id: `n-${Date.now()}`,
        type: addType,
        x: svgP.x,
        y: svgP.y,
        label: addType === 'start' ? 'Inicio' : addType === 'end' ? 'Fin' : 'Tarea',
        laneId
      };
      onChange({ ...diagram, nodes: [...diagram.nodes, newNode] });
      setMode('select');
    } else {
        setSelectedNodeId(null);
        setConnectionStart(null);
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (readOnly) return;
    e.stopPropagation();
    
    if (mode === 'connect' && onChange) {
      if (!connectionStart) {
        setConnectionStart(nodeId);
      } else if (connectionStart !== nodeId) {
        const newEdge: BpmnEdge = { id: `e-${Date.now()}`, sourceId: connectionStart, targetId: nodeId };
        onChange({ ...diagram, edges: [...diagram.edges, newEdge] });
        setConnectionStart(null);
      }
    } else if (mode === 'select') {
      setSelectedNodeId(nodeId);
      const node = diagram.nodes.find(n => n.id === nodeId);
      if (node && svgRef.current) {
        const pt = svgRef.current.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
        setDragNode({ id: nodeId, offsetX: svgP.x - node.x, offsetY: svgP.y - node.y });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragNode && svgRef.current && onChange) {
      const pt = svgRef.current.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
      
      const updatedNodes = diagram.nodes.map(n => {
        if (n.id === dragNode.id) {
            let laneId = n.laneId;
            for (const l of laneLayout) {
                if (svgP.y >= l.y && svgP.y < l.y + l.height) { laneId = l.id; break; }
            }
            return { ...n, x: svgP.x - dragNode.offsetX, y: svgP.y - dragNode.offsetY, laneId };
        }
        return n;
      });
      onChange({ ...diagram, nodes: updatedNodes });
    }
  };

  const renderNodeShape = (node: BpmnNode) => {
    const isSel = selectedNodeId === node.id || connectionStart === node.id;
    const stroke = isSel ? "#0d9488" : "#475569";
    const sw = isSel ? 3 : 2;

    switch (node.type) {
      case 'start': return <circle r={EVENT_SIZE/2} fill="#dcfce7" stroke="#16a34a" strokeWidth={sw} />;
      case 'end': return <circle r={EVENT_SIZE/2} fill="#fee2e2" stroke="#dc2626" strokeWidth={4} />;
      case 'gateway': return <polygon points="0,-30 30,0 0,30 -30,0" fill="#fff7ed" stroke="#ea580c" strokeWidth={sw} />;
      default: return <rect x={-NODE_WIDTH/2} y={-NODE_HEIGHT/2} width={NODE_WIDTH} height={NODE_HEIGHT} rx="8" fill="white" stroke={stroke} strokeWidth={sw} />;
    }
  };

  return (
    <div className={`flex flex-col h-[600px] border border-slate-300 rounded-xl overflow-hidden bg-slate-50 ${readOnly ? 'border-none h-auto shadow-none' : 'shadow-inner'}`}>
      {!readOnly && (
        <div className="bg-white border-b p-3 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-1">
            <button onClick={() => setMode('select')} className={`p-2 rounded transition-colors ${mode === 'select' ? 'bg-teal-100 text-teal-700' : 'hover:bg-slate-100'}`} title="Seleccionar"><MousePointer2 className="h-4 w-4"/></button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button onClick={() => {setMode('add'); setAddType('start');}} className={`p-2 rounded transition-colors ${mode === 'add' && addType === 'start' ? 'bg-green-100' : 'hover:bg-slate-100'}`} title="Añadir Inicio"><Circle className="h-4 w-4 text-green-600"/></button>
            <button onClick={() => {setMode('add'); setAddType('task');}} className={`p-2 rounded transition-colors ${mode === 'add' && addType === 'task' ? 'bg-blue-100' : 'hover:bg-slate-100'}`} title="Añadir Tarea"><Square className="h-4 w-4 text-blue-600"/></button>
            <button onClick={() => {setMode('add'); setAddType('gateway');}} className={`p-2 rounded transition-colors ${mode === 'add' && addType === 'gateway' ? 'bg-orange-100' : 'hover:bg-slate-100'}`} title="Añadir Decisión"><Diamond className="h-4 w-4 text-orange-600"/></button>
            <button onClick={() => {setMode('add'); setAddType('end');}} className={`p-2 rounded transition-colors ${mode === 'add' && addType === 'end' ? 'bg-red-100' : 'hover:bg-slate-100'}`} title="Añadir Fin"><Circle className="h-4 w-4 text-red-600 fill-red-50"/></button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button onClick={() => setMode('connect')} className={`p-2 rounded transition-colors ${mode === 'connect' ? 'bg-teal-100 text-teal-700' : 'hover:bg-slate-100'}`} title="Modo Conexión"><ArrowRight className="h-4 w-4"/></button>
          </div>
          {selectedNodeId && (
            <div className="flex items-center gap-2">
              <input type="text" className="text-xs border rounded px-2 py-1.5 w-48 focus:ring-2 focus:ring-teal-100 outline-none" placeholder="Etiqueta..." value={diagram.nodes.find(n => n.id === selectedNodeId)?.label || ''} onChange={e => onChange?.({...diagram, nodes: diagram.nodes.map(n => n.id === selectedNodeId ? {...n, label: e.target.value} : n)})} />
              <button onClick={() => {onChange?.({...diagram, nodes: diagram.nodes.filter(n => n.id !== selectedNodeId), edges: diagram.edges.filter(e => e.sourceId !== selectedNodeId && e.targetId !== selectedNodeId)}); setSelectedNodeId(null);}} className="text-red-500 p-2 hover:bg-red-50 rounded" title="Eliminar"><Trash2 className="h-4 w-4"/></button>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-auto bg-white relative">
        <svg ref={svgRef} width="2000" height={totalHeight} onMouseDown={handleSvgClick} onMouseMove={handleMouseMove} onMouseUp={() => setDragNode(null)} className={readOnly ? 'pointer-events-none' : 'cursor-crosshair'}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
          </defs>

          {laneLayout.map((lane, idx) => (
            <g key={lane.id} transform={`translate(0, ${lane.y})`}>
              <rect width="2000" height={lane.height} fill={lane.color || "#ffffff"} stroke="#e2e8f0" />
              <rect width="50" height={lane.height} fill="#f8fafc" stroke="#cbd5e1" />
              <text x="25" y={lane.height/2} transform={`rotate(-90, 25, ${lane.height/2})`} textAnchor="middle" className="text-[10px] font-black uppercase tracking-widest fill-slate-400 select-none pointer-events-none">{lane.role}</text>
              {!readOnly && (
                <g transform="translate(15, 10)">
                  {idx > 0 && <g className="cursor-pointer text-slate-300 hover:text-teal-600 transition-colors" onClick={e => {e.stopPropagation(); const na = [...actors]; [na[idx], na[idx-1]] = [na[idx-1], na[idx]]; onReorderActors?.(na);}}><ChevronUp className="h-4 w-4"/></g>}
                  {idx < lanes.length -1 && <g transform="translate(0, 20)" className="cursor-pointer text-slate-300 hover:text-teal-600 transition-colors" onClick={e => {e.stopPropagation(); const na = [...actors]; [na[idx], na[idx+1]] = [na[idx+1], na[idx]]; onReorderActors?.(na);}}><ChevronDown className="h-4 w-4"/></g>}
                  <g transform={`translate(0, ${lane.height - 45})`} className="cursor-pointer text-slate-300 hover:text-teal-600 transition-colors" onClick={e => {e.stopPropagation(); const ci = LANE_COLORS.indexOf(lane.color || '#ffffff'); onActorChange?.(lane.id, {color: LANE_COLORS[(ci+1)%LANE_COLORS.length]});}}><Palette className="h-4 w-4"/></g>
                </g>
              )}
            </g>
          ))}

          {diagram.edges.map(e => {
            const s = diagram.nodes.find(n => n.id === e.sourceId);
            const t = diagram.nodes.find(n => n.id === e.targetId);
            if(!s || !t) return null;
            return <line key={e.id} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />;
          })}

          {diagram.nodes.map(n => (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`} onMouseDown={e => handleNodeMouseDown(e, n.id)} className="cursor-move group">
              {renderNodeShape(n)}
              <text y={n.type === 'task' ? 5 : 35} textAnchor="middle" className="text-[10px] font-bold fill-slate-700 pointer-events-none select-none group-hover:fill-teal-700">{n.label}</text>
            </g>
          ))}
        </svg>
      </div>
      {!readOnly && (
        <div className="bg-slate-50 border-t p-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider text-center flex justify-center gap-6">
           <span>Arrastrar para mover</span>
           <span className="flex items-center gap-1"><Palette className="h-3 w-3"/> Clic para cambiar color carril</span>
           <span className="flex items-center gap-1"><ArrowRight className="h-3 w-3"/> Modo Conexión: clic origen y luego destino</span>
        </div>
      )}
    </div>
  );
};
