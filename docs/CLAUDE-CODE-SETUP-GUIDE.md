# Claude Code Setup Guide for Mallorca Activities Platform

## MCP (Model Context Protocol) Requirements

### Essential MCPs for This Project

#### 1. **Database & API MCPs**
```bash
# Supabase MCP (if available)
# Provides direct database access and query capabilities
mcp-supabase

# PostgreSQL MCP (alternative)
# For direct database operations
mcp-postgresql

# REST API MCP
# For testing API endpoints
mcp-rest-client
```

#### 2. **Development Tool MCPs**
```bash
# GitHub MCP
# For issue management, PR creation, and repository operations
mcp-github

# Docker MCP (if using containers)
# For containerized development
mcp-docker

# AWS/Cloud MCPs (for deployment)
# If using AWS services
mcp-aws
```

#### 3. **Testing & Quality MCPs**
```bash
# Playwright MCP
# For end-to-end testing
mcp-playwright

# Jest/Vitest MCP
# For unit testing
mcp-test-runner

# Bundle Analyzer MCP
# For performance analysis
mcp-webpack-analyzer
```

#### 4. **Media & Content MCPs**
```bash
# Cloudinary MCP
# For media management
mcp-cloudinary

# SEO Analysis MCP
# For content optimization
mcp-seo-analyzer
```

### Recommended MCP Configuration

Add to your Claude Code configuration:

```json
{
  "mcps": {
    "database": {
      "provider": "supabase",
      "connection_string": "env:DATABASE_URL"
    },
    "github": {
      "repository": "mallocra-activities",
      "default_branch": "main"
    },
    "testing": {
      "framework": "vitest",
      "coverage": true
    },
    "media": {
      "provider": "cloudinary",
      "optimization": true
    }
  }
}
```

## Development Rules & Best Practices

### 1. **Code Analysis Before Action**
```markdown
Before any code changes:
1. Read CLAUDE.md configuration file
2. Check existing patterns in similar components
3. Verify dependencies in package.json
4. Review brand guidelines (pink/yellow theme)
5. Check analysis documents for context
```

### 2. **Quality Gates**
```bash
# Required before any commit:
npm run type-check    # TypeScript validation
npm run lint:fix      # ESLint fixes
npm run format:write  # Prettier formatting
npm run test          # Unit tests
```

### 3. **Search Strategy**
```markdown
When searching for code:
1. Use Grep for specific patterns
2. Use Glob for file discovery
3. Use Task agent for complex research
4. Batch Read operations for efficiency
5. Check documentation first
```

### 4. **Component Development Rules**
```typescript
// 1. Always check existing components first
// 2. Follow established patterns
// 3. Use TypeScript strictly
// 4. Implement proper error handling
// 5. Add loading states
// 6. Follow brand guidelines

// Example pattern:
interface ComponentProps {
  // Proper TypeScript interfaces
}

export default function Component({ ...props }: ComponentProps) {
  // Implementation following existing patterns
}
```

### 5. **Database Operations**
```typescript
// Always use appropriate Supabase client
import { createClient } from '@/lib/supabase-server' // Server-side
import { createClient } from '@/lib/supabase' // Client-side

// Use server actions for mutations
// Use proper error handling
// Validate with Zod schemas
```

## File Templates & Patterns

### Component Template
```typescript
'use client' // Only if client interactivity needed

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ComponentNameProps {
  // Define props with TypeScript
}

export default function ComponentName({ ...props }: ComponentNameProps) {
  // Component logic following established patterns
  
  return (
    <Card className="bg-pink-500/15 border-pink-400/60">
      {/* Follow brand guidelines */}
    </Card>
  )
}
```

### Server Action Template
```typescript
'use server'

import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'

// Define validation schema
const schema = z.object({
  // Define expected data structure
})

export async function actionName(formData: FormData) {
  try {
    // Validate input
    const data = schema.parse(Object.fromEntries(formData))
    
    // Database operation
    const supabase = createClient()
    // ... implementation
    
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

## Key Areas of Focus

### 1. **Landing Page Optimization**
- Brand consistency (pink/yellow theme)
- Glass morphism effects
- Hero section typography
- Categories display
- Performance optimization

### 2. **Activities Management**
- CRUD operations
- Image handling with Cloudinary
- Search and filtering
- Booking integration

### 3. **Admin Dashboard**
- Real-time metrics
- Data visualization
- User management
- Analytics integration

### 4. **Booking System**
- Multi-step flow
- Payment integration (Stripe)
- Confirmation system
- Email notifications

## Documentation Strategy

### Always Check These Files First:
1. `CLAUDE.md` - Main configuration
2. `analysis/master-task-list.md` - Current tasks
3. `prompt-tracker.md` - Session progress
4. `docs/project-planning.md` - Project roadmap
5. Individual analysis files for specific features

### Document Updates:
- Update `prompt-tracker.md` for session progress
- Add new features to analysis documents
- Keep task lists current
- Document any new patterns or conventions

## Performance Monitoring

### Bundle Analysis
```bash
npm run analyze         # Full bundle analysis
npm run analyze:server  # Server bundle only
npm run analyze:browser # Browser bundle only
```

### Key Metrics to Watch:
- Bundle size < 1MB
- First Contentful Paint < 2s
- Largest Contentful Paint < 4s
- Cumulative Layout Shift < 0.1

## Testing Strategy

### Unit Tests
```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### Integration Testing
- API route testing
- Database operation testing
- Authentication flow testing
- Payment flow testing

### E2E Testing (Future)
- User journey testing
- Booking flow testing
- Admin dashboard testing

## Environment Management

### Required Environment Variables:
```bash
# Database
DATABASE_URL=

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Media
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Deployment Checklist

### Pre-deployment:
1. Run all quality checks
2. Test in production mode locally
3. Verify environment variables
4. Check database migrations
5. Test critical user flows

### Post-deployment:
1. Monitor error rates
2. Check performance metrics
3. Verify integrations
4. Test payment flows
5. Monitor analytics

## Common Pitfalls to Avoid

1. **Not checking existing patterns** - Always review similar components
2. **Ignoring brand guidelines** - Maintain pink/yellow theme consistency
3. **Missing TypeScript types** - All code must be properly typed
4. **Skipping quality checks** - Run linting and formatting before commits
5. **Not using appropriate Supabase client** - Server vs client context matters
6. **Forgetting error handling** - Always implement proper error boundaries
7. **Not optimizing for performance** - Consider bundle size and loading times

## Success Metrics

### Code Quality:
- Zero TypeScript errors
- Zero ESLint warnings
- 100% Prettier compliance
- >80% test coverage

### User Experience:
- <2s page load times
- Consistent brand experience
- Responsive design across devices
- Accessible interface

### Business Metrics:
- Successful booking completions
- User engagement rates
- Admin efficiency metrics
- System reliability (>99% uptime)