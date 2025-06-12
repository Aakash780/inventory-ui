import { InventoryEntry } from './types';

/**
 * Transforms a database entry from Supabase format to frontend format
 */
export function transformDatabaseEntry(dbEntry: any): InventoryEntry {
  if (!dbEntry) {
    console.warn('Received null or undefined dbEntry in transformDatabaseEntry');
    return {} as InventoryEntry;
  }
  
  // Safely transform fields with fallbacks
  return {
    ...dbEntry,
    id: dbEntry.id || '',
    // Map from Supabase field names to frontend field names
    from: dbEntry.from_location || dbEntry.from || '',
    to: dbEntry.to_location || dbEntry.to || '',
    returnTo: dbEntry.return_to || dbEntry.returnTo || '',
    materialDescription: dbEntry.material_description || dbEntry.materialDescription || '',
    orderBy: dbEntry.order_by || dbEntry.orderBy || '',
    units: dbEntry.units || '',
    quantity: Number(dbEntry.quantity || 0),
    remark: dbEntry.remark || '',
    // Ensure proper date formatting
    date: dbEntry.date ? new Date(dbEntry.date) : new Date(),
    // Handle created_at/createdAt consistently
    createdAt: dbEntry.created_at ? new Date(dbEntry.created_at) : 
               dbEntry.createdAt ? new Date(dbEntry.createdAt) : new Date(),
    // Handle status field with validation
    status: ['completed', 'pending', 'returned'].includes(dbEntry.status) ? 
            dbEntry.status : 'completed',
  };
}

/**
 * Transforms frontend data to Supabase format for saving
 */
export function prepareForDatabase(data: any): any {
  if (!data) {
    console.warn('Received null or undefined data in prepareForDatabase');
    return {};
  }
  
  console.log('Original data received:', data);
  
  // Extract frontend field names
  const { from, to, returnTo, orderBy, materialDescription, ...rest } = data;
  
  // Create the transformed data object
  const transformedData = {
    ...rest,
    // Map from frontend field names to Supabase field names
    from_location: from || '',
    to_location: to || '',
    return_to: returnTo || '',
    order_by: orderBy || '',
    material_description: materialDescription || '',
    // Default status if not provided
    status: data.status || 'completed',
    // Ensure date is properly formatted for PostgreSQL
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    // Ensure quantity is numeric
    quantity: typeof data.quantity === 'number' ? data.quantity : 
              typeof data.quantity === 'string' ? Number(data.quantity) : 0,
  };
  
  console.log('Transformed data for database:', transformedData);
  
  return transformedData;
}
