"use server"

import { ActionState } from "@/types"
import { supabaseAdminClient } from "@/lib/supabase-server"
import { auth } from "@clerk/nextjs/server"

// Audit log entry type
export interface AuditLogEntry {
  id: string
  userId: string
  userEmail?: string
  userName?: string
  action: string
  resource: string
  resourceId?: string
  details?: any
  ipAddress?: string
  userAgent?: string
  timestamp: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  category: 'auth' | 'admin' | 'booking' | 'activity' | 'review' | 'payment' | 'settings' | 'user'
}

// Audit log filters
export interface AuditLogFilters {
  userId?: string
  action?: string
  resource?: string
  category?: string
  severity?: string
  startDate?: string
  endDate?: string
  search?: string
  limit?: number
  offset?: number
}

/**
 * Create an audit log entry
 */
export async function createAuditLogAction(
  entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'userId' | 'userEmail' | 'userName'>
): Promise<ActionState<AuditLogEntry>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return {
        isSuccess: false,
        message: "Unauthorized - No user ID found"
      }
    }

    // Get user details
    const { data: userData } = await supabaseAdminClient
      .from('users_profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    const auditEntry = {
      user_id: userId,
      user_email: userData?.email,
      user_name: userData?.full_name,
      action: entry.action,
      resource: entry.resource,
      resource_id: entry.resourceId,
      details: entry.details,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
      severity: entry.severity,
      category: entry.category,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabaseAdminClient
      .from('audit_logs')
      .insert(auditEntry)
      .select()
      .single()

    if (error) throw error

    return {
      isSuccess: true,
      message: "Audit log created successfully",
      data: {
        id: data.id,
        userId: data.user_id,
        userEmail: data.user_email,
        userName: data.user_name,
        action: data.action,
        resource: data.resource,
        resourceId: data.resource_id,
        details: data.details,
        ipAddress: data.ip_address,
        userAgent: data.user_agent,
        timestamp: data.created_at,
        severity: data.severity,
        category: data.category
      }
    }
  } catch (error) {
    console.error("Error creating audit log:", error)
    return {
      isSuccess: false,
      message: "Failed to create audit log"
    }
  }
}

/**
 * Get audit logs with filtering
 */
export async function getAuditLogsAction(
  filters?: AuditLogFilters
): Promise<ActionState<{ logs: AuditLogEntry[], total: number }>> {
  try {
    let query = supabaseAdminClient
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.userId) {
      query = query.eq('user_id', filters.userId)
    }
    if (filters?.action) {
      query = query.eq('action', filters.action)
    }
    if (filters?.resource) {
      query = query.eq('resource', filters.resource)
    }
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.severity) {
      query = query.eq('severity', filters.severity)
    }
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate)
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate)
    }
    if (filters?.search) {
      query = query.or(`action.ilike.%${filters.search}%,resource.ilike.%${filters.search}%,user_email.ilike.%${filters.search}%`)
    }

    // Apply pagination
    const limit = filters?.limit || 50
    const offset = filters?.offset || 0
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Audit logs query error:", error)
      // Return empty array if table doesn't exist
      return {
        isSuccess: true,
        message: "No audit logs found",
        data: { logs: [], total: 0 }
      }
    }

    const logs: AuditLogEntry[] = (data || []).map(log => ({
      id: log.id,
      userId: log.user_id,
      userEmail: log.user_email,
      userName: log.user_name,
      action: log.action,
      resource: log.resource,
      resourceId: log.resource_id,
      details: log.details,
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      timestamp: log.created_at,
      severity: log.severity,
      category: log.category
    }))

    return {
      isSuccess: true,
      message: "Audit logs fetched successfully",
      data: { logs, total: count || 0 }
    }
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch audit logs"
    }
  }
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStatsAction(): Promise<ActionState<{
  totalLogs: number
  todayLogs: number
  criticalEvents: number
  topActions: Array<{ action: string, count: number }>
  topUsers: Array<{ userId: string, userName: string, count: number }>
  severityBreakdown: Array<{ severity: string, count: number }>
}>> {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Get total logs
    const { count: totalLogs } = await supabaseAdminClient
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })

    // Get today's logs
    const { count: todayLogs } = await supabaseAdminClient
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)

    // Get critical events (last 7 days)
    const { count: criticalEvents } = await supabaseAdminClient
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .in('severity', ['error', 'critical'])
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    // Get top actions
    const { data: actionsData } = await supabaseAdminClient
      .rpc('get_top_audit_actions', { limit_count: 5 })

    // Get top users
    const { data: usersData } = await supabaseAdminClient
      .rpc('get_top_audit_users', { limit_count: 5 })

    // Get severity breakdown
    const { data: severityData } = await supabaseAdminClient
      .rpc('get_audit_severity_breakdown')

    return {
      isSuccess: true,
      message: "Audit log stats fetched successfully",
      data: {
        totalLogs: totalLogs || 0,
        todayLogs: todayLogs || 0,
        criticalEvents: criticalEvents || 0,
        topActions: actionsData || [],
        topUsers: usersData || [],
        severityBreakdown: severityData || []
      }
    }
  } catch (error) {
    console.error("Error fetching audit log stats:", error)
    // Return default stats if functions don't exist
    return {
      isSuccess: true,
      message: "Using default audit log stats",
      data: {
        totalLogs: 0,
        todayLogs: 0,
        criticalEvents: 0,
        topActions: [],
        topUsers: [],
        severityBreakdown: [
          { severity: 'info', count: 0 },
          { severity: 'warning', count: 0 },
          { severity: 'error', count: 0 },
          { severity: 'critical', count: 0 }
        ]
      }
    }
  }
}

/**
 * Helper function to log admin actions
 */
export async function logAdminAction(
  action: string,
  resource: string,
  resourceId?: string,
  details?: any,
  severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
): Promise<void> {
  try {
    await createAuditLogAction({
      action,
      resource,
      resourceId,
      details,
      severity,
      category: 'admin'
    })
  } catch (error) {
    console.error("Failed to log admin action:", error)
  }
}

/**
 * Export audit logs to CSV
 */
export async function exportAuditLogsAction(
  filters?: AuditLogFilters
): Promise<ActionState<string>> {
  try {
    const { data } = await getAuditLogsAction({ ...filters, limit: 10000 })
    
    if (!data || data.logs.length === 0) {
      return {
        isSuccess: false,
        message: "No audit logs to export"
      }
    }

    // Create CSV header
    const headers = [
      'Timestamp',
      'User',
      'Email',
      'Action',
      'Resource',
      'Resource ID',
      'Category',
      'Severity',
      'IP Address',
      'Details'
    ]

    // Convert logs to CSV rows
    const rows = data.logs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.userName || 'Unknown',
      log.userEmail || '',
      log.action,
      log.resource,
      log.resourceId || '',
      log.category,
      log.severity,
      log.ipAddress || '',
      JSON.stringify(log.details || {})
    ])

    // Combine headers and rows
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    return {
      isSuccess: true,
      message: "Audit logs exported successfully",
      data: csv
    }
  } catch (error) {
    console.error("Error exporting audit logs:", error)
    return {
      isSuccess: false,
      message: "Failed to export audit logs"
    }
  }
}