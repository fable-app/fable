# Fable - German Learning App
## Product Vision & Planning Document

---

## Vision Statement
Create a buttery smooth German learning app that embodies Japanese minimalist aesthetics. The experience should evoke the soft, inspiring feeling of holding premium Japanese stationery - beautiful, simple, and inviting immediate use.

---

## Core Features (MVP - v1.0)

### 1. Story Collection
- Curated German short stories from Project Gutenberg
- Clean, minimal list view with progress indicators
- Touch to resume from last reading position

### 2. Bilingual Reader
- E-ink inspired reading experience
- German sentence with English translation directly below
- Sans serif typography optimized for long-form reading
- Smooth scrolling and transitions

### 3. Progress Tracking
- Per-book progress percentage
- Persistent reading position
- Visual progress indicators in collection view

### Future Roadmap (Post-MVP)
- Toggle translation visibility
- Audio pronunciation guide
- Vocabulary tracking
- Spaced repetition system

---

## Technical Implementation Recommendations

### Platform Decision
**Recommendation: React Native (Expo)**

**Rationale:**
- Single codebase for iOS and Android
- Excellent performance for text-heavy apps
- Rich ecosystem for typography and animations
- Expo provides seamless development workflow
- Easy to achieve smooth, native-feeling UX

**Alternative Options:**
1. **Flutter** - Also cross-platform, excellent performance
2. **Native iOS (Swift)** - Best performance, iOS-only
3. **Web (React + PWA)** - Widest reach, good for MVP testing

### Architecture Overview

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (React Native/Expo Components)         │
│  - StoryCollection                      │
│  - BilingualReader                      │
│  - ProgressTracker                      │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│          State Management               │
│  (Zustand or Redux Toolkit)             │
│  - Reading state                        │
│  - Story catalog                        │
│  - User progress                        │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         Data & Services Layer           │
│  - Local SQLite (reading progress)      │
│  - AsyncStorage (preferences)           │
│  - Story content (JSON/bundled)         │
│  - Translation service                  │
└─────────────────────────────────────────┘
```

### Technology Stack

#### Core Framework
- **React Native** with **Expo** (SDK 50+)
- **TypeScript** for type safety
- **Expo Router** for navigation

#### State Management
- **Zustand** (lightweight, perfect for this use case)
- Alternative: **Redux Toolkit** (if planning complex features)

#### Local Storage
- **Expo SQLite** for progress tracking and bookmarks
- **AsyncStorage** for user preferences

#### UI/Styling
- **NativeWind** (Tailwind CSS for React Native) - for consistent design system
- **React Native Reanimated** for smooth animations
- **Gesture Handler** for intuitive interactions

#### Typography
- **@expo-google-fonts** - Recommended fonts:
  - **Inter** or **IBM Plex Sans** for UI
  - **Literata** or **Source Serif Pro** for reading
  - Consider **EB Garamond** for that premium feel

#### Content Management
- Pre-processed JSON format for stories
- Structure: `{ german: string, english: string, storyId: string, sentenceId: number }`

### Data Sources & Processing

#### Story Content
1. **Source**: Project Gutenberg German literature
2. **Processing Pipeline**:
   - Download German texts (plain text format)
   - Segment into sentences using NLP library
   - Translate via API or pre-translated corpus
   - Store in structured JSON format
   - Bundle with app or fetch on-demand

#### Translation Approach (Approved: Offline-first)
- Use DeepL API or Google Translate for initial translation
- Process all stories during development/build time
- Store translations in JSON format
- Bundle with app for complete offline experience
- No runtime API calls required

### Content Addition Workflow

For adding new stories post-MVP, we'll establish this workflow:

1. **Story Selection**
   - Find German story on Project Gutenberg
   - Verify copyright status (public domain)
   - Check length (~1000 words target)
   - Assess difficulty level

2. **Content Processing**
   - Download plain text
   - Clean formatting (remove headers, page numbers)
   - Run through sentence segmentation script
   - Generate unique story ID

3. **Translation**
   - Run through translation API
   - Review and refine translations
   - Ensure context accuracy
   - Store in JSON format

4. **Metadata Creation**
   - Story title (German + English)
   - Author information
   - Difficulty level (A1, A2, B1, etc.)
   - Word count
   - Estimated reading time

5. **Integration**
   - Add JSON to stories directory
   - Update story catalog/manifest
   - Test in app
   - Deploy update

**Tools to build:**
- Story processing script (Python/Node.js)
- Sentence segmentation utility
- Translation automation
- Metadata generator
- Validation checker

### Design System

#### Color Palette (Japanese Minimalism)
```
Primary Background: #FAFAF8 (warm off-white)
Text Primary: #2C2C2C (soft black)
Text Secondary: #6B6B6B (warm gray)
Accent: #8B9D83 (muted sage green)
Divider: #E8E8E6 (subtle gray)
Progress: #C9ADA7 (dusty rose)
```

#### Typography Scale
- Display: 28px (book titles)
- Heading: 20px (section headers)
- Body (German): 18px (reading text)
- Body (English): 16px (translation)
- Caption: 14px (metadata)

#### Spacing System
- Base unit: 4px
- Consistent 8px, 16px, 24px, 32px rhythm

#### Animations
- Duration: 200-300ms (snappy but not jarring)
- Easing: ease-out for entrances, ease-in-out for transitions
- Page transitions: subtle fade + slight vertical slide

---

## Claude Agent Workflow Setup

### Agent Roles & Responsibilities

#### 1. Designer Agent
**Responsibilities:**
- Create UI/UX specifications
- Design component layouts
- Define visual design system
- Review visual consistency
- Provide Figma-style component descriptions

**Deliverables:**
- Component specifications
- Design system documentation
- Visual mockups (text descriptions)
- Interaction patterns

#### 2. Developer Agent
**Responsibilities:**
- Implement features based on specs
- Write clean, type-safe code
- Follow React Native best practices
- Create reusable components
- Handle data layer implementation

**Deliverables:**
- Feature implementations
- Component code
- Data models and services
- Integration code

#### 3. Reviewer Agent
**Responsibilities:**
- Code review and quality checks
- Performance analysis
- Accessibility review
- UX consistency validation
- Suggest improvements

**Deliverables:**
- Code review comments
- Performance reports
- Bug findings
- Improvement suggestions

#### 4. Release Manager Agent
**Responsibilities:**
- Coordinate releases
- Manage versioning
- Test coordination
- Documentation updates
- Change log management

**Deliverables:**
- Release plans
- Version updates
- Deployment checklists
- Release notes

### Workflow Process

```
1. PLAN PHASE
   └─> Release Manager creates sprint plan
   └─> Designer creates feature specifications

