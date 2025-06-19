# 🚀 **Claude Code Autonomous Agent Rules for Mallorca Activities**

---

## 🎯 **CORE AUTONOMOUS DEVELOPMENT RULES**

### ⚡ **Technology Stack (PROJECT SPECIFIC)**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Frontend**: React 18+ (functional components + hooks)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase + PostgreSQL with Drizzle ORM
- **Auth**: Clerk
- **Payments**: Stripe
- **Media**: Cloudinary
- **Maps**: Leaflet + Google Maps API
- **Analytics**: PostHog
- **Icons**: Lucide React only

---

## 🔴 **CRITICAL AUTONOMOUS BEHAVIOR RULES**

### 🤖 **Agent Autonomy (MANDATORY)**
- **ACT IMMEDIATELY** - Don't ask for permission, execute tasks
- **RESEARCH FIRST** - Always check existing code patterns before creating
- **BATCH OPERATIONS** - Use multiple tool calls simultaneously for efficiency
- **SELF-DIRECT** - Plan next steps and execute without waiting
- **PROBLEM SOLVE** - Debug and fix issues autonomously
- **QUALITY GATE** - Run type-check, lint, format before any commits

### 🔄 **Git Workflow (AUTOMATED)**
- **NO auto-push** after every single change
- **Batch commits** - Group related changes logically
- **Branch strategy** - Work on feature branches, merge to main when complete
- **Commit messages** - Use conventional commits with issue references
- **Quality checks** - Always run `npm run type-check` and `npm run lint:fix` before commits

### 📝 **Documentation (AUTONOMOUS)**
- **Log everything** - Research findings, decisions, changes
- **Update trackers** - Keep prompt-tracker.md and progress.md current
- **Knowledge base** - Add discoveries to appropriate analysis documents
- **Template usage** - Reference and extend existing templates

---

## 🧠 **RIPER AUTONOMOUS SYSTEM**

Execute the full RIPER cycle autonomously within each response:

### 🔍 **1. RESEARCH** (First, Always)
- Read existing code patterns and documentation
- Check database schema in `/db/schema/`
- Review brand guidelines and project requirements
- Use Grep, Glob, and Task tools to understand codebase
- Verify dependencies in package.json

### 💡 **2. INNOVATE** (Think Creatively)
- Build on existing patterns rather than reinventing
- Consider performance, accessibility, and user experience
- Leverage existing components and utilities
- Follow established architectural patterns

### 📋 **3. PLAN** (Strategy Before Action)
- Create implementation steps in TodoWrite
- Identify files that need changes
- Plan component hierarchy and data flow
- Consider error handling and edge cases

### ⚡ **4. EXECUTE** (Autonomous Implementation)
- Make changes immediately using batch tool calls
- Test changes in development environment
- Fix any issues that arise during implementation
- Update related files (imports, types, etc.)

### 🔎 **5. REVIEW** (Quality Assurance)
- Run quality checks (type-check, lint, format)
- Test functionality in browser
- Update documentation and progress tracking
- Plan next logical steps

---

## 📊 **DATABASE & SUPABASE WORKFLOW**

### 🔧 **Supabase MCP Integration**
- **Use server-side client** - `@/lib/supabase-server.ts` for server components/actions
- **Use client-side client** - `@/lib/supabase.ts` for client components
- **Schema first** - Always check `/db/schema/` before database operations
- **Server actions** - Use for all mutations and data operations
- **Type safety** - Generate types from Drizzle schema

### 🗄️ **Database Operation Patterns**
```typescript
// Server Action Pattern
'use server'
import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'

// Client Component Pattern  
'use client'
import { createClient } from '@/lib/supabase'
```

### 📋 **Schema Understanding**
Key tables to know:
- `activities` - Core activity data
- `bookings` - User reservations
- `users` - User profiles (Clerk integration)
- `reviews` - Activity reviews
- `media` - Cloudinary media assets

---

## 🛠️ **DEVELOPMENT WORKFLOW AUTOMATION**

