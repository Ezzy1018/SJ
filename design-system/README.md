# Premium Dark Gold Design System

Mobile-first design system for a clean, modern, premium dark UI with restrained gold accents.

## Scope

- iOS and Android app UI foundations
- Tokenized color, typography, spacing, radius, elevation, and motion
- Core component contract and screen blueprints
- WCAG AA for key text and controls

## Structure

- `tokens/core.tokens.json`: source of truth for design tokens
- `tokens/motion.tokens.json`: timing/easing/duration standards
- `css/tokens.css`: CSS variable output for app/web clients
- `components/component-inventory.md`: component API and state model
- `patterns/mobile-blueprints.md`: canonical screen composition patterns
- `docs/hygiene-checklist.md`: quality and governance checks

## Design Principles

1. Premium Quiet: dark, clean surfaces with subtle contrast
2. Accent Restraint: gold is signal, not background paint
3. Functional Density: rich data without clutter
4. Tactile Depth: meaningful elevation and motion
5. Data Clarity: hierarchy first, decoration second

## Accent Rule

Gold visual area should stay below 12 percent of the visible screen in default state.

## Accessibility Rule

- Key text and all interactive controls meet WCAG AA contrast
- Minimum touch target: 44x44 px (iOS), 48x48 dp (Android)

## Implementation Order

1. Foundations (tokens + typography + layout)
2. Navigation and buttons
3. Data cards and charts
4. Inputs and transactional flows
5. Feedback, empty states, and polish
