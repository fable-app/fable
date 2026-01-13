# Pull Request Workflow
**Fable Project - Version Control Process**

---

## Branch Strategy

### Main Branch: `main`
- Production-ready code
- Protected branch (requires PR approval)
- Deploys to **PROD** environment
- Direct feature branch merges allowed

### Feature Branches
```
feature/[component-name]     - New features
fix/[bug-description]        - Bug fixes
refactor/[area]              - Code refactoring
docs/[topic]                 - Documentation updates
chore/[task]                 - Maintenance tasks
```

### Environment Strategy

**TEST Environment:**
- Triggered by: Any PR to `main`
- Expo channel: `test`
- Purpose: Preview changes before production
- URL: Expo Go with `test` channel

**PROD Environment:**
- Triggered by: Merge to `main`
- Expo channel: `production`
- Purpose: Live app for users
- URL: Published app / App stores

---

## PR Workflow Process

### 1. Creating a Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/bilingual-reader

# Work on feature with focused commits
git add .
git commit -m "Add sentence card component"
git commit -m "Implement German/English rendering"
git commit -m "Add scroll behavior"

# Push to remote
git push origin feature/bilingual-reader
```

### 2. Opening a Pull Request

**PR Naming Convention:**
```
[Type] Brief description

Examples:
✨ Add BilingualReader component
🐛 Fix progress tracking calculation
♻️ Refactor story service
📝 Update design system docs
🔧 Configure EAS build profiles
```

**PR Description Template:**
```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation
- [ ] Configuration

## Changes Made
- Bullet point list of changes
- Be specific and clear
- Link to related issues if any

## Screenshots/Videos
[If UI changes, include visuals]

## Testing Checklist
- [ ] Tested on web
- [ ] Tested on Android (Expo Go)
- [ ] Tested on iOS (Expo Go) - if applicable
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Follows design system
- [ ] No performance regressions

## Design System Compliance
- [ ] Uses design tokens (colors, spacing, typography)
- [ ] Follows animation guidelines
- [ ] Matches component specs in DESIGN_SYSTEM.md
- [ ] Accessible (touch targets, contrast, screen reader)

## Related Documentation
- Link to design spec section
- Link to sprint plan task
- Link to related issues/PRs

## Breaking Changes
- [ ] None
- [ ] Yes (describe below)

## Notes for Reviewer
Any additional context or areas that need special attention
```

### 3. PR Review Process

**You (Reviewer) will:**
1. Review code quality and architecture
2. Check design system compliance
3. Verify testing checklist completion
4. Test the changes (PR deploys to TEST environment)
5. Request changes if needed
6. Approve when satisfied

**Agent (Author) will:**
1. Address all review comments
2. Make requested changes
3. Re-request review
4. Answer any questions

### 4. Merging the PR

**Merge Requirements:**
- ✅ 1 approval (from you)
- ✅ All CI checks passing
- ✅ No merge conflicts
- ✅ Commits will be squashed on merge

**Merge Process:**
```bash
# Via GitHub UI:
1. Click "Squash and merge"
2. Edit commit message if needed
3. Confirm merge
4. Delete feature branch automatically