2. DESIGN PHASE
   └─> Designer creates component specs
   └─> Developer reviews technical feasibility
   └─> You approve design direction

3. DEVELOPMENT PHASE
   └─> Developer implements features
   └─> Regular progress updates
   └─> Reviewer performs ongoing code review

4. REVIEW PHASE
   └─> Reviewer conducts comprehensive review
   └─> Developer addresses feedback
   └─> You perform final acceptance testing

5. RELEASE PHASE
   └─> Release Manager prepares release
   └─> Final testing and validation
   └─> Deployment and documentation
```

### Agent Communication Protocol

#### How It Works
- Each agent will be invoked using Claude Code's Task tool
- Agents will have clear, focused prompts defining their role
- Handoffs between agents will be explicit
- You review and approve key decisions
- All agent work tracked in a unified todo list

#### Invoking Agents (Examples)
```
Designer: "Design the BilingualReader component with Japanese minimalist aesthetic"
Developer: "Implement the BilingualReader component per design spec"
Reviewer: "Review the BilingualReader implementation for code quality and UX"
Release Manager: "Prepare v1.0 release checklist and documentation"
```

---

## Implementation Phases

### Phase 0: Project Setup (Week 1)
- [ ] Initialize Expo project with TypeScript
- [ ] Set up project structure
- [ ] Configure ESLint, Prettier
- [ ] Install core dependencies
- [ ] Set up design system foundations
- [ ] Create sample story data (1-2 stories)

### Phase 1: Core Reading Experience (Week 2-3)
- [ ] Design StoryCollection component
- [ ] Implement BilingualReader component
- [ ] Create typography system
- [ ] Build sentence-by-sentence rendering
- [ ] Implement smooth scrolling
- [ ] Add reading position persistence

### Phase 2: Story Collection (Week 3-4)
- [ ] Design collection list UI
- [ ] Implement progress tracking
- [ ] Create progress visualization
- [ ] Add touch interactions
- [ ] Implement resume functionality
- [ ] Process and add 10-15 stories

### Phase 3: Polish & Optimization (Week 4-5)
- [ ] Animation refinement
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Edge case handling
- [ ] User testing and feedback
- [ ] Bug fixes

### Phase 4: Release Preparation (Week 5-6)
- [ ] Final testing
- [ ] Documentation
- [ ] App store assets
- [ ] Privacy policy / terms
- [ ] Beta deployment
- [ ] Launch!

---

## ✅ Approved Implementation Decisions

### 1. Platform Priority
**Decision: Android first + Web PWA for rapid testing**
- Primary target: Android devices
- Web PWA for quick iteration and testing
- React Native + Expo enables both with single codebase

### 2. Content Strategy
**Decision: 10 stories, 1000 words each, mixed difficulty levels**
- Initial launch: 10 curated German short stories
- Story length: ~1000 words each
- Difficulty mix: Beginner, Intermediate, Advanced
- Need workflow for adding more stories post-launch

### 3. Translation Approach
**Decision: Offline-first (pre-translated and bundled)**
- All stories pre-translated and bundled with app
- No backend required for MVP
- Backend development planned for iteration 2

### 4. Development Environment
**Decision: MacBook + Simulator + Expo Go**
- Development on MacBook
- Testing via iOS/Android simulators
- Expo Go for quick previews and testing

### 5. Agent Workflow Preference
**Decision: Parallel work with handoff reviews**
- Agents work in parallel for efficiency
- Review handoffs between agents
- Progress toward more autonomy as confidence builds

---

## Recommended Starting Point

**My Recommendation: Start with React Native + Expo**

**First Sprint:**
1. Set up Expo project with TypeScript
2. Create design system (colors, typography, spacing)
3. Build BilingualReader prototype with 1 sample story
4. Get the "feel" right before expanding

**Why this approach?**
- Fastest path to validating the core experience
- Single codebase for future iOS/Android deployment
- Excellent developer experience with hot reload
- Easy to share prototypes via Expo Go

**Agent Workflow:**
- Start with Designer + Developer working in tandem
- Add Reviewer after first components are built
- Release Manager joins when approaching v1.0

---

## Next Steps

Please review this plan and let me know:

1. ✅ **Approve overall direction** or suggest changes
2. 📱 **Platform choice** - React Native, Flutter, Native iOS, or Web?
3. 📚 **Content decisions** - Story count, length, sourcing approach
4. 🤖 **Agent workflow** - Sequential or parallel? Review frequency?
5. 🚀 **Timeline** - Is 5-6 weeks realistic for you? Need to adjust?

Once you approve, I'll assemble the agent team and we'll start with Phase 0: Project Setup!

---

**Ready to build something beautiful? Let's make Fable a reality! 🎯**
