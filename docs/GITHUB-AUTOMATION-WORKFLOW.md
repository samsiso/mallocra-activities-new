# 🚀 **GitHub Automation Workflow for Claude Code**

---

## 🎯 **GitHub MCP Integration Setup**

### 🔧 **MCP Configuration**
```json
{
  "mcps": {
    "github": {
      "repository": "mallocra-activities",
      "owner": "your-username",
      "default_branch": "main",
      "token": "env:GITHUB_TOKEN"
    }
  }
}
```

### 🌟 **Repository Information**
- **Project**: Mallorca Activities Platform
- **Tech Stack**: Next.js 15, TypeScript, Supabase, Tailwind
- **Main Branch**: `main`
- **Development**: Feature branches → main
- **Deployment**: Vercel (auto-deploy from main)

---

## 🔄 **Autonomous Git Workflow**

### 📋 **Branch Strategy**
```bash
main                    # Production branch (protected)
├── feature/booking-system     # New feature development
├── fix/payment-validation     # Bug fixes  
├── docs/claude-setup         # Documentation updates
└── refactor/component-cleanup # Code improvements
```

### ⚡ **Automated Workflow Process**
1. **Create feature branch** from main
2. **Develop autonomously** with frequent commits
3. **Run quality checks** before major commits
4. **Create pull request** when feature complete
5. **Merge to main** after review

---

## 🤖 **Autonomous Git Operations**

### 🔧 **Branch Management**
```bash
# Create and switch to feature branch
git checkout -b feature/activity-booking-enhancement

# Regular development commits
git add .
git commit -m "feat: add booking calendar integration"

# Push feature branch
git push -u origin feature/activity-booking-enhancement
```

### 📋 **Commit Message Standards**
```bash
# Feature additions
feat: add booking calendar with availability checks
feat(api): implement weather integration for activities

# Bug fixes  
fix: resolve payment validation error in booking flow
fix(auth): handle Clerk user sync edge cases

# Documentation
docs: update API documentation for activities endpoint
docs(setup): add Claude Code configuration guide

# Refactoring
refactor: optimize activity card component performance
refactor(db): improve database query efficiency

# Performance improvements
perf: lazy load activity images for better UX
perf(bundle): reduce JavaScript bundle size by 30%
```

### 🎯 **Quality Gates Before Commits**
```bash
# Always run before major commits
npm run type-check      # TypeScript validation
npm run lint:fix        # ESLint with fixes
npm run format:write    # Prettier formatting
npm run test           # Unit tests (if available)
```

---

## 📊 **Issue Management Automation**

### 🏷️ **Issue Templates & Labels**
```markdown
# Bug Report Template
**Bug Description:** Clear description of the issue
**Steps to Reproduce:** 1. Go to... 2. Click... 3. See error
**Expected Behavior:** What should happen
**Actual Behavior:** What actually happens
**Environment:** Browser, OS, etc.

# Feature Request Template  
**Feature Description:** What feature is needed
**User Story:** As a [user], I want [goal] so that [benefit]
**Acceptance Criteria:** - [ ] Criteria 1 - [ ] Criteria 2
**Technical Notes:** Implementation considerations
```

### 🎯 **Automated Issue Creation**
```bash
# Use GitHub CLI for issue automation
gh issue create \
  --title "feat: enhance booking system with calendar view" \
  --body "User story: As a customer, I want to select dates on a calendar..." \
  --label "enhancement,booking-system" \
  --milestone "Q2-2025"
```

### 📋 **Issue Labels System**
- **Type**: `bug`, `enhancement`, `documentation`, `refactor`
- **Priority**: `high`, `medium`, `low`, `critical`
- **Component**: `frontend`, `backend`, `database`, `auth`, `payments`
- **Status**: `in-progress`, `needs-review`, `blocked`, `ready`

---

## 🚀 **Pull Request Automation**

### 📝 **PR Template**
```markdown
## Summary
Brief description of changes made

## Changes Made
- [ ] Added booking calendar component
- [ ] Integrated with Supabase for availability
- [ ] Added TypeScript interfaces
- [ ] Updated documentation

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass  
- [ ] Manual testing completed
- [ ] No TypeScript errors
- [ ] No linting errors

## Screenshots
[Add screenshots if UI changes]

## Breaking Changes
None / [Describe any breaking changes]

## Checklist
- [ ] Code follows project conventions
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No secrets committed
```

### ⚡ **Automated PR Creation**
```bash
# Create PR with GitHub CLI
gh pr create \
  --title "feat: enhance booking system with calendar integration" \
  --body-file .github/pull_request_template.md \
  --base main \
  --head feature/booking-calendar \
  --label "enhancement" \
  --reviewer "@team"
```

---

