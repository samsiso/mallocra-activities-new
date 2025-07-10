/**
 * Direct Supabase operations without MCP
 * Use this instead of the MCP when it's acting up
 */

import { supabaseAdminClient } from "./supabase-server"

export const SupabaseDirect = {
  // Database operations
  async query(sql: string, params?: any[]) {
    const { data, error } = await supabaseAdminClient.rpc("execute_sql", {
      query: sql,
      params: params || []
    })

    if (error) throw error
    return data
  },

  // Storage operations
  async uploadImage(bucket: string, path: string, file: File) {
    const { data, error } = await supabaseAdminClient.storage
      .from(bucket)
      .upload(path, file)

    if (error) throw error

    const {
      data: { publicUrl }
    } = supabaseAdminClient.storage.from(bucket).getPublicUrl(path)

    return { path: data.path, url: publicUrl }
  },

  async createBucket(name: string, isPublic: boolean = true) {
    const { data, error } = await supabaseAdminClient.storage.createBucket(
      name,
      { public: isPublic }
    )

    if (error && !error.message.includes("already exists")) throw error
    return data
  },

  // Table operations
  async select(table: string, columns = "*", filters?: Record<string, any>) {
    let query = supabaseAdminClient.from(table).select(columns)

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async insert(table: string, data: any) {
    const { data: result, error } = await supabaseAdminClient
      .from(table)
      .insert(data)
      .select()

    if (error) throw error
    return result
  },

  async update(table: string, id: string, data: any) {
    const { data: result, error } = await supabaseAdminClient
      .from(table)
      .update(data)
      .eq("id", id)
      .select()

    if (error) throw error
    return result
  },

  async delete(table: string, id: string) {
    const { error } = await supabaseAdminClient
      .from(table)
      .delete()
      .eq("id", id)

    if (error) throw error
    return true
  }
}
