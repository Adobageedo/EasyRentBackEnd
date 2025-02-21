import React, { useState, useEffect } from 'react';
import { Building2, MapPin, BedDouble, Bath, Pencil } from 'lucide-react';
import PropertyForm from '../components/PropertyForm';
import PropertyDetails from '../components/PropertyDetails';
import Modal from '../components/Modal';
import { supabase } from '../lib/supabase';

export default function Properties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      setProperties(data);
    } catch (err: any) {
      setError('Error fetching properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddPropertyClick = () => {
    setSelectedProperty(null);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleEditProperty = (property: any) => {
    setSelectedProperty(property);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleViewDetails = (property: any) => {
    setSelectedProperty(property);
    setShowDetails(true);
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedProperty(null);
  };

  const handleDetailsClose = () => {
    setShowDetails(false);
    setSelectedProperty(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedProperty(null);
    fetchProperties();
  };

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Modal
        isOpen={showForm}
        onClose={handleFormCancel}
        title={selectedProperty ? 'Edit Property' : 'Add Property'}
      >
        <PropertyForm
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
          initialData={selectedProperty}
        />
      </Modal>

      <Modal
        isOpen={showDetails}
        onClose={handleDetailsClose}
        title="Property Details"
      >
        {selectedProperty && (
          <PropertyDetails
            propertyId={selectedProperty.id}
            onClose={handleDetailsClose}
          />
        )}
      </Modal>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold text-gray-900">Properties</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your property portfolio
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleAddPropertyClick}
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Add Property
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="relative h-48">
              <img
                src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80'}
                alt={property.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEditProperty(property)}
                  className="rounded-full bg-white p-2 text-gray-600 shadow-md hover:bg-gray-100"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    property.status === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {property.status}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">
                  {property.name}
                </h3>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span className="ml-1">{property.address}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <BedDouble className="h-4 w-4 text-gray-400" />
                    <span className="ml-1 text-sm text-gray-500">
                      {property.rooms} rooms
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 text-gray-400" />
                    <span className="ml-1 text-sm text-gray-500">
                      {property.bathrooms} baths
                    </span>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  €{property.rent_amount}
                </span>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleViewDetails(property)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}