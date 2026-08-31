---
name: Heritage Institutional
colors:
  surface: '#fafaf5'
  surface-dim: '#dadad5'
  surface-bright: '#fafaf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4ef'
  surface-container: '#eeeee9'
  surface-container-high: '#e8e8e3'
  surface-container-highest: '#e3e3de'
  on-surface: '#1a1c19'
  on-surface-variant: '#424843'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f1f1ec'
  outline: '#727972'
  outline-variant: '#c2c8c1'
  surface-tint: '#496551'
  primary: '#001106'
  on-primary: '#ffffff'
  primary-container: '#0d2818'
  on-primary-container: '#74917b'
  inverse-primary: '#afceb6'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#0d0d0d'
  on-tertiary: '#ffffff'
  tertiary-container: '#232323'
  on-tertiary-container: '#8b8a8a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cbead1'
  primary-fixed-dim: '#afceb6'
  on-primary-fixed: '#052011'
  on-primary-fixed-variant: '#324d3a'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#fafaf5'
  on-background: '#1a1c19'
  surface-variant: '#e3e3de'
  surface-cream: '#F5F5F0'
  deep-forest: '#0D2818'
  earth-gold: '#C5A059'
  text-charcoal: '#333333'
typography:
  display-lg:
    fontFamily: DM Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: DM Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The brand personality is authoritative, rooted, and strategically forward-thinking. It bridges the gap between a traditional cooperative and a modern investment group. The design system prioritizes stability and trust, evoking a sense of institutional permanence and professional stewardship.

The visual style is **Corporate / Modern**, leaning into high-quality typography and a disciplined layout. It utilizes a palette of deep forest greens and earthy golds to communicate natural growth and financial prosperity. The aesthetic is clean and organized, avoiding unnecessary ornamentation to let the content and professional imagery lead.

## Colors

The palette is driven by a prestigious "Deep Forest" green, serving as the primary anchor for headers, primary buttons, and critical branding elements. This is complemented by "Earth Gold," which provides a sophisticated warmth and is used for accents, highlights, and secondary actions to signify value and success.

Neutrality is achieved through a "Surface Cream" background rather than a stark white, adding a layer of premium feel and reducing visual fatigue. Text is primarily "Charcoal" to maintain high legibility while appearing softer and more professional than pure black.

## Typography

This design system utilizes **DM Sans** exclusively for a unified, modern, and highly legible experience across all platforms. The typeface's geometric yet approachable nature supports the corporate narrative without appearing dated.

Headlines use heavy weights and tight letter spacing to command attention, while body text remains spacious for maximum readability. Labels and captions use increased letter spacing and uppercase styling in specific contexts (like overlines or small headers) to create a distinct hierarchy and a "data-rich" professional aesthetic.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop to ensure content remains centered and readable, moving to a fluid model for mobile devices. 

- **Desktop (1200px+):** 12-column grid with 24px gutters. Sections use generous vertical padding (80px-120px) to create an airy, premium feel.
- **Tablet (768px - 1199px):** 8-column grid with 24px gutters and 40px side margins.
- **Mobile (Below 768px):** 4-column grid with 16px gutters and 20px side margins.

A strict 8px spacing system governs all internal component margins, ensuring mathematical harmony across the UI. Large sections are separated by significant whitespace to emphasize a structured, "un-cluttered" organizational philosophy.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and subtle **Ambient Shadows**. Instead of heavy shadows, the design system uses depth to indicate interactivity and importance:

1.  **Level 0 (Base):** The Surface Cream background.
2.  **Level 1 (Cards/Containers):** Pure white surfaces with a very soft, high-diffusion shadow (0px 4px 20px rgba(13, 40, 24, 0.05)) or a 1px border in a slightly darker cream tint.
3.  **Level 2 (Overlays/Popovers):** Standard shadows with increased blur and a hint of the Deep Forest primary color in the shadow's tint to maintain brand cohesion.

Interactive elements (like buttons) may use a subtle lift on hover, shifting from a flat state to a Level 1 elevation to provide tactile feedback.

## Shapes

The design system uses a **Soft** shape language. This choice strikes a balance between the "sharp" formality of traditional finance and the "rounded" friendliness of modern tech.

Standard components like input fields and buttons utilize a 0.25rem radius. Larger containers, such as content cards or featured image sections, use the `rounded-lg` (0.5rem) or `rounded-xl` (0.75rem) tokens to subtly soften the overall layout without appearing overly playful or casual.

## Components

### Buttons
- **Primary:** Deep Forest background with White text. Sharp internal padding (12px 24px).
- **Secondary:** Earth Gold background with Deep Forest text. Used for secondary CTAs.
- **Tertiary:** Transparent background with a Deep Forest border (1px).

### Input Fields
- White background with a light charcoal border. On focus, the border shifts to Deep Forest with a subtle 2px glow in the primary color. Labels are always positioned above the field in `label-sm`.

### Cards
- White background, `rounded-lg` corners, and Level 1 elevation. Used for service offerings, investment portfolios, and news items. Content within cards should have a consistent 24px padding.

### Chips & Tags
- Used for categories (e.g., "Investment," "Cooperative"). These use a light tint of Earth Gold with Dark Earth Gold text, providing a high-contrast but sophisticated indicator.

### Lists
- For data-heavy views, use clean dividers (1px) in a light neutral tone. List items should have generous vertical padding (16px) to maintain the organized, breathable style.

### Navigation
- A clean, sticky top bar with a White or Surface Cream background. Links use `label-lg` typography, transforming to Deep Forest with a subtle bottom-border underline on hover/active states.