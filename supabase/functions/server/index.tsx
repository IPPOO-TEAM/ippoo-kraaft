// Supabase Edge Functions Server Entry Point
// This file serves as the main entry point for server-side Supabase operations

import { supabase, kvStore } from './kv_store';

export { supabase, kvStore };

// Export utility functions for common operations
export const serverUtils = {
  // Fetch data from any table
  async fetchTable(tableName: string, filters?: Record<string, any>) {
    let query = supabase.from(tableName).select('*');

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Insert data into a table
  async insertData(tableName: string, data: any) {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();

    if (error) throw error;
    return result;
  },

  // Update data in a table
  async updateData(tableName: string, id: string, data: any) {
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select();

    if (error) throw error;
    return result;
  },

  // Delete data from a table
  async deleteData(tableName: string, id: string) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
