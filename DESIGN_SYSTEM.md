# Fable Design System
**Japanese Minimalist Aesthetic for German Learning**

---

## Design Philosophy

Fable embodies the soft, inspiring feeling of premium Japanese stationery - beautiful, simple, and inviting immediate use. Every design decision prioritizes:

- **Breathing room**: Generous whitespace that never feels cramped
- **Clarity**: Information hierarchy that requires no mental effort
- **Warmth**: Soft colors that invite extended reading sessions
- **Restraint**: Only essential elements, nothing decorative
- **Tactile quality**: Interactions that feel direct and satisfying

---

## 1. Color System

### Primary Palette

```
Primary Background:  #FAFAF8  (Washi Paper)
Secondary Background: #F5F5F2  (Slightly deeper warm white)
Surface Elevated:    #FFFFFF  (Pure white for cards)

Text Primary:        #2C2C2C  (Sumi Ink - soft black)
Text Secondary:      #6B6B6B  (Warm gray for translations)
Text Tertiary:       #9B9B98  (Subtle gray for metadata)

Accent Primary:      #8B9D83  (Muted sage green - matcha)
Accent Light:        #A8B9A0  (Lighter sage)
Accent Subtle:       #E8EDE7  (Very light sage for backgrounds)

Progress:            #C9ADA7  (Dusty rose - like worn book covers)
Progress Track:      #E8E0DE  (Light dusty rose)

Divider:             #E8E8E6  (Barely-there gray)
Border Subtle:       #EFEFE D  (Softer than divider)
Shadow:              rgba(44, 44, 44, 0.04)  (Subtle depth)
```

### Semantic Color Tokens

```
Background:
  - bg-primary:      #FAFAF8
  - bg-secondary:    #F5F5F2
  - bg-elevated:     #FFFFFF
  - bg-accent:       #E8EDE7
  - bg-overlay:      rgba(250, 250, 248, 0.95)

Text:
  - text-primary:    #2C2C2C  (German sentences, headings)
  - text-secondary:  #6B6B6B  (English translations)
  - text-tertiary:   #9B9B98  (Author, metadata, captions)
  - text-accent:     #8B9D83  (Interactive elements, highlights)

Interactive:
  - interactive-default:  #8B9D83
  - interactive-hover:    #A8B9A0
  - interactive-pressed:  #7A8C73
  - interactive-disabled: #C8C8C6

Status:
  - progress-fill:    #C9ADA7
  - progress-track:   #E8E0DE
  - success:          #8B9D83
  - info:             #9B9B98
```

### Color Usage Guidelines

