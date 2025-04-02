'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const WorkflowBuilder = () => {
  const router = useRouter();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://fake-json-api.mock.beeceptor.com/users');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const transformedData = data.map(user => ({
          name: user.name,
          id: `#${user.id}`,
          lastEdited: `${user.username} ${new Date().toLocaleTimeString()} IST ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' })}`,
          description: `Workflow for ${user.company} - ${user.email}`,
          user: user
        }));
        
        setWorkflows(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    workflow.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Edit button click
  const handleEdit = (workflowId) => {
    router.push(`/workflow-editor/${workflowId.replace('#', '')}`); // Remove '#' from ID for URL
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">WORKFLOW BUILDER</h1>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center">
          <span className="mr-2">+</span> Create New Process
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search By WORKFLOW NAME/ID"
          className="w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading workflows...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">Error: {error}</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6">WORKFLOW NAME</th>
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">LAST EDITED ON</th>
                <th className="py-3 px-6">DESCRIPTION</th>
                <th className="py-3 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkflows.map((workflow, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-orange-500">{workflow.name}</td>
                  <td className="py-3 px-6">{workflow.id}</td>
                  <td className="py-3 px-6">{workflow.lastEdited}</td>
                  <td className="py-3 px-6">{workflow.description}</td>
                  <td className="py-3 px-6 flex space-x-2">
                    <button>Pin</button>
                    <button className="border border-black py-2 px-4">Execute</button>
                    <button
                      className="border border-black py-2 px-4"
                      onClick={() => handleEdit(workflow.id)}
                    >
                      Edit
                    </button>
                    <button className="text-gray-500">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-500">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <nav className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-gray-200">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md">3</button>
          <span className="px-3 py-1">...</span>
          <button className="px-3 py-1 border border-gray-300 rounded-md">15</button>
        </nav>
      </div>
    </div>
  );
};

export default WorkflowBuilder;