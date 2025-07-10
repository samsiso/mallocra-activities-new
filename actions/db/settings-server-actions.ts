"use server"

import { ActionState } from "@/types"
import { supabaseAdminClient } from "@/lib/supabase-server"
import { auth } from "@clerk/nextjs/server"

// System setting type
export interface SystemSetting {
  key: string
  value: any
  type: 'text' | 'number' | 'boolean' | 'json' | 'select' | 'multiselect' | 'color' | 'date' | 'time'
  category: 'general' | 'seo' | 'email' | 'payment' | 'booking' | 'appearance' | 'integration' | 'security' | 'performance'
  label: string
  description?: string
  options?: any
  validation?: any
  isPublic: boolean
  isEditable: boolean
  sortOrder: number
  updatedBy?: string
  createdAt: string
  updatedAt: string
}

// Feature flag type
export interface FeatureFlag {
  key: string
  enabled: boolean
  description?: string
  rolloutPercentage?: number
  targetUsers?: string[]
  metadata?: any
  createdAt: string
  updatedAt: string
}

// Email template type
export interface EmailTemplate {
  key: string
  subject: string
  htmlContent: string
  textContent?: string
  variables?: string[]
  isActive: boolean
  category?: string
  createdAt: string
  updatedAt: string
}

// Get all system settings
export async function getSystemSettingsAction(params?: {
  category?: string
  isPublic?: boolean
}): Promise<ActionState<SystemSetting[]>> {
  try {
    let query = supabaseAdminClient
      .from('system_settings')
      .select('*')
      .order('sort_order', { ascending: true })

    if (params?.category) {
      query = query.eq('category', params.category)
    }

    if (params?.isPublic !== undefined) {
      query = query.eq('is_public', params.isPublic)
    }

    const { data, error } = await query

    if (error) {
      console.error("System settings query error:", error)
      // Return default settings if table doesn't exist
      return {
        isSuccess: true,
        message: "Using default settings",
        data: getDefaultSettings()
      }
    }

    return {
      isSuccess: true,
      message: "Settings fetched successfully",
      data: data || []
    }
  } catch (error) {
    console.error("Error fetching settings:", error)
    return {
      isSuccess: true,
      message: "Using default settings",
      data: getDefaultSettings()
    }
  }
}

// Get single setting by key
export async function getSystemSettingAction(
  key: string
): Promise<ActionState<SystemSetting>> {
  try {
    const { data, error } = await supabaseAdminClient
      .from('system_settings')
      .select('*')
      .eq('key', key)
      .single()

    if (error || !data) {
      // Return default value for this key
      const defaults = getDefaultSettings()
      const defaultSetting = defaults.find(s => s.key === key)
      
      if (defaultSetting) {
        return {
          isSuccess: true,
          message: "Using default setting",
          data: defaultSetting
        }
      }
      
      throw new Error(`Setting not found: ${key}`)
    }

    return {
      isSuccess: true,
      message: "Setting fetched successfully",
      data: data
    }
  } catch (error) {
    console.error("Error fetching setting:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch setting"
    }
  }
}

// Update system setting
export async function updateSystemSettingAction(
  key: string,
  value: any,
  ipAddress?: string,
  userAgent?: string
): Promise<ActionState<SystemSetting>> {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // Get old value for audit log
    const { data: oldSetting } = await supabaseAdminClient
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .single()

    // Update setting
    const { data, error } = await supabaseAdminClient
      .from('system_settings')
      .update({
        value: value,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('key', key)
      .select()
      .single()

    if (error) throw error

    // Create audit log entry in settings table
    await supabaseAdminClient
      .from('settings_audit_log')
      .insert({
        setting_key: key,
        old_value: oldSetting?.value || null,
        new_value: value,
        changed_by: userId,
        change_type: 'update',
        ip_address: ipAddress,
        user_agent: userAgent
      })

    // Also log in main audit log
    const { logAdminAction } = await import('./audit-log-actions')
    await logAdminAction(
      'UPDATE_SETTING',
      'system_setting',
      key,
      { 
        oldValue: oldSetting?.value,
        newValue: value,
        ipAddress,
        userAgent
      },
      'warning'
    )

    return {
      isSuccess: true,
      message: "Setting updated successfully",
      data: data
    }
  } catch (error) {
    console.error("Error updating setting:", error)
    return {
      isSuccess: false,
      message: "Failed to update setting"
    }
  }
}

// Get all feature flags
export async function getFeatureFlagsAction(): Promise<ActionState<FeatureFlag[]>> {
  try {
    const { data, error } = await supabaseAdminClient
      .from('feature_flags')
      .select('*')
      .order('key', { ascending: true })

    if (error) {
      console.error("Feature flags query error:", error)
      // Return default flags if table doesn't exist
      return {
        isSuccess: true,
        message: "Using default feature flags",
        data: getDefaultFeatureFlags()
      }
    }

    return {
      isSuccess: true,
      message: "Feature flags fetched successfully",
      data: data || []
    }
  } catch (error) {
    console.error("Error fetching feature flags:", error)
    return {
      isSuccess: true,
      message: "Using default feature flags",
      data: getDefaultFeatureFlags()
    }
  }
}

// Update feature flag
export async function updateFeatureFlagAction(
  key: string,
  enabled: boolean,
  metadata?: any
): Promise<ActionState<FeatureFlag>> {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const { data, error } = await supabaseAdminClient
      .from('feature_flags')
      .update({
        enabled: enabled,
        metadata: metadata,
        updated_at: new Date().toISOString()
      })
      .eq('key', key)
      .select()
      .single()

    if (error) throw error

    // Log the action
    const { logAdminAction } = await import('./audit-log-actions')
    await logAdminAction(
      'UPDATE_FEATURE_FLAG',
      'feature_flag',
      key,
      { enabled, metadata },
      'info'
    )

    return {
      isSuccess: true,
      message: "Feature flag updated successfully",
      data: data
    }
  } catch (error) {
    console.error("Error updating feature flag:", error)
    return {
      isSuccess: false,
      message: "Failed to update feature flag"
    }
  }
}

