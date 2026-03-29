# Mobile Blueprint Patterns

These blueprints are canonical compositions for MVP implementation.

## 1. Home Dashboard

Purpose:

- Daily status overview and quick actions.

Composition order:

1. Top app bar (profile)
2. Hero metric block (balance/steps/points)
3. Activity chart card
4. Previous activity cards (2-up)
5. Bottom tab bar + center FAB

Layout rules:

- Screen side padding: 16
- Section gap: 20
- Card internal padding: 16
- Max cards visible before scroll: 3 major blocks

## 2. Goals Grid

Purpose:

- At-a-glance goals and progress.

Composition order:

1. Top app bar (profile)
2. Timeframe segmented control
3. 2-column goal card grid
4. Persistent bottom nav

Layout rules:

- Card min height: 160
- Card gap: 12
- Progress indicator near top third of card

## 3. Purchase Confirmation Flow

Screens:

- Confirm purchase
- Select payment method
- Invoice details
- Success receipt

Interaction rules:

- One primary CTA per screen
- Previous choices persist and remain editable
- Summary values use tabular number alignment

Error prevention:

- Disable primary CTA until required fields are complete
- Inline validation appears before blocking modal

## 4. Receipt and Post-Transaction

Purpose:

- Confirm completion and offer next best actions.

Composition:

1. Success icon/illustration
2. Transaction summary card
3. Action stack (order history, invoice download, return home)

Layout rules:

- Vertical rhythm: 16/20 spacing only
- Max 3 primary-level actions per screen

## Responsive and Platform Notes

- iOS: respect notch and home indicator insets
- Android: ensure nav and gesture compatibility
- Do not place FAB where keyboard overlaps critical fields

## Accent Usage by Blueprint

- Home dashboard: 8 to 12 percent
- Goals grid: 6 to 10 percent
- Purchase flow: 10 to 14 percent only at CTA and critical highlights
- Receipt: 8 to 12 percent
