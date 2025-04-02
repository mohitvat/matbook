'use client';
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node for rectangular nodes (API Call, Email, Text Box) with a delete button
const CustomNode = ({ data, id, onDelete }) => {
  return (
    <div
      style={{
        padding: '10px 20px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '120px',
      }}
    >
      <span>{data.label}</span>
      <button
        onClick={() => onDelete(id)}
        style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
      >
        🗑️
      </button>
    </div>
  );
};

// Define node types
const nodeTypes = {
  custom: CustomNode,
};

// Initial nodes and edges
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 50 },
    style: { background: '#4CAF50', color: 'white', border: '2px solid #388E3C', borderRadius: '50%' },
  },
  {
    id: '2',
    type: 'output',
    data: { label: 'End' },
    position: { x: 250, y: 350 }, // Adjusted position to make space for new nodes
    style: { background: '#F44336', color: 'white', border: '2px solid #D32F2F', borderRadius: '50%' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'custom' },
];

const WorkflowEditor = ({ params }) => {
  const { id } = params; // Get the workflow ID from the URL
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);

  // Handle connecting nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'custom' }, eds)),
    [setEdges]
  );

  // Handle node deletion
  const handleDeleteNode = useCallback(
    (nodeId) => {
      // Prevent deletion of Start and End nodes
      if (nodeId === '1' || nodeId === '2') return;

      // Remove the node
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      // Remove associated edges and reconnect the previous and next nodes
      setEdges((eds) => {
        const edgesToRemove = eds.filter((edge) => edge.source === nodeId || edge.target === nodeId);
        const sourceEdge = eds.find((edge) => edge.target === nodeId);
        const targetEdge = eds.find((edge) => edge.source === nodeId);
        const remainingEdges = eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);

        if (sourceEdge && targetEdge) {
          const newEdge = {
            id: `e${sourceEdge.source}-${targetEdge.target}`,
            source: sourceEdge.source,
            target: targetEdge.target,
            animated: true,
            type: 'custom',
          };
          return [...remainingEdges, newEdge];
        }
        return remainingEdges;
      });
    },
    [setNodes, setEdges]
  );

  // Handle showing the dropdown when the "+" icon is clicked
  const handleShowDropdown = (edgeId, midX, midY) => {
    setSelectedEdgeId(edgeId);
    setDropdownPosition({ x: midX, y: midY });
    setShowDropdown(true);
    console.log(setShowDropdown);
    
  };

  // Handle adding a new node between two nodes
  const handleAddNode = useCallback(
    (nodeType) => {
      if (!selectedEdgeId) return;

      const edge = edges.find((e) => e.id === selectedEdgeId);
      if (!edge) return;

      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      // Calculate position for the new node (midpoint between source and target)
      const newNodePosition = {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      };

      const newNodeId = `${nodes.length + 1}`;
      const newNode = {
        id: newNodeId,
        type: 'custom',
        data: { label: nodeType },
        position: newNodePosition,
      };

      // Add the new node
      setNodes((nds) => [...nds, newNode]);

      // Remove the old edge and add two new edges
      setEdges((eds) => {
        const newEdges = eds.filter((e) => e.id !== edge.id);
        return [
          ...newEdges,
          { id: `e${edge.source}-${newNodeId}`, source: edge.source, target: newNodeId, animated: true, type: 'custom' },
          { id: `e${newNodeId}-${edge.target}`, source: newNodeId, target: edge.target, animated: true, type: 'custom' },
        ];
      });

      // Adjust positions of nodes below the new node
      setNodes((nds) =>
        nds.map((node) => {
          if (node.position.y > newNodePosition.y) {
            return { ...node, position: { ...node.position, y: node.position.y + 100 } };
          }
          return node;
        })
      );

      // Close the dropdown
      setShowDropdown(false);
      setSelectedEdgeId(null);
    },
    [nodes, edges, selectedEdgeId, setNodes, setEdges]
  );

  // Custom edge with a "+" button in the middle
  const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY }) => {
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    return (
      <>
        <path
          id={id}
          d={`M${sourceX},${sourceY} L${targetX},${targetY}`}
          stroke="#000"
          strokeWidth={2}
          fill="none"
          markerEnd="url(#arrow)"
        />
        <circle
          cx={midX}
          cy={midY}
          r={10}
          fill="#fff"
          stroke="#000"
          strokeWidth={2}
          onClick={() => handleShowDropdown(id, midX, midY)}
          style={{ cursor: 'pointer' }}
        />
        <text x={midX - 5} y={midY + 5} fill="#000" fontSize="12">
          +
        </text>
      </>
    );
  };

  const edgeTypes = {
    custom: CustomEdge,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Editing Workflow {id}</h1>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center">
          <span className="mr-2">💾</span> Save Workflow
        </button>
      </div>

      {/* ReactFlow Component */}
      <div style={{ height: '80vh', border: '1px solid #ddd', borderRadius: '8px', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
          <svg>
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#000" />
              </marker>
            </defs>
          </svg>
        </ReactFlow>

        {/* Dropdown for selecting node type */}
        {showDropdown && (
          <div
            style={{
              position: 'absolute',
              top: dropdownPosition.y,
              left: dropdownPosition.x,
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              zIndex: 1000,
            }}
          >
            <div
              style={{ padding: '8px 16px', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
              onClick={() => handleAddNode('API Call')}
            >
              API Call
            </div>
            <div
              style={{ padding: '8px 16px', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
              onClick={() => handleAddNode('Email')}
            >
              Email
            </div>
            <div
              style={{ padding: '8px 16px', cursor: 'pointer' }}
              onClick={() => handleAddNode('Text Box')}
            >
              Text Box
            </div>
            <div
              style={{ padding: '8px 16px', cursor: 'pointer', borderTop: '1px solid #ddd', color: 'red' }}
              onClick={() => setShowDropdown(false)}
            >
              Cancel
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowEditor;