# What happens:
- All commits squashed into one
- Merged to main
- Feature branch deleted
- PROD environment deploys
```

---

## PR Scoping Guidelines

### Option C: Mix of Granularity

**Large PRs - Major Features:**
When a feature is cohesive and tightly coupled:
- ✅ Entire BilingualReader component (if it's the first implementation)
- ✅ Story processing pipeline (scripts + utilities)
- ✅ Design system foundation (all tokens together)

**Small PRs - Sub-features:**
When a major feature can be broken down:
- ✅ BilingualReader: Header component
- ✅ BilingualReader: Sentence card rendering
- ✅ BilingualReader: Scroll behavior
- ✅ BilingualReader: Progress tracking integration

**Guidelines:**
- **Max ~500 lines changed per PR** (when possible)
- If PR grows large, consider splitting
- Each PR should be independently testable
- Each PR should add value on its own

**Examples of Good PR Splits:**

**Feature: BilingualReader Component**
```
PR #1: BilingualReader - Basic structure and layout
PR #2: BilingualReader - Sentence card component
PR #3: BilingualReader - Scroll and navigation
PR #4: BilingualReader - Reading position persistence
PR #5: BilingualReader - Animations and polish
```

**Feature: Story Collection**
```
PR #1: StoryCollection - List layout and cards
PR #2: StoryCollection - Progress indicator component
PR #3: StoryCollection - Touch interactions and navigation
PR #4: StoryCollection - Entry animations
```

**Feature: Content Pipeline**
```
PR #1: Story processing script foundation
PR #2: Translation integration
PR #3: Add first 3 German stories
PR #4: Add remaining 7 stories
```

---

## Environment Configuration

### TEST Environment

**Purpose:** Preview PRs before merging

**Configuration (`app.json`):**
```json
{
  "expo": {
    "extra": {
      "environment": "test"
    },
    "updates": {
      "url": "https://u.expo.dev/[project-id]"
    }
  }
}
```

**Expo channel:** `test`

**Access:**
```bash
# Build preview
eas build --profile preview --platform all

# Or use Expo Go with test channel
expo start --clear
# Scan QR with Expo Go
```

**Testing PRs:**
```bash
# When PR is created, you can test via:
1. Checkout the PR branch locally
2. Run: npm start
3. Open in Expo Go (test environment)
4. Verify changes work as expected
```

### PROD Environment

**Purpose:** Live app for users

**Configuration (`app.json`):**
```json
{
  "expo": {
    "extra": {
      "environment": "production"
    },
    "updates": {
      "url": "https://u.expo.dev/[project-id]"
    }
  }
}
```

**Expo channel:** `production`

**Deployment:**
- Automatic on merge to `main`
- EAS Build for app stores
- OTA updates for minor changes

---

## GitHub Configuration

### Branch Protection Rules (main)

**Settings → Branches → Add rule:**
```
Branch name pattern: main

Require pull request reviews before merging
  ✅ Required approvals: 1
  ✅ Dismiss stale reviews
  ☐ Require review from Code Owners

Require status checks to pass before merging
  ✅ Require branches to be up to date
  Status checks (when CI is set up):
    - lint
    - typecheck
    - test

☐ Require conversation resolution before merging
☐ Require signed commits
☐ Require linear history

Automatically delete head branches
  ✅ Enable (deletes feature branches after merge)
```

---

## Commit Message Conventions

### Format
```
<type>: <subject>

Examples:
feat: Add sentence card component
fix: Correct progress percentage calculation
refactor: Simplify story loading logic
docs: Update design system spacing guide
style: Format code with Prettier
chore: Update dependencies
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `docs`: Documentation
- `style`: Formatting, missing semi colons, etc.
- `test`: Adding tests
- `chore`: Maintain, dependencies, config

**Note:** These commits will be squashed, but good messages help during review

---

## Example PR Lifecycle

### Step-by-Step Example

**Scenario:** Implementing BilingualReader component

**1. Agent creates branch**
```bash
git checkout -b feature/bilingual-reader-foundation
```

**2. Agent implements**
- Creates `components/BilingualReader.tsx`
- Creates `components/SentenceCard.tsx`
- Adds basic layout and styling
- Implements German/English rendering