// Get all email templates
export async function getEmailTemplatesAction(): Promise<ActionState<EmailTemplate[]>> {
  try {
    const { data, error } = await supabaseAdminClient
      .from('email_templates')
      .select('*')
      .order('category', { ascending: true })

    if (error) {
      console.error("Email templates query error:", error)
      // Return default templates if table doesn't exist
      return {
        isSuccess: true,
        message: "Using default email templates",
        data: getDefaultEmailTemplates()
      }
    }

    return {
      isSuccess: true,
      message: "Email templates fetched successfully",
      data: data || []
    }
  } catch (error) {
    console.error("Error fetching email templates:", error)
    return {
      isSuccess: true,
      message: "Using default email templates",
      data: getDefaultEmailTemplates()
    }
  }
}

// Update email template
export async function updateEmailTemplateAction(
  key: string,
  updates: Partial<Omit<EmailTemplate, 'key' | 'createdAt' | 'updatedAt'>>
): Promise<ActionState<EmailTemplate>> {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const { data, error } = await supabaseAdminClient
      .from('email_templates')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('key', key)
      .select()
      .single()

    if (error) throw error

    // Log the action
    const { logAdminAction } = await import('./audit-log-actions')
    await logAdminAction(
      'UPDATE_EMAIL_TEMPLATE',
      'email_template',
      key,
      { updatedFields: Object.keys(updates) },
      'info'
    )

    return {
      isSuccess: true,
      message: "Email template updated successfully",
      data: data
    }
  } catch (error) {
    console.error("Error updating email template:", error)
    return {
      isSuccess: false,
      message: "Failed to update email template"
    }
  }
}

// Get settings stats for dashboard
export async function getSettingsStatsAction(): Promise<ActionState<{
  totalSettings: number
  publicSettings: number
  featureFlags: number
  enabledFlags: number
  emailTemplates: number
  activeTemplates: number
  lastUpdated?: string
  recentChanges: number
}>> {
  try {
    // Get counts in parallel
    const [
      settingsResult,
      flagsResult,
      templatesResult,
      auditResult
    ] = await Promise.all([
      supabaseAdminClient
        .from('system_settings')
        .select('is_public, updated_at', { count: 'exact' }),
      supabaseAdminClient
        .from('feature_flags')
        .select('enabled', { count: 'exact' }),
      supabaseAdminClient
        .from('email_templates')
        .select('is_active', { count: 'exact' }),
      supabaseAdminClient
        .from('settings_audit_log')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(50)
    ])

    // Calculate stats
    const settingsData = settingsResult.data || []
    const flagsData = flagsResult.data || []
    const templatesData = templatesResult.data || []
    const auditData = auditResult.data || []

    // Calculate recent changes (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentChanges = auditData.filter(
      log => new Date(log.created_at) > sevenDaysAgo
    ).length

    // Find most recent update
    const mostRecentUpdate = settingsData
      .map(s => s.updated_at)
      .filter(Boolean)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]

    return {
      isSuccess: true,
      message: "Settings stats fetched successfully",
      data: {
        totalSettings: settingsData.length || 0,
        publicSettings: settingsData.filter(s => s.is_public).length || 0,
        featureFlags: flagsData.length || 0,
        enabledFlags: flagsData.filter(f => f.enabled).length || 0,
        emailTemplates: templatesData.length || 0,
        activeTemplates: templatesData.filter(t => t.is_active).length || 0,
        lastUpdated: mostRecentUpdate,
        recentChanges: recentChanges
      }
    }
  } catch (error) {
    console.error("Error fetching settings stats:", error)
    // Return default stats
    return {
      isSuccess: true,
      message: "Using default stats",
      data: {
        totalSettings: 25,
        publicSettings: 10,
        featureFlags: 8,
        enabledFlags: 5,
        emailTemplates: 6,
        activeTemplates: 6,
        recentChanges: 0
      }
    }
  }
}

