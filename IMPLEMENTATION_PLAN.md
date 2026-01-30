# Implementation Plan - Button UI Enhancement

This plan outlines the steps to upgrade the button styles in `src/index.html`.

## Proposed Changes

### 1. Define Design System
- Use a cohesive color palette:
    - Primary (Calculate): Golden/Yellow gradient.
    - Secondary (Add Break): Emerald/Teal gradient.
    - Danger (Remove Break): Rose/Crimson gradient.
- Implement glassmorphism effects for a modern look.

### 2. Update HTML & Tailwind Classes
- **Remove Break Button**:
    - Add `transition-all`, `hover:scale-105`, `active:scale-95`.
    - Use a gradient background.
    - Add subtle box shadows.
- **Add Break Button**:
    - Add `transition-all`, `hover:shadow-lg`, `hover:-translate-y-0.5`.
    - Use a lush green gradient.
- **Calculate Button**:
    - Make it the focal point with a vibrant yellow-orange gradient.
    - Add a "shine" effect or a stronger shadow on hover.

### 3. Verification
- Test the responsiveness on different screen sizes.
- Verify that the click functionality remains intact.
- Check the visual consistency with the existing background.

## Steps
1. Modify `src/index.html` to inject custom styles or update inline Tailwind classes.
2. Update the JavaScript `addBreak` function to ensure new buttons also have the updated styles.
