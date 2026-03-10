# Product Guidelines

## 1. Visual Identity

### Color System

**Primary Color**
- **Primary Purple**: `#2c1a4c` - Deep corporate purple conveying trust and professionalism
- **Primary Light**: `#3d2469` - Hover state for primary buttons
- **Opacity Variants**:
  - `primary/5` - Very subtle backgrounds
  - `primary/10` - Light accents, icon backgrounds
  - `primary/20` - Medium emphasis elements
  - `primary/30` - Strong accents
  - `primary/40` - Borders and dividers

**Background Colors**
- **Light Mode**: `#f7f6f8` or `#fcfcfd` - Very light gray with purple tint
- **Dark Mode**: `#18141e` or `#0f172a` - Dark purple/slate
- **White Cards**: `#ffffff` - Card backgrounds in light mode
- **Dark Cards**: `#1e293b` or `#0f172a` - Card backgrounds in dark mode

**Status Colors**
- **Success**: `#10b981` (emerald-500) - Check-in confirmed, checked out
- **Warning**: `#f59e0b` (amber-500) - Pending actions, reminders
- **Error**: `#ef4444` (red-500) - Failed actions, alerts
- **Info**: `#3b82f6` (blue-500) - Informational messages

**Neutral Colors**
- **Text Primary**: `#0f172a` (slate-900)
- **Text Secondary**: `#64748b` (slate-500)
- **Text Tertiary**: `#94a3b8` (slate-400)
- **Border Light**: `#e2e8f0` (slate-200)
- **Border Dark**: `#334155` (slate-700)

### Typography