// Helper function to get default settings
function getDefaultSettings(): SystemSetting[] {
  const now = new Date().toISOString()
  return [
    // General Settings
    {
      key: 'site_name',
      value: 'Mallorca Activities',
      type: 'text',
      category: 'general',
      label: 'Site Name',
      description: 'The name of your website',
      isPublic: true,
      isEditable: true,
      sortOrder: 1,
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'site_tagline',
      value: 'Discover Mallorca\'s Best Activities',
      type: 'text',
      category: 'general',
      label: 'Site Tagline',
      description: 'A short description of your site',
      isPublic: true,
      isEditable: true,
      sortOrder: 2,
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'contact_email',
      value: 'hello@mallorcaactivities.com',
      type: 'text',
      category: 'general',
      label: 'Contact Email',
      description: 'Primary contact email address',
      isPublic: true,
      isEditable: true,
      sortOrder: 3,
      createdAt: now,
      updatedAt: now
    },
    
    // Booking Settings
    {
      key: 'booking_lead_time',
      value: 24,
      type: 'number',
      category: 'booking',
      label: 'Booking Lead Time (hours)',
      description: 'Minimum hours before activity start time',
      isPublic: false,
      isEditable: true,
      sortOrder: 10,
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'max_group_size',
      value: 20,
      type: 'number',
      category: 'booking',
      label: 'Maximum Group Size',
      description: 'Maximum number of participants per booking',
      isPublic: false,
      isEditable: true,
      sortOrder: 11,
      createdAt: now,
      updatedAt: now
    },
    
    // Payment Settings
    {
      key: 'currency',
      value: 'EUR',
      type: 'select',
      category: 'payment',
      label: 'Currency',
      description: 'Default currency for pricing',
      options: ['EUR', 'USD', 'GBP'],
      isPublic: true,
      isEditable: true,
      sortOrder: 20,
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'tax_rate',
      value: 21,
      type: 'number',
      category: 'payment',
      label: 'Tax Rate (%)',
      description: 'Default tax rate for activities',
      isPublic: false,
      isEditable: true,
      sortOrder: 21,
      createdAt: now,
      updatedAt: now
    },
    
    // SEO Settings
    {
      key: 'default_meta_description',
      value: 'Book amazing activities and experiences in Mallorca. From boat tours to adventure sports, discover the best the island has to offer.',
      type: 'text',
      category: 'seo',
      label: 'Default Meta Description',
      description: 'Default description for search engines',
      isPublic: false,
      isEditable: true,
      sortOrder: 30,
      createdAt: now,
      updatedAt: now
    },
    
    // Appearance Settings
    {
      key: 'primary_color',
      value: '#fb067d',
      type: 'color',
      category: 'appearance',
      label: 'Primary Brand Color',
      description: 'Main brand color used throughout the site',
      isPublic: true,
      isEditable: true,
      sortOrder: 40,
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'accent_color',
      value: '#fff546',
      type: 'color',
      category: 'appearance',
      label: 'Accent Color',
      description: 'Secondary accent color',
      isPublic: true,
      isEditable: true,
      sortOrder: 41,
      createdAt: now,
      updatedAt: now
    }
  ]
}

// Helper function to get default feature flags
function getDefaultFeatureFlags(): FeatureFlag[] {
  const now = new Date().toISOString()
  return [
    {
      key: 'new_booking_flow',
      enabled: true,
      description: 'Enable the new streamlined booking flow',
      rolloutPercentage: 100,
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'instant_booking',
      enabled: true,
      description: 'Allow instant booking without approval',
      rolloutPercentage: 100,
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'group_discounts',
      enabled: true,
      description: 'Enable automatic group discounts',
      rolloutPercentage: 100,
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'weather_integration',
      enabled: true,
      description: 'Show weather information for activities',
      rolloutPercentage: 100,
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'ai_recommendations',
      enabled: false,
      description: 'Enable AI-powered activity recommendations',
      rolloutPercentage: 0,
      createdAt: now,
      updatedAt: now
    }
  ]
}

// Helper function to get default email templates
function getDefaultEmailTemplates(): EmailTemplate[] {
  const now = new Date().toISOString()
  return [
    {
      key: 'booking_confirmation',
      subject: 'Your Mallorca Activity Booking Confirmation',
      htmlContent: '<h1>Booking Confirmed!</h1><p>Thank you for booking with us.</p>',
      textContent: 'Booking Confirmed! Thank you for booking with us.',
      variables: ['booking_id', 'activity_name', 'date', 'time', 'participants'],
      isActive: true,
      category: 'booking',
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'booking_reminder',
      subject: 'Reminder: Your Mallorca Activity is Tomorrow',
      htmlContent: '<h1>Don\'t forget!</h1><p>Your activity is scheduled for tomorrow.</p>',
      textContent: 'Don\'t forget! Your activity is scheduled for tomorrow.',
      variables: ['booking_id', 'activity_name', 'date', 'time', 'location'],
      isActive: true,
      category: 'booking',
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'welcome_email',
      subject: 'Welcome to Mallorca Activities!',
      htmlContent: '<h1>Welcome!</h1><p>We\'re excited to have you.</p>',
      textContent: 'Welcome! We\'re excited to have you.',
      variables: ['user_name', 'signup_date'],
      isActive: true,
      category: 'marketing',
      createdAt: now,
      updatedAt: now
    }
  ]
}