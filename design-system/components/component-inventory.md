# Component Inventory and Contract

## Global State Model

All interactive components implement these states:

- `default`
- `hover`
- `pressed`
- `focused`
- `disabled`
- `loading` (where applicable)
- `error` (inputs and transactional surfaces)
- `success` (confirmation and completion surfaces)

## Navigation

### Top App Bar

Variants:

- `profile`: avatar + greeting + utility actions
- `back`: back icon + page title + trailing action
- `minimal`: title only

Specs:

- Height: 56
- Horizontal padding: 16
- Icon touch target: 44x44 iOS / 48x48 Android

### Bottom Tab Bar with Center FAB

Variants:

- `4-tab + center action`
- `5-tab no center action` (fallback)

Specs:

- Height: 72
- FAB: 56 diameter, elevated with gold glow
- Active tab: gold icon + label
- Inactive tab: tertiary text/icon

## Actions

### Button

Variants:

- `primary`: gold fill, dark text
- `secondary`: raised neutral surface, light text
- `ghost`: transparent background, subtle border

Sizes:

- `sm`: 36 height
- `md`: 44 height
- `lg`: 52 height

Rules:

- Primary button max one per viewport section
- Avoid stacked primary buttons without separation card/divider

### Segmented Control

- Used for timeframes and mode switching
- Indicator animated with standard/decelerate easing

## Data and Content

### KPI Card

Slots:

- Eyebrow label
- Primary metric
- Supporting metric
- Trend or delta
- Optional sparkline/progress

Rules:

- Max 2 key metrics per card to preserve hierarchy
- Gold reserved for active trend, threshold, or selected metric

### Goal Card

Slots:

- Goal icon
- Goal title
- Progress bar or ring
- Current vs target value

Rules:

- Ring thickness >= 6 for readability on dark surfaces
- Numeric labels must use secondary or primary text only

### Transaction Row

Slots:

- Leading icon/avatar
- Merchant/title
- Metadata line
- Amount and status

Rules:

- Pending status uses warning tone; never use pure gold for warnings

## Inputs

### Text Field

Variants:

- `default`
- `filled`
- `with leading icon`

Specs:

- Height: 52
- Border: subtle by default, strong on focus
- Error text: 12 size with 4 top spacing from field

### Payment Method Row

- Full-width selectable row
- Left icon, title/subtitle, trailing selection indicator

## Feedback

### Toast

- Position: bottom above tab bar
- Duration: 2.5s default
- Include action only for reversible operations

### Alert Banner

- Inline in card stack
- Supports info/warning/error/success semantic tokens

### Loading Skeleton

- Neutral animated shimmer at <= 12 percent luminance delta

## Component Naming Convention

`Domain/Component/Variant/Size/State`

Examples:

- `Navigation/TabBar/CenterFab/Default`
- `Action/Button/Primary/Md/Pressed`
- `Data/KpiCard/Sparkline/Default`
