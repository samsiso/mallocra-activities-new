# 🛠️ **Autonomous Development Templates**

---

## 🎯 **Template System Overview**

These templates enable Claude Code to rapidly create consistent, high-quality code following project patterns.

### 📁 **Template Categories**
- **Components** - UI components with TypeScript and styling
- **Server Actions** - Database operations with error handling
- **API Routes** - Next.js API endpoints
- **Pages** - App router pages with layouts
- **Hooks** - Custom React hooks
- **Utilities** - Helper functions and configurations

---

## ⚛️ **Component Templates**

### 🔧 **Basic Component Template**
```typescript
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ComponentNameProps {
  // Define props with TypeScript
  title?: string
  className?: string
  children?: React.ReactNode
}

export default function ComponentName({ 
  title = 'Default Title',
  className = '',
  children 
}: ComponentNameProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async () => {
    try {
      setIsLoading(true)
      // Async operation logic
    } catch (error) {
      console.error('ComponentName error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`bg-pink-500/15 border-pink-400/60 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
        <Button 
          onClick={handleAction}
          disabled={isLoading}
          className="bg-yellow-400 text-black hover:bg-yellow-500"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Action Button
        </Button>
      </CardContent>
    </Card>
  )
}
```

### 🎨 **Form Component Template**
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface FormComponentProps {
  onSubmit: (data: FormData) => Promise<void>
  defaultValues?: Partial<FormData>
  className?: string
}

export default function FormComponent({ 
  onSubmit, 
  defaultValues,
  className = '' 
}: FormComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      ...defaultValues,
    },
  })

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      toast.success('Successfully submitted!')
      form.reset()
    } catch (error) {
      toast.error('Submission failed')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`p-6 bg-pink-500/15 rounded-lg border border-pink-400/60 ${className}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Title</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-gray-900 text-white border-gray-700"
                    placeholder="Enter title..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Description</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-gray-900 text-white border-gray-700"
                    placeholder="Enter description..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
```

---

## 🗄️ **Server Action Templates**

### 🔧 **Basic Server Action Template**
```typescript
'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Define validation schema
const actionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

type ActionData = z.infer<typeof actionSchema>

export async function createItemAction(formData: FormData) {
  try {
    // Validate input data
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    }

    const validatedData = actionSchema.parse(rawData)

    // Database operation
    const supabase = createClient()
    const { data, error } = await supabase
      .from('table_name')
      .insert(validatedData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return { 
        success: false, 
        error: 'Failed to create item. Please try again.' 
      }
    }

    // Revalidate cache and redirect
    revalidatePath('/items')
    return { 
      success: true, 
      data,
      message: 'Item created successfully!' 
    }

  } catch (error) {
    console.error('Action error:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Invalid form data',
        fieldErrors: error.flatten().fieldErrors 
      }
    }

    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    }
  }
}

export async function updateItemAction(id: string, formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    }

    const validatedData = actionSchema.parse(rawData)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('table_name')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { success: false, error: 'Failed to update item' }
    }

    revalidatePath('/items')
    return { success: true, data }

  } catch (error) {
    console.error('Update error:', error)
    return { success: false, error: 'Update failed' }
  }
}

export async function deleteItemAction(id: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('table_name')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: 'Failed to delete item' }
    }

    revalidatePath('/items')
    return { success: true, message: 'Item deleted successfully' }

  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: 'Delete failed' }
  }
}
```

---

## 🌐 **API Route Template**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'

const requestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const supabase = createClient()
    const { data, error, count } = await supabase
      .from('table_name')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })

  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = requestSchema.parse(body)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('table_name')
      .insert(validatedData)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create item' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error('POST error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 📄 **Page Template**
```typescript
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase-server'
import ComponentName from './_components/component-name'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface PageProps {
  params: { id?: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getData(id?: string) {
  const supabase = createClient()
  
  if (id) {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error('Failed to fetch item')
    return data
  }

  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to fetch items')
  return data
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="bg-pink-500/15 border-pink-400/60">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 bg-gray-700" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full bg-gray-700 mb-2" />
            <Skeleton className="h-4 w-2/3 bg-gray-700" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function PageName({ params, searchParams }: PageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Page Title</h1>
        <p className="text-gray-300">Page description</p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <DataSection params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function DataSection({ params, searchParams }: PageProps) {
  const data = await getData(params.id)

  return (
    <div className="space-y-6">
      {Array.isArray(data) ? (
        data.map((item) => (
          <ComponentName key={item.id} data={item} />
        ))
      ) : (
        <ComponentName data={data} />
      )}
    </div>
  )
}
```

---

## 🪝 **Custom Hook Template**
```typescript
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'

interface UseDataHookOptions {
  autoFetch?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface UseDataHookReturn<T> {
  data: T[] | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  create: (item: Partial<T>) => Promise<void>
  update: (id: string, item: Partial<T>) => Promise<void>
  delete: (id: string) => Promise<void>
}

export function useDataHook<T = any>(
  tableName: string,
  options: UseDataHookOptions = {}
): UseDataHookReturn<T> {
  const [data, setData] = useState<T[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: fetchedData, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setData(fetchedData)
      options.onSuccess?.(fetchedData)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      options.onError?.(error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [tableName, supabase, options])

  const create = useCallback(async (item: Partial<T>) => {
    try {
      setLoading(true)
      const { data: newItem, error: createError } = await supabase
        .from(tableName)
        .insert(item)
        .select()
        .single()

      if (createError) throw createError
      
      setData(prev => prev ? [newItem, ...prev] : [newItem])
      toast.success('Item created successfully')
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Create failed')
      setError(error)
      toast.error('Failed to create item')
      throw error
    } finally {
      setLoading(false)
    }
  }, [tableName, supabase])

  const update = useCallback(async (id: string, item: Partial<T>) => {
    try {
      setLoading(true)
      const { data: updatedItem, error: updateError } = await supabase
        .from(tableName)
        .update(item)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      setData(prev => 
        prev?.map(existingItem => 
          (existingItem as any).id === id ? updatedItem : existingItem
        ) || null
      )
      toast.success('Item updated successfully')
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Update failed')
      setError(error)
      toast.error('Failed to update item')
      throw error
    } finally {
      setLoading(false)
    }
  }, [tableName, supabase])

  const deleteItem = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setData(prev => 
        prev?.filter(item => (item as any).id !== id) || null
      )
      toast.success('Item deleted successfully')
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Delete failed')
      setError(error)
      toast.error('Failed to delete item')
      throw error
    } finally {
      setLoading(false)
    }
  }, [tableName, supabase])

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData()
    }
  }, [fetchData, options.autoFetch])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
    update,
    delete: deleteItem,
  }
}
```

---

## 🛠️ **Utility Function Template**
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function for combining Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Generate slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unknown error occurred'
}
```

---

## 📝 **Usage Guidelines**

### 🎯 **When to Use Templates**
- Starting new components or features
- Need consistent error handling patterns
- Setting up database operations
- Creating form components
- Building API endpoints

### 🔧 **Customization Steps**
1. **Copy template** - Use as starting point
2. **Update interfaces** - Modify TypeScript types
3. **Customize styling** - Adjust Tailwind classes for brand
4. **Add business logic** - Implement specific functionality
5. **Test thoroughly** - Verify all error cases

### ⚡ **Best Practices**
- Always use TypeScript interfaces
- Include proper error handling
- Add loading states for UX
- Follow brand color guidelines
- Implement accessibility features
- Add proper validation with Zod

---

**🚀 Key Takeaway**: These templates provide consistent, production-ready starting points for rapid autonomous development while maintaining code quality and project conventions.