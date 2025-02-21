import React, { useState, useEffect } from 'react';
import { PenTool as Tool, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import MaintenanceForm from '../components/MaintenanceForm'; // Make sure the path is correct
import { supabase } from '../lib/supabase'; // Make sure the supabase client is properly imported

const getPriorityBadgeColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'in progress':
      return <Tool className="h-5 w-5 text-blue-500" />;
    case 'scheduled':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
  }
};

export default function Maintenance() {
  const [showFormMaintenance, setShowFormMaintenance] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]); // Store maintenance requests from the database

  // Fetch maintenance requests on mount
  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      const { data, error } = await supabase.from('maintenance_requests').select('*');

      if (error) {
        console.error('Error fetching maintenance requests:', error);
      } else {
        setMaintenanceRequests(data);
      }
    };

    fetchMaintenanceRequests();
  }, []); // Only run on component mount

  const handleAddMaintenanceClick = () => {
    setShowFormMaintenance(true);
  };

  const handleFormCancelMaintenance = () => {
    setShowFormMaintenance(false);
  };

  const handleFormSuccessMaintenance = () => {
    setShowFormMaintenance(false);
    // Optionally, refresh property list or show a success message
  };

  return (
    <div>
      {showFormMaintenance ? (
        <MaintenanceForm onCancel={handleFormCancelMaintenance} onSuccess={handleFormSuccessMaintenance} />
      ) : (
        <>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-semibold text-gray-900">Maintenance</h1>
              <p className="mt-2 text-sm text-gray-700">
                Track and manage maintenance requests and repairs
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={handleAddMaintenanceClick}
                className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                New Request
              </button>
            </div>
          </div>

          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Property
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Priority
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Assigned To
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Est. Cost
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {maintenanceRequests.length > 0 ? (
                        maintenanceRequests.map((request) => (
                          <tr key={request.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {request.property_name} {/* Assuming `property_name` is the column in your DB */}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {request.description}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityBadgeColor(
                                  request.priority
                                )}`}
                              >
                                {request.priority}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                {getStatusIcon(request.status)}
                                <span className="ml-2">{request.status}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {request.assigned_to} {/* Assuming `assigned_to` is the column */}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {request.estimated_cost} {/* Assuming `estimated_cost` is the column */}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button className="text-blue-600 hover:text-blue-900">
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            No maintenance requests available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