### 🔍 **Before Starting Any Task**
1. **Read project context** - Check CLAUDE.md and relevant docs
2. **Search existing code** - Use Grep/Glob to find similar patterns
3. **Check brand guidelines** - Maintain pink (#fa057c) + yellow (#fff546) theme
4. **Verify dependencies** - Ensure required packages are available
5. **Update todo list** - Track task progress with TodoWrite

### ⚡ **During Implementation**
1. **Batch tool calls** - Read multiple files simultaneously
2. **Follow patterns** - Use existing component structures
3. **Type everything** - Strict TypeScript, no `any` types
4. **Handle errors** - Proper try/catch and error boundaries
5. **Test immediately** - Verify changes work correctly

### ✅ **After Implementation**
1. **Quality checks** - Run type-check, lint:fix, format:write
2. **Documentation** - Update relevant analysis/thought logs
3. **Progress tracking** - Update prompt-tracker.md
4. **Next steps planning** - Identify follow-up tasks

---

## 🌐 **GITHUB INTEGRATION WORKFLOW**

### 📋 **Issue Management**
- Reference existing issues in commits
- Create new issues for discovered bugs/features
- Use proper labels and milestones
- Link PRs to issues automatically

### 🔄 **Branch Strategy**
- Feature branches for new development
- Descriptive branch names: `feature/booking-system-enhancement`
- Regular merges to avoid conflicts
- Clean up merged branches

### 💬 **Commit Standards**
```bash
feat: add booking calendar integration
fix: resolve payment flow validation errors
docs: update API documentation for activities
refactor: optimize activity card performance
```

---

## 🎨 **COMPONENT DEVELOPMENT STANDARDS**

### 🔧 **Component Creation Rules**
- **Check existing first** - Search for similar components
- **Follow shadcn patterns** - Use established UI component patterns
- **TypeScript interfaces** - Explicit prop typing
- **Error boundaries** - Proper error handling
- **Loading states** - User feedback during async operations
- **Accessibility** - ARIA labels and keyboard navigation

### 🎯 **Brand Consistency**
- **Colors**: Pink (#fa057c) primary, Yellow (#fff546) accent
- **Glass effects**: Pink transparency (bg-pink-500/15)
- **Typography**: Follow existing text hierarchy
- **Spacing**: Consistent Tailwind spacing scale
- **Animations**: Framer Motion for interactions

---

## 📁 **FILE STRUCTURE & ORGANIZATION**

### 🗂️ **Key Directories**
- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/lib` - Utilities, configurations, database clients
- `/actions` - Server actions for data operations
- `/db` - Database schema and migrations
- `/docs` - Project documentation and analysis
- `/analysis` - Code analysis and task planning

### 📄 **Documentation Hierarchy**
- `CLAUDE.md` - Main configuration (read first)
- `analysis/master-task-list.md` - Current tasks
- `prompt-tracker.md` - Session progress
- `docs/project-planning.md` - Roadmap and milestones
- Individual analysis files for specific features

---

## ⚡ **AUTONOMOUS ACTION CHECKLIST**

### 🎯 **Every Response Must Include:**
1. **Immediate action** - Don't ask, just do
2. **Multiple tool calls** - Batch operations for efficiency
3. **Progress updates** - Update TodoWrite with current status
4. **Quality verification** - Check types and linting
5. **Next steps planning** - Clear direction for continuation

### 🔄 **Response Format Requirements**
- Use horizontal dividers (`---`) for sections
- Include emojis for visual organization
- Always end with:
  - Current task status
  - Next logical action
  - Files modified/created
  - Any issues discovered

---

## 🧪 **TESTING & QUALITY STANDARDS**

### ✅ **Quality Gates (MANDATORY)**
```bash
npm run type-check    # TypeScript validation
npm run lint:fix      # ESLint with auto-fix
npm run format:write  # Prettier formatting
npm run test          # Unit tests (when available)
```

### 🎯 **Performance Standards**
- Bundle size monitoring with analyze commands
- Lazy loading for heavy components
- Optimized images with Next.js Image
- Proper caching strategies

---

## 🚀 **AUTONOMOUS AGENT SUCCESS METRICS**

### 📊 **Code Quality Indicators**
- Zero TypeScript errors
- Zero ESLint warnings
- Consistent code formatting
- Proper error handling throughout

### ⚡ **Development Efficiency**
- Immediate task execution
- Minimal back-and-forth questioning
- Proactive problem solving
- Comprehensive change implementation

### 📝 **Documentation Quality**
- Updated progress tracking
- Clear change documentation
- Research findings logged
- Pattern documentation maintained

---

## 🛡️ **SECURITY & BEST PRACTICES**

### 🔒 **Security Rules**
- Never commit secrets or API keys
- Validate all user inputs with Zod
- Use environment variables properly
- Follow Clerk authentication patterns
- Implement proper CSRF protection

### 🎯 **Performance Best Practices**
- Use React.memo for expensive components
- Implement proper loading states
- Optimize database queries
- Use proper caching strategies
- Monitor bundle size

---

**🕒 Last Updated**: 2025-01-25  
**🎯 Focus**: Autonomous Next.js + Supabase Development  
**📊 Status**: Production-ready autonomous agent rules  
**🚀 Goal**: Maximum development efficiency with minimal oversight