import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';

const maintenanceSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.string().min(1, 'Priority is required'),
  assignedTo: z.string().optional(),
  estimatedCost: z.number().min(0),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

interface MaintenanceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: MaintenanceFormData;
}

export default function MaintenanceForm({
  onSuccess,
  onCancel,
  initialData,
}: MaintenanceFormProps) {
  const [properties, setProperties] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: initialData,
  });

  // Fetch properties from the database
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase.from('properties').select('id, name');
        if (error) {
          throw error;
        }
        setProperties(data);
      } catch (err) {
        setError('Failed to load properties');
        console.error(err);
      }
    };
    fetchProperties();
  }, []);

  const onSubmit = async (data: MaintenanceFormData) => {
    try {
      const { error } = await supabase.from('maintenance_requests').insert([
        {
          property_id: data.propertyId,
          description: data.description,
          priority: data.priority,
          assigned_to: data.assignedTo,
          estimated_cost: data.estimatedCost,
          status: 'Pending',
        },
      ]);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error saving maintenance request:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Property</label>
          <select
            {...register('propertyId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a property</option>
            {properties.length > 0 ? (
              properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))
            ) : (
              <option disabled>No properties available</option>
            )}
          </select>
          {errors.propertyId && (
            <p className="mt-1 text-sm text-red-600">{errors.propertyId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            {...register('priority')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Assigned To</label>
          <input
            type="text"
            {...register('assignedTo')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Estimated Cost</label>
          <input
            type="number"
            {...register('estimatedCost', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.estimatedCost && (
            <p className="mt-1 text-sm text-red-600">{errors.estimatedCost.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Create Request'}
        </button>
      </div>
    </form>
  );
}