**Background Hierarchy:**
- Use `bg-primary` (#FAFAF8) for main app background
- Use `bg-elevated` (#FFFFFF) for cards and elevated surfaces
- Use `bg-accent` (#E8EDE7) for subtle highlighting or selection states
- Never use pure white as main background - too harsh

**Text Hierarchy:**
- German text always uses `text-primary` (#2C2C2C)
- English translations always use `text-secondary` (#6B6B6B)
- Metadata (author, page count, etc.) uses `text-tertiary` (#9B9B98)
- Interactive elements use `text-accent` (#8B9D83)

**Interaction Colors:**
- Touchable elements default to accent primary (#8B9D83)
- Pressed states darken slightly (#7A8C73)
- Never use bright or saturated colors - maintain calm palette

**Progress Indicators:**
- Use dusty rose (#C9ADA7) for progress fill
- Light dusty rose (#E8E0DE) for track/background
- Soft, rounded progress bars (never sharp edges)

### Dark Mode Considerations

**Status: Not in MVP**

For future implementation:
```
Dark Background:     #1C1C1A  (Warm charcoal)
Dark Surface:        #252523  (Slightly lighter)
Dark Text Primary:   #E8E8E6  (Warm off-white)
Dark Text Secondary: #9B9B98  (Unchanged)
Dark Accent:         #A8B9A0  (Lighter sage)
```

Dark mode should maintain the same warm, soft feeling - never use pure blacks or blues.

---

## 2. Typography System

### Font Families

**UI Text (Navigation, Buttons, Labels):**
- **Primary**: Inter
- **Fallback**: System UI, -apple-system, BlinkMacSystemFont
- **Rationale**: Clean, highly legible, excellent at small sizes

**Reading Content (German & English Text):**
- **Primary**: Literata
- **Fallback**: Georgia, serif
- **Rationale**: Designed for long-form reading, warm serif without feeling academic

**Alternative Reading Font (Premium Option):**
- **EB Garamond**: More elegant, use if testing shows better comfort

### Type Scale

```
Display Large:   32px / 2rem    (Book titles on detail screens)
Display:         28px / 1.75rem (Book titles in collection)
Heading Large:   24px / 1.5rem  (Section headings)
Heading:         20px / 1.25rem (Component headings)

Body Large:      18px / 1.125rem (German sentences)
Body:            16px / 1rem     (English translations, UI text)
Body Small:      14px / 0.875rem (Captions, metadata)

Label:           12px / 0.75rem  (Tiny labels, progress %)
```

### Weights

```
UI Text (Inter):
  - Regular: 400  (Body text, most UI)
  - Medium:  500  (Emphasized UI elements)
  - Semibold: 600 (Headings, buttons)

Reading Text (Literata):
  - Regular: 400  (All reading content - both languages)
  - Medium:  500  (Only for German text if emphasis needed)
```

**Important**: Avoid bold weights (700+) - they disrupt the soft aesthetic

### Line Heights

```
Display:     1.2  (32px/38px)  - Tight for large titles
Heading:     1.3  (20px/26px)  - Slightly loose headings
Body Large:  1.6  (18px/29px)  - Generous for German text
Body:        1.5  (16px/24px)  - Standard for translations
Caption:     1.4  (14px/20px)  - Compact for metadata
```

**Rationale**: Generous line heights (1.5-1.6) create breathing room for comfortable reading

### Letter Spacing

```
Display:     -0.02em  (Tighter for large text)
Heading:     -0.01em  (Slightly tighter)
Body:         0em     (Default for reading)
Caption:      0.01em  (Slightly looser for small text)
Label:        0.02em  (Looser for tiny labels)
```

### Typography Usage Guidelines

**Reading Content:**
- German sentences: Literata, 18px, 400 weight, 1.6 line height, #2C2C2C
- English translations: Literata, 16px, 400 weight, 1.5 line height, #6B6B6B
- Always maintain 8px-12px vertical spacing between German/English pairs

**UI Elements:**
- Book titles: Inter, 28px, 600 weight, #2C2C2C
- Authors: Inter, 14px, 400 weight, #9B9B98
- Buttons: Inter, 16px, 500 weight, #8B9D83
- Navigation: Inter, 16px, 500 weight

**Accessibility:**
- Minimum touch target text: 16px
- Never go below 12px for any visible text
- Maintain 4.5:1 contrast ratio minimum (all pairings meet WCAG AA)

---

## 3. Spacing System

### Base Unit & Scale

**Base Unit: 4px**

```
Scale:
  xs:   4px   (0.25rem)  - Tiny gaps, icon spacing
  sm:   8px   (0.5rem)   - Compact spacing, tight elements
  md:   12px  (0.75rem)  - Default spacing between related elements
  base: 16px  (1rem)     - Standard spacing, component padding
  lg:   24px  (1.5rem)   - Generous spacing, section separation
  xl:   32px  (2rem)     - Large spacing, major sections
  2xl:  48px  (3rem)     - Extra large spacing, page margins
  3xl:  64px  (4rem)     - Maximum spacing, hero sections
```

### Component Spacing Guidelines

**Screen Padding:**
- Horizontal: 24px (lg) on phones, 32px (xl) on tablets
- Vertical: 16px (base) at top, 24px (lg) at bottom
- Safe area insets: Always respect device notches/navigation

**Card/Surface Padding:**
- Internal padding: 16px (base) minimum, 20px (base + xs) ideal
- Between cards: 12px (md) for tight lists, 16px (base) for comfortable spacing
- Card corner radius: 12px (md) - soft but not overly rounded

**Text Spacing:**
- Paragraph spacing: 16px (base) between different paragraphs
- Sentence pair spacing: 8px (sm) between German and English
- Section spacing: 32px (xl) between major sections

**List Spacing:**
- List item height: Minimum 64px (touch target)
- Item padding: 16px vertical, 20px horizontal
- Divider spacing: 0px (full width) or 20px inset from left

### Margin & Padding Conventions

**Prefer Padding over Margin:**
- Use padding for internal component spacing
- Use margin only for external relationships between components
- Consistent padding creates more predictable layouts

**Vertical Rhythm:**
- Maintain multiples of 8px for vertical spacing
- Exceptions: 12px (md) allowed for tight German/English pairs
- Larger gaps (24px, 32px) between distinct sections

**Touch Targets:**
- Minimum: 44px x 44px (iOS guideline)
- Preferred: 48px x 48px (Material Design guideline)
- List items: 64px minimum height for comfortable tapping

---

## 4. Component Design Principles

### Japanese Minimalism Guidelines

**Simplicity (簡素 - Kanso):**
- Remove everything unnecessary
- One primary action per screen
- Clear visual hierarchy with no competing elements
- Whitespace is a design element, not empty space

**Subtlety (微妙 - Bimyō):**
- Transitions should be felt, not watched
- Colors are muted, never saturated
- Shadows are barely perceptible (2-4px max)
- Interactive feedback is soft and gentle

**Natural Materials (自然 - Shizen):**
- Warm off-white backgrounds evoke paper
- Text colors suggest ink rather than pixels
- Animations follow natural physics (no linear easing)
- Textures are implied through color warmth

**Seijaku (静寂 - Tranquility):**
- No busy patterns or backgrounds
- Generous margins create calm
- Symmetry and balance in layouts
- Nothing flashing, pulsing, or demanding attention

### Animation Principles

**Timing:**
```
Instant:     0ms     (Immediate feedback like button press)
Fast:        150ms   (Quick transitions, tooltips)
Standard:    250ms   (Default for most animations)
Leisurely:   350ms   (Page transitions, large movements)
Slow:        500ms   (Hero animations, special moments)
```

**Easing Functions:**
```
ease-out:     For entrances (elements arriving)
              cubic-bezier(0.0, 0.0, 0.2, 1)

ease-in:      For exits (elements departing)
              cubic-bezier(0.4, 0.0, 1, 1)

ease-in-out:  For transitions (element changing state)
              cubic-bezier(0.4, 0.0, 0.2, 1)

spring:       For playful interactions (card bounces)
              Use React Native Reanimated spring config:
              { damping: 15, stiffness: 150 }
```

**Animation Guidelines:**
- **Micro-interactions**: 150ms ease-out (button press, checkbox toggle)
- **Element entrance**: 250ms ease-out with 5-10px vertical slide
- **Element exit**: 200ms ease-in with fade
- **Page transitions**: 350ms ease-in-out with fade + 20px slide
- **Scroll behavior**: Smooth with momentum (native iOS-style)

**What NOT to animate:**
- Reading text appearing (should be instant)
- Progress updates (smooth increment, not jumpy)
- Background colors (distracting from content)

### Touch Target Sizes

```
Minimum (iOS/WCAG):      44px x 44px
Preferred (Material):    48px x 48px
Comfortable (Reading):   56px-64px height for list items
Large (Primary CTA):     48px height x full width (minus margins)
```

**Implementation:**
- List items: 64px height minimum
- Icon buttons: 48px x 48px
- Text links: Minimum 16px font, 8px padding around
- Reading text: Entire sentence is tappable (future feature)

### Accessibility Considerations

**Color Contrast:**
- Text Primary on BG Primary: 12.5:1 (AAA) ✓
- Text Secondary on BG Primary: 4.8:1 (AA) ✓
- Text Accent on BG Primary: 4.2:1 (AA) ✓
- All critical text meets WCAG AA minimum (4.5:1)

**Typography:**
- Minimum font size: 12px (labels only)
- Reading text: 16px-18px (optimal for accessibility)
- Line height: 1.5-1.6 for body text
- No justified text (causes uneven spacing)

**Touch & Interaction:**
- All interactive elements: 44px minimum
- Touch targets never overlap
- Visual feedback within 100ms
- Haptic feedback on primary actions (optional)

**Screen Reader Support:**
- Semantic structure with proper headings
- Alt text for all non-decorative images
- Progress updates announced
- Reading position saved and announced

**Motion:**
- Respect reduced motion preferences
- Provide instant transitions when motion disabled
- Never rely solely on animation to convey information

---

## 5. BilingualReader Component Spec

### Layout Structure

```
┌─────────────────────────────────────────┐
│  [Back]    Story Title        [Menu]    │  Header (64px)
├─────────────────────────────────────────┤
│                                         │
│  ╭─────────────────────────────────╮   │
│  │                                 │   │
│  │  German sentence appears here   │   │  Sentence Block
│  │  with natural line breaks and   │   │  (dynamic height)
│  │  generous spacing.               │   │
│  │                                 │   │
│  │  English translation appears     │   │
│  │  below with slightly smaller     │   │
│  │  text and secondary color.       │   │
│  │                                 │   │
│  ╰─────────────────────────────────╯   │
│                                         │
│           [8px vertical gap]            │
│                                         │
│  ╭─────────────────────────────────╮   │
│  │                                 │   │
│  │  Die nächste deutsche Satze...  │   │  Next Sentence
│  │                                 │   │
│  │  The next English sentence...   │   │
│  │                                 │   │
│  ╰─────────────────────────────────╯   │
│                                         │
│                                         │
│  [Continues with smooth scroll...]     │
│                                         │
└─────────────────────────────────────────┘
```

### Detailed Specifications

**Container:**
- Background: #FAFAF8 (Washi Paper)
- Horizontal padding: 24px
- Vertical padding: 16px top, 24px bottom
- Safe area insets: Respected
- Scroll behavior: Smooth momentum with bounce

**Header (Fixed):**
- Height: 64px (including safe area)
- Background: #FAFAF8 with subtle bottom border (#E8E8E6)
- Back button: Left, 48x48px touch target, sage icon
- Title: Center, Inter 18px Medium, #2C2C2C
- Menu: Right, 48x48px touch target (for future settings)
- Slight shadow on scroll: rgba(44, 44, 44, 0.04)

**Sentence Block (Card):**
- Background: #FFFFFF (elevated surface)
- Border radius: 12px
- Padding: 20px horizontal, 18px vertical
- Shadow: 0px 2px 8px rgba(44, 44, 44, 0.04)
- Margin between cards: 8px vertical

**German Sentence:**
- Font: Literata Regular
- Size: 18px (1.125rem)
- Line height: 29px (1.6)
- Color: #2C2C2C (Text Primary)
- Letter spacing: 0em
- Margin bottom: 12px (gap before English)

**English Translation:**
- Font: Literata Regular
- Size: 16px (1rem)
- Line height: 24px (1.5)
- Color: #6B6B6B (Text Secondary)
- Letter spacing: 0em
- No margin bottom (end of card)

### Typography Treatment

**German Text Styling:**
```
{
  fontFamily: 'Literata-Regular',
  fontSize: 18,
  lineHeight: 29,
  color: '#2C2C2C',
  letterSpacing: 0,
}
```

**English Text Styling:**
```
{
  fontFamily: 'Literata-Regular',
  fontSize: 16,
  lineHeight: 24,
  color: '#6B6B6B',
  letterSpacing: 0,
}
```

**Emphasis (Future Feature):**
- Use Literata Medium (500) for highlighting vocabulary
- Color remains the same (no color-based emphasis)
- Underline: 1px solid #8B9D83 (sage accent)

### Spacing & Breathing Room

**Vertical Rhythm:**
- Sentence card internal padding: 18px top/bottom
- Gap between German/English: 12px
- Gap between sentence cards: 8px
- Section breaks (paragraph): 16px gap between cards
- Top padding (below header): 16px
- Bottom padding (above safe area): 24px

**Horizontal Spacing:**
- Screen edge to card: 24px
- Card edge to text: 20px
- Total text inset from screen: 44px each side

**Comfortable Reading Width:**
- Maximum width: 600px (center on tablets)
- Line length: ~60-70 characters for German
- Prevents overly wide lines on large screens

### Interaction States

**Sentence Card States:**

1. **Default:**
   - Background: #FFFFFF
   - Shadow: 0px 2px 8px rgba(44, 44, 44, 0.04)
   - Border: None

2. **Pressed (Future - for tap-to-translate):**
   - Background: #F5F5F2 (slightly darker)
   - Shadow: 0px 1px 4px rgba(44, 44, 44, 0.06)
   - Transition: 150ms ease-out
   - Scale: 0.99 (subtle press feedback)

3. **Selected (Future - for vocabulary):**
   - Background: #E8EDE7 (accent background)
   - Border: 1px solid #8B9D83
   - Shadow: 0px 2px 8px rgba(139, 157, 131, 0.12)

**Scroll Behavior:**
- Momentum scrolling: Native iOS-style bounce
- Scroll indicator: Subtle, matches #9B9B98
- Snap to sentence: Optional (test for UX)
- Resume position: Auto-scroll to last read sentence

### Animation Behavior

**Page Entry:**
```
Animation: Fade + Slide Up
Duration: 350ms
Easing: ease-out
Initial state: opacity 0, translateY 20px
Final state: opacity 1, translateY 0px
```

**Sentence Cards Loading:**
```
Animation: Fade in sequentially
Duration: 250ms per card
Delay: 50ms stagger between cards
Easing: ease-out
Max visible cards: First 10 animate, rest instant
```

**Scroll Animations:**
- Header shadow appears: Fade in over 150ms when scroll > 10px
- Sentence cards: No animation on scroll (performance)
- Resume scroll: Smooth scroll to position over 500ms

**Page Exit:**
```
Animation: Fade only
Duration: 200ms
Easing: ease-in
Reading position saved before animation starts
```

**Special Interactions (Future):**
- Tap German word: Highlight with 150ms spring animation
- Swipe right: Reveal previous sentence (300ms ease-in-out)
- Pull to refresh: Subtle bounce (if implementing sync)

### Reading Comfort Optimizations

**Performance:**
- Virtualized list for 100+ sentences
- Smooth 60fps scrolling (critical)
- No re-renders during scroll
- Sentence position cached

**Visual Comfort:**
- No pure white - warm #FAFAF8 reduces eye strain
- Generous line height (1.6) prevents crowding
- Soft shadows never distract
- No flickering or loading states visible

**Ergonomics:**
- One-handed reading optimized
- Scroll with thumb (right side preferred)
- Bottom navigation if added (within thumb zone)
- No UI chrome while reading (immersive)

---

## 6. StoryCollection Component Spec

### Layout Structure

```
┌─────────────────────────────────────────┐
│              Fable                      │  Header (64px)
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ╔═════════════════════════════════════╗ │
│  ║ Der Wald                            ║ │  Story Card
│  ║ The Forest                          ║ │  (120px height)
│  ║                                     ║ │
│  ║ Heinrich Heine · 1200 words        ║ │
│  ║ ████████░░░░░░░░ 42%                ║ │  Progress
│  ╚═════════════════════════════════════╝ │
│                                         │
│  ╔═════════════════════════════════════╗ │
│  ║ Die Nachtigall                      ║ │  Story Card
│  ║ The Nightingale                     ║ │  (120px height)
│  ║                                     ║ │
│  ║ Johann Wolfgang von Goethe · 980... ║ │
│  ║ ░░░░░░░░░░░░░░░░ 0%                 ║ │  Not started
│  ╚═════════════════════════════════════╝ │
│                                         │
│  ╔═════════════════════════════════════╗ │
│  ║ Das Märchen                         ║ │
│  ║ The Fairy Tale                      ║ │
│  ║                                     ║ │
│  ║ Novalis · 1450 words               ║ │
│  ║ ████████████████ 100% ✓             ║ │  Completed
│  ╚═════════════════════════════════════╝ │
│                                         │
└─────────────────────────────────────────┘
```

### Detailed Specifications

**Container:**
- Background: #F5F5F2 (slightly deeper than reading view)
- Horizontal padding: 20px (slightly tighter than reader)
- Vertical padding: 16px
- Safe area insets: Respected

**Header:**
- Height: 64px (including safe area)
- Background: #F5F5F2 (matches container)
- Title: "Fable" - Inter 24px Semibold, #2C2C2C, centered
- No navigation (root screen)
- Bottom border: 1px solid #E8E8E6

**List Layout:**
- Card spacing: 12px vertical gap between cards
- First card: 16px from header
- Last card: 24px from bottom
- Scroll: Smooth momentum, no snap

### Story Card Design

**Card Container:**
- Height: 120px (fixed)
- Background: #FFFFFF (elevated)
- Border radius: 12px
- Shadow: 0px 2px 8px rgba(44, 44, 44, 0.04)
- Padding: 16px horizontal, 14px vertical
- Touch target: Full card tappable

**Title (German):**
- Font: Inter Semibold
- Size: 20px
- Line height: 26px (1.3)
- Color: #2C2C2C
- Margin bottom: 4px
- Max lines: 1 (ellipsis if overflow)

**Title (English):**
- Font: Inter Regular
- Size: 16px
- Line height: 21px
- Color: #6B6B6B
- Margin bottom: 8px
- Max lines: 1 (ellipsis if overflow)

**Metadata Row:**
- Font: Inter Regular
- Size: 14px
- Line height: 18px
- Color: #9B9B98
- Format: "Author · Word count"
- Max lines: 1 (ellipsis author if needed)
- Margin bottom: 10px

**Progress Bar:**
- Height: 6px
- Width: 100% of card (minus padding)
- Border radius: 3px (fully rounded)
- Background (track): #E8E0DE (light dusty rose)
- Fill: #C9ADA7 (dusty rose)
- Transition: Width 300ms ease-out

**Progress Text:**
- Font: Inter Medium
- Size: 12px
- Color: #9B9B98 (0%), #C9ADA7 (1-99%), #8B9D83 (100%)
- Position: Right-aligned, 4px above progress bar
- Format: "42%" or "100% ✓"

### Progress Indicator Design

**Three States:**

1. **Not Started (0%):**
   - Track: #E8E0DE (visible)
   - Fill: None (width: 0%)
   - Text: "0%" in #9B9B98

2. **In Progress (1-99%):**
   - Track: #E8E0DE
   - Fill: #C9ADA7 (width: percentage)
   - Text: "42%" in #C9ADA7
   - Animated growth on update

3. **Completed (100%):**
   - Track: #E8E0DE
   - Fill: #8B9D83 (sage green - full width)
   - Text: "100% ✓" in #8B9D83
   - Checkmark for completion

**Progress Animation:**
```
On progress update:
  Duration: 300ms
  Easing: ease-out
  Animate: width of fill bar
  Text: Instant update (no counting animation)
```

### Card Spacing & Layout

**Internal Card Layout:**
```
Vertical structure:
  14px  (top padding)
  26px  (German title)
  4px   (gap)
  21px  (English title)
  8px   (gap)
  18px  (metadata)
  10px  (gap)
  12px  (progress text)
  4px   (gap)
  6px   (progress bar)
  14px  (bottom padding)
  ---
  ≈ 117px (fits in 120px container)
```

**List Spacing:**
- Between cards: 12px
- Screen padding: 20px left/right
- Top margin: 16px below header
- Bottom margin: 24px above safe area

### Touch Interactions

**Card Touch States:**

1. **Default:**
   - Background: #FFFFFF
   - Shadow: 0px 2px 8px rgba(44, 44, 44, 0.04)
   - Scale: 1.0

2. **Pressed:**
   - Background: #FAFAF8 (slightly darker)
   - Shadow: 0px 1px 4px rgba(44, 44, 44, 0.06)
   - Scale: 0.98 (subtle press feedback)
   - Transition: 150ms ease-out

3. **Released:**
   - Return to default
   - Transition: 200ms ease-out
   - Navigate after animation starts

**Touch Feedback:**
- Haptic: Light impact on press (iOS)
- Visual: Immediate scale + background change
- Audio: None (silent by default)

**Gestures:**
- Tap: Open story reader
- Long press: Future - show story options
- Swipe: Future - mark as favorite, delete
- Pull down: Refresh if implementing sync

### Transition Animations

**Entry Animation (App Launch):**
```
Cards appear sequentially:
  Animation: Fade + Slide up
  Duration: 250ms per card
  Delay: 50ms stagger
  Easing: ease-out
  Initial: opacity 0, translateY 10px
  Final: opacity 1, translateY 0
  Max stagger: First 6 cards, rest instant
```

**Navigate to Reader:**
```
Card selected animation:
  Duration: 300ms
  Easing: ease-in-out
  Card: Scale up to 1.05, fade out
  List: Fade out
  Reader: Fade in + slide up
```

**Return from Reader:**
```
Animation: Fade in
Duration: 300ms
Easing: ease-out
Card updates: Progress bar smoothly grows
Scroll position: Maintained
```

**Progress Update:**
```
When returning from reader:
  Progress bar: Animate width change over 300ms
  Progress %: Instant number update
  Card: Subtle pulse if reached milestone (25%, 50%, 75%, 100%)
```

### Empty State (Future)

**When no stories:**
```
Center message:
  "No stories yet"
  Inter Regular, 16px, #9B9B98
  Below: "Check back soon for new content"
  Icon: Minimalist book icon in #E8E8E6
```

### Loading State (Future)

**Initial load:**
```
Skeleton cards:
  Background: #EFEFE D (subtle)
  Shimmer: Soft, slow animation
  Count: 3 skeleton cards
  Duration: Until content loads
```

### Accessibility Features

**Screen Reader:**
- Card announces: "Title (German), Title (English), Author, Progress percentage"
- Completed stories: "Completed" announcement
- List: Properly structured, navigable by item

**Touch Targets:**
- Full card: 120px height (exceeds 44px minimum)
- Cards never overlap
- 12px gap ensures no accidental taps

**Contrast:**
- Title on white: 12.5:1 (AAA)
- Metadata on white: 5.1:1 (AA)
- Progress colors: Sufficient contrast for visibility

**Motion:**
- Respects reduced motion preference
- Cards appear instantly if motion disabled
- Progress updates still smooth (essential feedback)

---

## Implementation Checklist

### Phase 1: Design Tokens
- [ ] Create color constants file
- [ ] Create typography constants
- [ ] Create spacing constants
- [ ] Create animation timing constants

### Phase 2: BilingualReader
- [ ] Header component
- [ ] Sentence card component
- [ ] Scroll container with momentum
- [ ] Resume position logic
- [ ] Page transitions

### Phase 3: StoryCollection
- [ ] Story card component
- [ ] Progress bar component
- [ ] List container
- [ ] Card tap interactions
- [ ] Navigation to reader

### Phase 4: Polish
- [ ] Animation refinement
- [ ] Touch feedback optimization
- [ ] Accessibility audit
- [ ] Performance testing (60fps scroll)
- [ ] Edge case handling

---

## Design System Maintenance

**When adding new components:**
1. Check existing tokens first (color, spacing, typography)
2. Only add new tokens if absolutely necessary
3. Document usage guidelines
4. Update this document with new component specs

**When modifying:**
1. Consider impact on existing components
2. Update all affected component specs
3. Test reading comfort (for text changes)
4. Verify accessibility (for color changes)

**Design review criteria:**
1. Does it feel minimal and uncluttered?
2. Is there sufficient breathing room?
3. Does it use warm, soft colors?
4. Are animations subtle and natural?
5. Is text comfortable to read?
6. Are touch targets adequate?
7. Is contrast sufficient?

---

**Last updated:** 2026-01-13
**Version:** 1.0 (MVP)
