# Design Hygiene Checklist

Use this checklist for every component and screen before release.

## Token Hygiene

- All color values reference semantic tokens
- No hardcoded hex values in component definitions
- Spacing and radius use system scales only
- Elevation uses tokenized levels

## Accessibility Hygiene

- Key text and controls meet WCAG AA
- Focus ring visible against all dark surfaces
- Interactive controls meet minimum touch targets
- Error states include non-color cues (icon/text)

## Visual Hygiene

- Gold accent is intentional and sparse
- No more than one dominant focal point per viewport section
- Divider/border opacity remains subtle and consistent
- Card corner radii are consistent by role

## Interaction Hygiene

- Required states exist for all interactive components
- Pressed feedback occurs within 100ms
- Motion duration stays within token ranges
- Haptic feedback maps to action criticality

## Content Hygiene

- Labels are concise and specific
- Numeric data uses consistent units and precision
- Empty states explain next action
- Success and error copy are explicit

## Governance Hygiene

- New component requires usage guidelines
- Variant additions require rationale and examples
- Foundation token changes require migration note
- Any exception to system rules must be documented

## QA Gate

A screen passes only when:

- No token violations
- No AA failures for key text/controls
- No missing interaction states
- No unresolved copy ambiguity in critical flows
