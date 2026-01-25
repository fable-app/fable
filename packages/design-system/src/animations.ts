/**
 * Fable Design System - Animations
 * Japanese Minimalist Aesthetic
 * Subtle, natural animations that feel rather than watched
 */

export const animations = {
  duration: {
    instant: 0,              // Immediate feedback (button press)
    fast: 150,               // Quick transitions, tooltips
    standard: 250,           // Default for most animations
    leisurely: 350,          // Page transitions, large movements
    slow: 500,               // Hero animations, special moments
  },

  easing: {
    // Cubic bezier curves
    easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',      // For entrances
    easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',         // For exits
    easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',    // For transitions
  },

  // React Native Reanimated spring configuration
  spring: {
    damping: 15,             // Controls oscillation
    stiffness: 150,          // Controls speed
    mass: 1,                 // Controls inertia
  },
} as const;

// Common animation configs for different scenarios
export const animationConfigs = {
  // Micro-interactions (150ms ease-out)
  microInteraction: {
    duration: animations.duration.fast,
    easing: animations.easing.easeOut,
  },

  // Element entrance (250ms ease-out with slide)
  elementEntrance: {
    duration: animations.duration.standard,
    easing: animations.easing.easeOut,
    translateY: 10, // pixels to slide up from
    opacity: {
      from: 0,
      to: 1,
    },
  },

  // Element exit (200ms ease-in with fade)
  elementExit: {
    duration: 200,
    easing: animations.easing.easeIn,
    opacity: {
      from: 1,
      to: 0,
    },
  },

  // Page transitions (350ms ease-in-out)
  pageTransition: {
    duration: animations.duration.leisurely,
    easing: animations.easing.easeInOut,
    translateY: 20, // pixels to slide
    fade: true,
  },

  // Button press (instant)
  buttonPress: {
    duration: animations.duration.instant,
    scale: {
      from: 1,
      to: 0.98,
    },
  },

  // Progress bar update (300ms ease-out)
  progressUpdate: {
    duration: 300,
    easing: animations.easing.easeOut,
  },

  // Card tap (150ms ease-out)
  cardTap: {
    duration: animations.duration.fast,
    easing: animations.easing.easeOut,
    scale: {
      from: 1,
      to: 0.98,
    },
  },

  // Stagger delay for sequential animations
  stagger: {
    delay: 50, // milliseconds between each item
    maxItems: 6, // Maximum items to stagger, rest appear instantly
  },
} as const;

// Animation guidelines
export const animationGuidelines = {
  // What TO animate
  doAnimate: [
    'Micro-interactions (button press, checkbox toggle)',
    'Element entrance (250ms ease-out with 5-10px vertical slide)',
    'Element exit (200ms ease-in with fade)',
    'Page transitions (350ms ease-in-out with fade + 20px slide)',
    'Scroll behavior (smooth with momentum, native iOS-style)',
    'Progress bar updates (smooth increment)',
  ],

  // What NOT to animate
  dontAnimate: [
    'Reading text appearing (should be instant)',
    'Background colors (distracting from content)',
    'Large color changes (jarring)',
  ],

  // Accessibility considerations
  reducedMotion: {
    // When prefers-reduced-motion is enabled:
    // - Use instant transitions (0ms duration)
    // - Remove slide/scale effects
    // - Keep essential feedback (progress updates)
    preferInstant: true,
    keepEssentialFeedback: true,
  },
} as const;

// TypeScript types
export type AnimationDuration = keyof typeof animations.duration;
export type AnimationEasing = keyof typeof animations.easing;
export type AnimationConfig = keyof typeof animationConfigs;