**Font Family**
- **Primary**: `Inter` (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Fallback**: `sans-serif`

**Font Sizes**
| Size | Value | Usage |
|------|-------|-------|
| Extra Small | 10px (0.625rem) | Labels, badges, timestamps |
| Small | 12px (0.75rem) | Secondary text, captions |
| Base | 14px (0.875rem) | Body text, button text |
| Medium | 16px (1rem) | Primary text, inputs |
| Large | 18px (1.125rem) | Subheadings |
| XL | 20px (1.25rem) | Section titles |
| 2XL | 24px (1.5rem) | Page titles, headings |
| 3XL | 32px (2rem) | Welcome text, hero headings |

**Font Weight Usage**
- **Bold (700)**: Primary headings, button text, important numbers
- **SemiBold (600)**: Subheadings, labels, status text
- **Medium (500)**: Secondary text, navigation labels
- **Regular (400)**: Body text, descriptions

**Text Styling**
- **Uppercase Tracking**: `tracking-wider` for labels and badges
- **Title Tracking**: `tracking-tight` for headings
- **Normal Tracking**: `tracking-normal` for body text

### Iconography

**Icon System**
- **Library**: Material Symbols Outlined (Google Fonts)
- **Default Size**: 24px
- **Weight**: 400 (outlined), 1 (filled for active states)

**Icon Sizes**
- **Header Icons**: 24px
- **Navigation Icons**: 24px with fill-1 for active
- **Action Icons**: 24-32px
- **Hero Icons**: 48px-72px (success confirmations)
- **Card Icons**: 20-24px in icon containers

**Navigation Icons**
- **Dashboard**: `dashboard`, `grid_view`, `home`
- **Attendance**: `schedule`, `timer`, `calendar_month`
- **Clients**: `business`, `business_center`, `work`, `groups`
- **Profile**: `person`, `account_circle`
- **History**: `history`, `receipt_long`
- **Settings**: `settings`

---

## 2. Component Guidelines

### Buttons

**Primary Button (Large) - For Check-In/Check-Out**
```
Height: 80px (h-20) or 64px (h-16)
Background: #2c1a4c (primary)
Text: White (#ffffff)
Font: Bold, 15-17px
Border Radius: 0.5rem (lg) or 0.75rem (xl)
Shadow: shadow-lg shadow-primary/20
Active: scale-[0.98]
Hover: brightness-110 or opacity-95
```

**Primary Button (Medium)**
```
Height: 48px (h-12)
Background: #2c1a4c
Text: White
Font: Bold, 14px
Border Radius: 0.5rem (lg)
Padding: px-6 py-3
```

**Secondary Button (Outlined)**
```
Height: 48px (h-12)
Background: Transparent or White
Border: 2px border-primary/20 or border-slate-200
Text: Primary (#2c1a4c)
Font: Bold, 14px
Border Radius: 0.5rem (lg)
Hover: bg-primary/5
```

**Quick Action Button (Card Style)**
```
Height: 112px (h-28)
Width: Full (grid cols-2)
Background: White or Primary
Border: border-slate-200 or none
Border Radius: 1rem (2xl) or 0.75rem
Shadow: shadow-sm or shadow-lg
Icon Size: 32px (text-3xl)
```

### Cards

**Standard Card**
```
Background: White (light) or slate-900 (dark)
Border: border-primary/5 or border-slate-100
Border Radius: 0.5rem (lg) or 0.75rem (xl)
Padding: p-4, p-5, or p-6
Shadow: shadow-sm
```

**Stats Card**
```
Layout: flex flex-col gap-1
Padding: p-4 or p-5
Label: text-xs font-semibold uppercase tracking-wider
Value: text-2xl or text-3xl font-bold
Icon: Material Symbol aligned right
```

### Status Badges

```
Display: inline-flex items-center
Padding: px-2.5 py-0.5
Border Radius: full (rounded-full)
Font: text-xs font-medium uppercase tracking-tighter
Background: Status color 100 (light) or status-900/30 (dark)
Text: Status color 800 (light) or status-400 (dark)
Indicator: w-1.5 h-1.5 rounded-full with status color
```

### Input Fields

**Search Input**
```
Height: 48px (h-12) or 56px (h-14)
Background: White or primary/5
Border: border-primary/10 or border-slate-200
Border Radius: 0.5rem (lg) or 0.75rem (xl)
Padding: pl-4 for icon, px-4 general
Icon: search icon left, 24px
Focus: border-primary, ring-2 ring-primary/20
Placeholder: text-primary/40 or text-slate-400
```

### List Items

**Client/Employee List Item**
```
Layout: flex items-center gap-3 or gap-4
Padding: p-4
Background: White or primary/5
Border: border-primary/5
Border Radius: 0.5rem (lg) or 0.75rem (xl)
Hover: border-primary/30 or bg-primary/5
Avatar/Icon: size-10 or size-12 rounded-lg or rounded-full
Title: font-semibold or font-bold text-sm
Subtitle: text-xs text-slate-500
Trailing: chevron_right or status indicator
```

---

## 3. Layout System

### Container

**Mobile-First Container**
```
Max Width: 480px (max-w-md)
Centered: mx-auto
Full Height: min-h-screen
Overflow: overflow-x-hidden
Shadow: shadow-xl or shadow-2xl
```

### Spacing

**Section Padding**
- **Standard**: `p-4` (16px) or `px-6` (24px)
- **Card Gap**: `gap-3` (12px) or `gap-4` (16px)
- **Element Gap**: `gap-2` (8px) for tight spacing
- **Section Margin**: `py-6` (24px) between sections

### Grid Systems

- **Stats Grid**: `grid-cols-2` or `grid-cols-4` (responsive)
- **Action Grid**: `grid-cols-2` for secondary actions
- **Info Grid**: `grid-cols-2` or `grid-cols-3` for data display

### Header Patterns

```
Height: Auto with p-4 padding
Sticky: sticky top-0 z-10
Background: White/80 or primary/5 with backdrop-blur-md
Border Bottom: border-b border-primary/10 or border-slate-200
```

### Bottom Navigation

```
Position: fixed bottom-0 z-20
Height: Auto with pb-4 pt-2
Background: White/90 or slate-900/95 with backdrop-blur-md
Border Top: border-t border-primary/10 or border-slate-200
Items: flex justify-around or gap-2
Item Padding: px-4
```

**Navigation Item**
```
Flex Column: flex-col items-center
Gap: gap-1 between icon and label
Icon Size: 24px (text-[24px])
Label Size: 10px (text-[10px])
Label Weight: font-bold uppercase tracking-wider/tighter
Active State: FILL 1 for Material Icons, text-primary
Inactive State: text-slate-400 or text-primary/60
```

---

## 4. Interaction Guidelines

### Button Interactions

- **Hover**: `hover:bg-primary/90`, `hover:brightness-110`, `hover:border-primary/30`
- **Active**: `active:scale-[0.98]` (subtle press effect)
- **Focus**: `focus:ring-2 focus:ring-primary/20`
- **Disabled**: `cursor-not-allowed bg-slate-200 text-slate-400`

### Card Interactions

- **Hover**: `hover:border-primary/20`, `hover:bg-primary/5`
- **Active**: `active:bg-primary/5`, `active:scale-[0.98]`
- **Transition**: `transition-all` or `transition-colors duration-200`

### Input Interactions

- **Focus**: `focus:ring-0 focus:border-primary`
- **Focus Within**: `focus-within:border-primary`
- **Placeholder**: `placeholder:text-primary/40`

### Touch Targets

- **Minimum Size**: 40px (size-10) for all interactive elements
- **Large Buttons**: 48px-80px height
- **Icon Buttons**: 40px-48px circular or rounded

---

## 5. Dark Mode

### Dark Mode Colors

**Backgrounds**
- **Page Background**: `#18141e` or `#0f172a`
- **Card Background**: `#0f172a` (slate-900) or `#1e293b`
- **Header Background**: `background-dark/80` with backdrop-blur

**Text**
- **Primary Text**: `#f1f5f9` (slate-100)
- **Secondary Text**: `#94a3b8` (slate-400)
- **Tertiary Text**: `#64748b` (slate-500)

**Borders**
- **Light Borders**: `border-white/5` or `border-white/10`
- **Strong Borders**: `border-slate-700` or `border-slate-800`

**Status Badges (Dark)**
- Format: `bg-status-900/30 text-status-400`

---

## 6. Content & Messaging

### Tone & Voice

**Professional & Minimal**
- Clean, corporate language with minimal text
- Focus on clarity and brevity
- No unnecessary explanations
- Direct action-oriented labels

### Writing Guidelines

**Button Labels**
- Use action verbs: "Check In", "Check Out", "Update"
- Keep to 1-2 words maximum
- Title case for all buttons

**Status Messages**
- Clear and immediate feedback
- Use consistent terminology:
  - "Checked In Successfully"
  - "Location Updated"
  - "Checked Out"

**Error Messages**
- Brief explanation of what went wrong
- Clear action to resolve
- Example: "Location access required. Enable in settings."

**Labels & Headings**
- Uppercase for section labels with `tracking-wider`
- Sentence case for descriptions
- Bold for emphasis on important information

### Microcopy Examples

**Welcome Message**
- "Good Morning, [Name]"
- "Welcome back, [Name]"

**Status Display**
- "Not Checked In" / "Checked In"
- "Current Location: [Client Name]"
- "Last Activity: [Time]"

**Confirmation Messages**
- "Checked In Successfully"
- "Location Updated to [Client Name]"
- "Checked Out at [Time]"

---

## 7. Accessibility

### Focus States

- All interactive elements must have visible focus rings
- Pattern: `focus:ring-2 focus:ring-primary/20`
- Minimum contrast ratio: 3:1 for focus indicators

### Color Contrast

- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- Status colors have light/dark variants for proper contrast

### Touch Targets

- **Minimum**: 40px × 40px for all interactive elements
- **Recommended**: 48px × 48px for primary actions
- Adequate spacing between touch targets (minimum 8px)

### Screen Reader Support

- `aria-label` on all icon buttons
- Descriptive labels for form inputs
- Status announcements for screen readers

---

## 8. Performance Guidelines

### Load Time Targets

- **Initial Page Load**: Under 2 seconds on 4G networks
- **Action Completion**: Under 1 second for check-in/check-out
- **Animation Duration**: 200ms for transitions

### Image Optimization

- Use WebP format where supported
- Lazy load images below the fold
- Icon fonts loaded with `display: swap`

### Animation Guidelines

**Common Transitions**
```css
transition-all
transition-colors duration-200
transition-transform
```

**Animation Effects**
- **Pulse**: `animate-pulse` for status indicators
- **Scale**: `active:scale-[0.98]` for press feedback
- **Hover Transform**: `hover:brightness-110`

---

## 9. Responsive Design

### Breakpoints

**Mobile First (Default)**
- All designs target 320px-480px screens first

**Tablet/Desktop**
- **Max Container**: `max-w-md` (448px) centered with `mx-auto`
- **Stats Grid**: `grid-cols-2 md:grid-cols-4`
- **Search Layout**: `flex-col md:flex-row`

### Adaptive Patterns

- Bottom navigation remains fixed on all screen sizes
- Cards stack vertically on smaller screens
- Grid layouts expand on larger screens

---

## 10. Design Principles

### Core Philosophy

**"Two Taps, Three Seconds, Done"**

Every design decision should support:
1. **Speed**: Minimize time to complete actions
2. **Clarity**: Information should be instantly scannable
3. **Simplicity**: Remove unnecessary elements

### Design Priorities

1. **Mobile-First**: Design for thumb-friendly mobile interaction
2. **Outdoor Usable**: High contrast for bright light conditions
3. **Minimal Typing**: Search and select over type
4. **Card-Based**: Modular components for easy scanning
5. **Status-Driven**: Color-coded indicators for attendance states
6. **Professional**: Corporate aesthetic suitable for audit firm environment

### What to Avoid

- ❌ Complex multi-step forms
- ❌ Small touch targets (< 40px)
- ❌ Low contrast text
- ❌ Unnecessary animations
- ❌ Cluttered interfaces
- ❌ Generic AI aesthetics (common fonts, clichéd color schemes)
- ❌ Centered template designs without purpose

---

## 11. Implementation Checklist

### Before Launch

- [ ] All buttons meet minimum 40px touch target
- [ ] Color contrast ratios meet WCAG AA standards
- [ ] Dark mode tested for all screens
- [ ] All interactive elements have focus states
- [ ] Loading states defined for all async actions
- [ ] Error states designed for all forms
- [ ] Empty states designed for lists and dashboards

### Quality Assurance

- [ ] Tested on iOS Safari (latest)
- [ ] Tested on Chrome Android (latest)
- [ ] Tested in bright outdoor conditions
- [ ] Tested with screen readers
- [ ] Tested with slow network (3G simulation)
- [ ] All animations smooth at 60fps
