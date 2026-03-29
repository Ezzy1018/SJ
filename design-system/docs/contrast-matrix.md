# Contrast Matrix (Key Text and Controls)

Initial approved pairings for key interactions.

- `text.primary` on `bg.base`: pass target AA
- `text.secondary` on `surface.base`: pass target AA
- `text.tertiary` on `surface.base`: use for metadata only, not critical labels
- `text.onAccent` on `accent.primary`: pass target AA for button labels
- `accent.primary` as small text on `bg.base`: avoid below 14 semibold
- `border.default` on `surface.base`: visual separation only, not state indicator
- `error` text on `surface.base`: pair with icon and message for clarity

## Rules

- Do not use gold for paragraph text
- Gold text is allowed for short labels and selected states only
- Critical numeric values should use `text.primary` unless action-linked
- If contrast is borderline, increase text weight/size and reduce transparency