**3. Agent creates PR**
```
Title: ✨ Add BilingualReader component foundation

Description:
## Description
Implements the basic structure and layout for the BilingualReader component,
following the spec in DESIGN_SYSTEM.md.

## Type of Change
- [x] New feature

## Changes Made
- Created BilingualReader container component with header
- Implemented SentenceCard component for German/English pairs
- Added ScrollView with proper styling
- Applied design system tokens (colors, spacing, typography)
- Configured Literata font for reading content

## Screenshots
[Screenshot showing reader with sample German/English text]

## Testing Checklist
- [x] Tested on web
- [x] Tested on Android (Expo Go)
- [x] No TypeScript errors
- [x] No console warnings
- [x] Follows design system
- [x] No performance regressions

## Design System Compliance
- [x] Uses design tokens
- [x] Follows animation guidelines
- [x] Matches DESIGN_SYSTEM.md BilingualReader spec
- [x] Accessible (touch targets, contrast)

## Related Documentation
- Design spec: DESIGN_SYSTEM.md#bilingual-reader-component-spec
- Sprint task: SPRINT_PHASE_0.md Phase 1

## Breaking Changes
- [x] None

## Notes for Reviewer
- Scroll behavior is native (momentum scrolling)
- Ready for reading position persistence in next PR
- Uses mock data for now (real stories coming in content pipeline PR)
```

**4. You review**
- Pull branch locally
- Test on web and Expo Go
- Review code
- Leave comments if needed
- Approve when satisfied

**5. You merge**
- Click "Squash and merge"
- Squashed commit message:
```
✨ Add BilingualReader component foundation (#1)

Implements the basic structure and layout for the BilingualReader component.
Includes SentenceCard for German/English pairs with proper styling.
```
- Feature branch auto-deleted
- PROD environment updated

**6. Agent continues with next PR**
```bash
git checkout main
git pull
git checkout -b feature/bilingual-reader-scroll-behavior
```

---

## Confidence Building Path

### Phase 1: Full Review (Current)
- Review every PR
- Detailed testing
- Learn agent code quality
- Provide feedback

### Phase 2: Selective Review (After ~5-10 PRs)
- Review major features only
- Auto-merge minor tweaks/fixes
- Spot-check agent work

### Phase 3: High Autonomy (After ~20+ PRs)
- Agent merges most PRs
- You review weekly summaries
- Intervene only for critical changes

**You control the transition pace!**

---

## PR Review Checklist (For You)

**Code Quality:**
- [ ] Code is clean and readable
- [ ] TypeScript types are correct
- [ ] No unnecessary complexity
- [ ] Follows project conventions

**Design System:**
- [ ] Uses design tokens (not hardcoded values)
- [ ] Matches component specs
- [ ] Proper spacing and typography
- [ ] Animations follow guidelines

**Functionality:**
- [ ] Feature works as described
- [ ] No obvious bugs
- [ ] Edge cases handled
- [ ] Error states considered

**Testing:**
- [ ] Tested on web
- [ ] Tested on Android (when applicable)
- [ ] No console errors or warnings
- [ ] Performance is good

**Documentation:**
- [ ] Code is self-documenting or has comments
- [ ] README updated if needed
- [ ] Types are exported properly

---

## Quick Reference

### Common Git Commands

```bash
# Create feature branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "feat: Add my feature"

# Push to remote
git push origin feature/my-feature

# Update branch with latest main
git checkout main
git pull
git checkout feature/my-feature
git rebase main

# Delete local branch after merge
git branch -d feature/my-feature
```

### Common GitHub CLI Commands

```bash
# Create PR
gh pr create --title "✨ Add feature" --body "Description"

# View PRs
gh pr list

# Checkout PR locally
gh pr checkout <PR-number>

# Merge PR (squash)
gh pr merge <PR-number> --squash
```

---

## Tools & Templates

### GitHub PR Template

Created at: `.github/pull_request_template.md`

This template auto-populates when creating PRs via GitHub UI.

### VS Code Commit Message Extension (Optional)

For consistent commit messages, consider installing:
- "Conventional Commits" extension
- Provides commit message templates

---

## Summary

**Key Points:**
1. ✅ Feature branches off `main`
2. ✅ Two environments: TEST (PRs) and PROD (main)
3. ✅ Every PR reviewed by you
4. ✅ Squash commits on merge
5. ✅ Mix of large/small PRs (Option C)
6. ✅ ~500 lines max per PR when possible
7. ✅ Delete feature branches after merge

**Workflow is now documented and ready!**

---

**Last Updated:** 2026-01-13
**Status:** ✅ Active and Ready for Phase 1
