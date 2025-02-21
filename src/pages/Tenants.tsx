import React, { useState, useEffect }  from 'react';
import { Mail, Phone } from 'lucide-react';
import TenantForm from '../components/TenantForm'; // Make sure the path is correct
import { supabase } from '../lib/supabase'; // Make sure the supabase client is properly imported

const tenants = [
  {
    id: 1,
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    phone: '+33 6 12 34 56 78',
    property: 'Apt 4B - 123 Main Street',
    leaseStart: '2023-09-01',
    leaseEnd: '2024-08-31',
    rentAmount: '€1,200',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Thomas Bernard',
    email: 'thomas.bernard@example.com',
    phone: '+33 6 98 76 54 32',
    property: 'Studio 2A - 456 Oak Avenue',
    leaseStart: '2023-06-15',
    leaseEnd: '2024-06-14',
    rentAmount: '€800',
    status: 'Active',
  },
];

export default function Tenants() {
  const [TenantsRequests, setTenantsRequests] = useState<any[]>([]); // Store maintenance requests from the database
  // Fetch maintenance requests on mount
  useEffect(() => {
    const fetchTenantsRequests = async () => {
      const { data, error } = await supabase.from('maintenance_requests').select('*');

      if (error) {
        console.error('Error fetching maintenance requests:', error);
      } else {
        setTenantsRequests(data);
      }
    };

    fetchTenantsRequests();
  }, []); // Only run on component mount





  const [showFormTenant, setShowFormTenant] = useState(false);

  const handleAddTenantClickTenant = () => {
    setShowFormTenant(true);
  };

  const handleFormCancelTenant = () => {
    setShowFormTenant(false);
  };

  const handleFormSuccessTenant = () => {
    setShowFormTenant(false);
    // Optionally, refresh property list or show a success message
  };
  return (
    <div>
      {showFormTenant ? (
        <TenantForm onCancel={handleFormCancelTenant} onSuccess={handleFormSuccessTenant} />
      ) : (
        <>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-semibold text-gray-900">Tenants</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage your tenants and lease agreements
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={handleAddTenantClickTenant}
                className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Add Tenant
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
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Contact
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Property
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Lease Period
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Rent
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">

                      {TenantsRequests.length > 0 ? (
                        TenantsRequests.map((request) => (
                          <tr key={request.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {request.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="ml-1">{request.email}</span>
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span className="ml-1">{request.phone}</span>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {request.property}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(request.leaseStart).toLocaleDateString()} -{' '}
                              {new Date(request.leaseEnd).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {request.rentAmount}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  request.status === 'Active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {request.status}
                              </span>
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
                            No tenant available.
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