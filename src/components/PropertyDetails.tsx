import React, { useEffect, useState } from 'react';
import { Building2, MapPin, BedDouble, Bath, Users, PenTool as Tool, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PropertyDetailsProps {
  propertyId: string;
  onClose: () => void;
}

export default function PropertyDetails({ propertyId, onClose }: PropertyDetailsProps) {
  const [property, setProperty] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        // Fetch property details
        const { data: propertyData } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        setProperty(propertyData);

        // Fetch current tenants
        const { data: tenantsData } = await supabase
          .from('leases')
          .select(`
            id,
            start_date,
            end_date,
            rent_amount,
            tenants (
              id,
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .eq('property_id', propertyId)
          .eq('status', 'Active');

        setTenants(tenantsData || []);

        // Fetch maintenance history
        const { data: maintenanceData } = await supabase
          .from('maintenance_requests')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false });

        setMaintenance(maintenanceData || []);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  if (loading) return <div>Loading property details...</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {/* Property Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{property.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              Close
            </button>
          </div>
          <div className="mt-2 flex items-center text-gray-500">
            <MapPin className="h-5 w-5 mr-2" />
            {property.address}
          </div>
        </div>

        {/* Property Images */}
        {property.images && property.images.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-4">
              {property.images.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="rounded-lg object-cover h-40 w-full"
                />
              ))}
            </div>
          </div>
        )}

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="flex items-center">
            <BedDouble className="h-5 w-5 text-gray-400 mr-2" />
            <span>{property.rooms} Rooms</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-5 w-5 text-gray-400 mr-2" />
            <span>{property.bathrooms} Bathrooms</span>
          </div>
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-gray-400 mr-2" />
            <span>{property.type}</span>
          </div>
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <span>€{property.rent_amount} /month</span>
          </div>
        </div>

        {/* Current Tenants */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <Users className="h-5 w-5 inline-block mr-2" />
            Current Tenants
          </h3>
          {tenants.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-4">
              {tenants.map((lease) => (
                <div key={lease.id} className="mb-4 last:mb-0">
                  <p className="font-medium">
                    {lease.tenants.first_name} {lease.tenants.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{lease.tenants.email}</p>
                  <p className="text-sm text-gray-500">{lease.tenants.phone}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Lease: {new Date(lease.start_date).toLocaleDateString()} -{' '}
                    {new Date(lease.end_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No current tenants</p>
          )}
        </div>

        {/* Maintenance History */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <Tool className="h-5 w-5 inline-block mr-2" />
            Maintenance History
          </h3>
          {maintenance.length > 0 ? (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {maintenance.map((request) => (
                    <tr key={request.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {request.description}
                      </td>
                      <td className="px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            request.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        €{request.actual_cost || request.estimated_cost || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No maintenance history</p>
          )}
        </div>
      </div>
    </div>
  );
}