## 📊 **Project Management Integration**

### 🎯 **Milestone Tracking**
```markdown
## Q2 2025 Roadmap
- **Landing Page v2** (Due: April 30)
  - Enhanced hero section ✅
  - Categories redesign ✅  
  - Performance optimization 🔄
  
- **Booking System v2** (Due: May 31)
  - Calendar integration 📋
  - Payment flow enhancement 📋
  - Email notifications 📋

- **Admin Dashboard v2** (Due: June 30)
  - Real-time analytics 📋
  - Advanced reporting 📋
  - User management 📋
```

### 📋 **Task Automation with Issues**
```bash
# Link commits to issues automatically
git commit -m "feat: add calendar view

Resolves #123
Implements booking calendar with availability checks"

# Reference issues in commits
git commit -m "fix: payment validation (refs #145)"
```

---

## 🔍 **Code Review Automation**

### 📝 **Review Checklist**
```markdown
## Code Review Checklist
### Functionality
- [ ] Code works as expected
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] Performance considerations

### Code Quality
- [ ] TypeScript properly used
- [ ] No console.logs left
- [ ] Proper component patterns
- [ ] Following project conventions

### Security
- [ ] No secrets in code
- [ ] Proper input validation
- [ ] Authentication checks
- [ ] SQL injection prevention

### Testing
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Manual testing done
- [ ] No breaking changes
```

### 🤖 **Automated Checks**
```yaml
# GitHub Actions workflow
name: Code Quality
on: [pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Type check
        run: npm run type-check
      - name: Lint
        run: npm run lint
      - name: Format check
        run: npm run format:check
      - name: Test
        run: npm run test
```

---

## 📈 **Progress Tracking & Analytics**

### 📊 **Development Metrics**
```markdown
## Weekly Development Report
- **Commits**: 45 commits this week
- **PRs**: 8 merged, 2 pending review
- **Issues**: 12 closed, 5 new
- **Lines of Code**: +2,341 additions, -867 deletions
- **Test Coverage**: 78% (target: 80%)
```

### 🎯 **Milestone Progress**
```bash
# Track milestone progress with GitHub CLI
gh api repos/:owner/:repo/milestones \
  --jq '.[] | {title: .title, progress: (.closed_issues / .open_issues * 100)}'
```

---

## 🔄 **Automated Deployment Pipeline**

### 🚀 **Vercel Integration**
```markdown
## Deployment Workflow
1. **Feature Branch** → Vercel Preview Deploy
2. **PR Created** → Automated testing + preview
3. **PR Merged** → Production deployment
4. **Post-deploy** → Health checks + monitoring
```

### 📋 **Deployment Checklist**
```bash
# Pre-deployment checks
- [ ] All tests pass
- [ ] No TypeScript errors  
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Performance metrics acceptable

# Post-deployment verification
- [ ] Site loads correctly
- [ ] Key features work
- [ ] Analytics tracking active
- [ ] Error monitoring active
```

---

## 🛠️ **GitHub CLI Automation Scripts**

### 📋 **Common Operations**
```bash
# Create feature branch and push
create-feature() {
  git checkout -b "feature/$1"
  git push -u origin "feature/$1"
  echo "Feature branch created: feature/$1"
}

# Finish feature (create PR)
finish-feature() {
  git push origin HEAD
  gh pr create --fill
}

# Quick commit with conventional format
qcommit() {
  git add .
  git commit -m "$1"
  git push
}
```

### 🎯 **Issue Management**
```bash
# Bulk issue creation from task list
create-issues-from-tasks() {
  while IFS= read -r task; do
    gh issue create --title "$task" --label "task"
  done < tasks.txt
}

# Auto-assign issues to milestones
assign-to-milestone() {
  gh issue list --state open --json number,title |
  jq -r '.[] | select(.title | contains("booking")) | .number' |
  xargs -I {} gh issue edit {} --milestone "Booking System v2"
}
```

---

## 📊 **Autonomous Development Metrics**

### 🎯 **Success Indicators**
- **Code Quality**: 0 TypeScript errors, 0 ESLint warnings
- **Test Coverage**: >80% coverage maintained
- **PR Review Time**: <24 hours average
- **Deployment Success**: >99% successful deployments
- **Issue Resolution**: <7 days average resolution time

### 📈 **Tracking Dashboard**
```bash
# Generate development report
gh api repos/:owner/:repo/stats/contributors |
jq '.[] | {author: .author.login, commits: .total, additions: .weeks[-1].a, deletions: .weeks[-1].d}'
```

---

**🚀 Key Takeaway**: Automate repetitive GitHub tasks while maintaining high code quality and clear project tracking. Use GitHub CLI and MCP integration for efficient autonomous development workflow.