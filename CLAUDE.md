# Claude Code Configuration for Mallorca Activities Platform

## 🚀 **AUTONOMOUS AGENT MODE**
**READ FIRST**: This project is configured for full autonomous development. Claude Code should act independently, make decisions, and execute tasks without waiting for confirmation.

### 📋 **Essential Reading Order**
1. **This file (CLAUDE.md)** - Core configuration
2. **`docs/CLAUDE-AUTONOMOUS-AGENT-RULES.md`** - Autonomous behavior rules
3. **`docs/SUPABASE-MCP-INTEGRATION.md`** - Database workflow
4. **`docs/GITHUB-AUTOMATION-WORKFLOW.md`** - Git automation
5. **`docs/templates/AUTONOMOUS-DEVELOPMENT-TEMPLATES.md`** - Code templates

## 🚨 **CRITICAL PRE-FLIGHT CHECKLIST**
**ALWAYS CHECK THESE FIRST when debugging issues:**

### 1. **Database Issues**
```bash
# FIRST: Check ALL required env vars exist
cat .env.local | grep -E "(SUPABASE|DATABASE)"

# Required for database operations:
DATABASE_URL=                    # PostgreSQL connection string
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Public anon key
SUPABASE_SERVICE_ROLE_KEY=      # Admin key for server operations (CRITICAL!)
```

### 2. **Common Booking Flow Issues**
- **"Database unavailable"** → Missing `SUPABASE_SERVICE_ROLE_KEY`
- **"Invalid API key"** → Using client component instead of server action
- **"RLS policy violation"** → Need admin client with service role key
- **Foreign key errors** → Create guest user profiles first

### 3. **Debugging Order**
1. Check environment variables FIRST
2. Check if it needs server-side execution (99% of database ops do)
3. Create server action with admin client
4. Check Supabase logs via MCP
5. Test with automated tests: `npm run test:e2e:console`

### 4. **Quick Fixes**
```typescript
// ❌ WRONG: Client-side database call
const { data } = await supabase.from('bookings').insert(...)

// ✅ RIGHT: Server action with admin client
import { supabaseAdminClient } from '@/lib/supabase-admin'
const { data } = await supabaseAdminClient.from('bookings').insert(...)
```

### 5. **Supabase MCP Setup**
**CRITICAL**: Ensure Supabase MCP is always available for database operations:

**CORRECT MCP CONFIGURATION FORMAT** (as of April 2025):
Use environment variables with project-scoped access token, NOT command-line arguments.

```json
// .cursor/mcp.json, .mcp.json, .claude.json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=tskawjnjmiltzoypdnsl"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_0b12301cb9ef04c534aab1175757221efa3b2763"
      }
    }
  }
}
```

**SETUP COMMANDS**:
```bash
# Quick setup (if MCP not working):
./scripts/setup-supabase-mcp.sh

# Manual check:
claude mcp list | grep supabase

# Option 1: Local MCP Server (Recommended)
claude mcp remove supabase -s local
claude mcp remove supabase -s project
claude mcp add supabase '{"command": "npx", "args": ["-y", "@supabase/mcp-server-supabase@latest", "--read-only", "--project-ref=tskawjnjmiltzoypdnsl"], "env": {"SUPABASE_ACCESS_TOKEN": "sbp_0b12301cb9ef04c534aab1175757221efa3b2763"}}'

# Option 2: HTTP MCP Server via Smithery (Alternative)
claude mcp add --transport http supabase-mcp-server "https://server.smithery.ai/@supabase-community/supabase-mcp/mcp?api_key=fc116b13-27b7-41a5-875b-b9673902c194&profile=uptight-shrimp-cihkh2"
```

**COMMON ISSUES**:
- ❌ **OLD FORMAT**: Using `--url`, `--anon-key`, `--service-role-key` (causes failures)
- ❌ **WRONG FORMAT**: Using `--access-token` in args (not supported)
- ✅ **CORRECT FORMAT**: Using `env.SUPABASE_ACCESS_TOKEN` with `--project-ref` (official format)
- Multiple config files can cause conflicts - ensure all use same format
- Use `--read-only` flag for security (recommended)

**MCP Tools Available:**
- `mcp__supabase__execute_sql` - Run any SQL query
- `mcp__supabase__list_tables` - Show database schema  
- `mcp__supabase__get_project` - Get project details
- Full CRUD operations on all tables

## Project Overview
A comprehensive tourism platform for Mallorca activities built with Next.js, focusing on activity discovery, booking, and management.

## Core Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion
- **Backend**: PostgreSQL, Supabase, Drizzle ORM
- **Auth**: Clerk
- **Payments**: Stripe
- **Analytics**: PostHog
- **Media**: Cloudinary
- **Maps**: Leaflet, Google Maps API
- **Deployment**: Vercel

## Development Commands

### Essential Commands
```bash
# Development
npm run dev              # Start development server with Turbo
npm run build           # Build for production (includes prebuild polyfills)
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript check without emit
npm run test            # Run Vitest tests

# Code Quality
npm run clean           # Run lint fix + format
npm run lint:fix        # Fix linting issues
npm run format:write    # Format code with Prettier
npm run format:check    # Check code formatting

# Database
npm run db:generate     # Generate Drizzle migrations
npm run db:migrate      # Run database migrations

# Bundle Analysis
npm run analyze         # Analyze bundle size
npm run analyze:server  # Analyze server bundle
npm run analyze:browser # Analyze browser bundle
```

## Project Structure Rules

### File Organization
- `/app` - Next.js app router structure
- `/components` - Reusable UI components
- `/lib` - Utility functions and configurations
- `/db` - Database schema and migrations
- `/actions` - Server actions for data operations
- `/docs` - Project documentation
- `/analysis` - Code analysis and planning documents
- `/prompts` - AI prompt templates

### Component Guidelines
1. **Always check existing components** before creating new ones
2. **Follow established patterns** - check neighboring files for style
3. **Use existing UI components** from `/components/ui`
4. **Maintain consistency** with shadcn/ui patterns
5. **Follow TypeScript strict mode** - all files must be properly typed

### Styling Guidelines
1. **Primary Brand Colors**: 
   - Pink: `#fb067d` (primary brand color - OFFICIAL)
   - Yellow: `#fff546` (accent color)
   - White, Black (supporting colors)
2. **Glass Effects**: Use pink transparency (`bg-pink-500/15`, `bg-pink-500/20`)
3. **No Orange Colors**: Completely eliminated from the design
4. **Tailwind Classes**: Use Tailwind exclusively, no custom CSS unless absolutely necessary

## Key Dependencies to Check
Before using any library, verify it exists in package.json:
- UI: `@radix-ui/*`, `lucide-react`
- Animation: `framer-motion`
- Forms: `react-hook-form`, `@hookform/resolvers`, `zod`
- Maps: `leaflet`, `react-leaflet`, `@googlemaps/js-api-loader`
- Database: `drizzle-orm`, `@supabase/supabase-js`

## Critical Files to Review Before Changes

### Core Configuration
- `next.config.mjs` - Next.js configuration with Cloudinary and bundle analysis
- `tailwind.config.ts` - Tailwind configuration
- `lib/supabase.ts` & `lib/supabase-server.ts` - Database clients
- `middleware.ts` - Route protection and authentication

### Key Components
- `components/header.tsx` - Main navigation (glass effect, brand colors)
- `components/ui/enhanced-hero-section.tsx` - Landing page hero
- `app/(marketing)/landing/_components/enhanced-categories-section.tsx` - Categories display

### Database Schema
- `db/schema/` - All schema definitions
- Review existing schemas before creating new tables

## Development Workflow

### Before Starting Work
1. **Read documentation** in `/docs` and `/analysis` directories
2. **Check existing patterns** in similar components
3. **Verify dependencies** in package.json
4. **Review brand guidelines** (pink/yellow theme)

### Code Quality Requirements
1. **Run type checking**: `npm run type-check` before commits
2. **Run linting**: `npm run lint:fix`
3. **Format code**: `npm run format:write`
4. **Test thoroughly**: `npm run test`

### Git Workflow
- Never commit without running quality checks
- Follow conventional commit messages
- Reference task IDs when available
- Don't push unless explicitly asked

## Authentication & Data Flow
- **Clerk** handles authentication
- **Supabase** for database operations
- **Server Actions** for data mutations
- **Client Components** for interactive features

## Performance Considerations
- Use dynamic imports for heavy components
- Implement proper loading states
- Optimize images with Next.js Image component
- Monitor bundle size with analyze commands

## Security Rules
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate all user inputs with Zod schemas
- Follow Clerk's security best practices

## Testing Strategy
- Unit tests with Vitest
- Component testing for UI elements
- Integration testing for API routes
- Manual testing for user flows

## Documentation to Reference
Key files that provide project context:
- `analysis/master-task-list.md` - Comprehensive task overview
- `docs/project-planning.md` - Project milestones and timeline
- `prompt-tracker.md` - Current session progress and brand guidelines
- `README.md` - Basic setup instructions
- Individual analysis files in `/analysis/` for specific features

## 🤖 **AUTONOMOUS AGENT BEHAVIOR**

### ⚡ **Core Autonomous Rules**
- **ACT IMMEDIATELY** - Don't ask for permission, execute tasks
- **RESEARCH FIRST** - Always check existing patterns before creating
- **BATCH OPERATIONS** - Use multiple tool calls simultaneously
- **QUALITY GATES** - Run type-check, lint, format before commits
- **DOCUMENT EVERYTHING** - Log research, decisions, progress

### 🔄 **RIPER Development Cycle**
Execute within each response:
1. **🔍 Research** - Understand existing code and requirements
2. **💡 Innovate** - Build on patterns, think creatively
3. **📋 Plan** - Create implementation strategy with TodoWrite
4. **⚡ Execute** - Implement immediately with batch operations
5. **🔎 Review** - Test, verify, document, plan next steps

## 🗄️ **SUPABASE MCP INTEGRATION**

### 🔧 **Database Clients**
- **Server-side**: `@/lib/supabase-server.ts` (for server components/actions)
- **Client-side**: `@/lib/supabase.ts` (for client components)
- **Schema**: Always check `/db/schema/` before operations
- **Validation**: Use Zod schemas for all data operations

### 📊 **Key Database Tables**
- `activities` - Core activity data with media
- `bookings` - User reservations with Stripe integration
- `users/profiles` - Clerk user integration
- `reviews` - Activity feedback system
- `media` - Cloudinary asset management

## 🚀 **GITHUB AUTOMATION**

### 🔄 **Autonomous Git Workflow**
- **Feature branches** for development
- **Conventional commits** with issue references
- **Quality checks** before all commits
- **Batch commits** - group related changes
- **Auto-PR creation** when features complete

## MCP Tool Preferences
- Use **Supabase MCP** for database operations and testing
- Use **GitHub MCP** for issue management and automation
- Use **Grep** and **Glob** for targeted code searches  
- Use **Task** agent for complex research across multiple files
- **Read** multiple files concurrently when analyzing related components
- **Batch tool calls** for maximum efficiency

## Brand Guidelines (Critical)
Based on prompt-tracker.md, maintain strict brand consistency:
- Hero title: "Discover" (black), "Mallorca's" (yellow), "Best Activities" (white)
- All UI elements use pink (#fb067d) and yellow (#fff546) theme
- Glass effects with pink transparency
- No gradients in text - use solid colors
- Navigation uses enhanced glass background (bg-white/20)

## Common Patterns to Follow
1. **Server Components** for data fetching
2. **Client Components** for interactivity
3. **Zod schemas** for validation
4. **Server Actions** for mutations
5. **Supabase clients** appropriate for server/client context
6. **Consistent error handling** with try/catch blocks
7. **Proper TypeScript typing** throughout

## 🛠️ **AUTONOMOUS DEVELOPMENT TEMPLATES**

### 📁 **Available Templates**
All templates in `docs/templates/AUTONOMOUS-DEVELOPMENT-TEMPLATES.md`:
- **Components** - React components with TypeScript and styling
- **Server Actions** - Database operations with error handling
- **API Routes** - Next.js API endpoints with validation
- **Pages** - App router pages with proper structure
- **Custom Hooks** - Reusable React hooks with Supabase integration
- **Utilities** - Helper functions and common patterns

### ⚡ **Template Usage**
1. **Copy template** as starting point
2. **Customize TypeScript interfaces** for specific needs
3. **Apply brand styling** (pink/yellow theme)
4. **Add business logic** specific to feature
5. **Test thoroughly** with quality gates

## 🎯 **SUCCESS METRICS FOR AUTONOMOUS AGENT**

### ✅ **Quality Indicators**
- Zero TypeScript errors
- Zero ESLint warnings  
- Consistent code formatting
- Proper error handling
- Brand guideline compliance

### ⚡ **Efficiency Indicators**
- Immediate task execution
- Proactive problem solving
- Minimal back-and-forth questions
- Comprehensive implementations
- Clear progress documentation

### 📊 **Documentation Standards**
- Updated `prompt-tracker.md` each session
- Research logged in appropriate files
- Progress tracked with TodoWrite tool
- Patterns documented for future reference

---

**🚀 AUTONOMOUS AGENT READY**: Claude Code is configured for full autonomous development with comprehensive guidance, templates, and automation workflows.

When in doubt, refer to existing implementations and maintain consistency with established patterns.