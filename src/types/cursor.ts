/**
 * Constants for custom cursor interaction attributes.
 * These can be used as HTML data attributes to control custom cursor behavior.
 */
export const CURSOR_ATTRIBUTES = {
  /** Apply special hover effect to the cursor */
  HOVER: 'data-cursor-hover',
  
  /** Apply special click effect to the cursor */
  CLICK: 'data-cursor-click',
  
  /** Hide the cursor completely */
  HIDDEN: 'data-cursor-hidden',
} as const;

/**
 * Type representing possible cursor states
 */
export type CursorType = 'default' | 'hover' | 'click' | 'hidden';

/**
 * Helper to add cursor attributes to elements
 * 
 * @example
 * <button {...cursorProps('click')}>Click me</button>
 */
export const cursorProps = (type: 'hover' | 'click' | 'hidden') => {
  switch (type) {
    case 'hover':
      return { [CURSOR_ATTRIBUTES.HOVER]: true };
    case 'click':
      return { [CURSOR_ATTRIBUTES.CLICK]: true };
    case 'hidden':
      return { [CURSOR_ATTRIBUTES.HIDDEN]: true };
    default:
      return {};
  }
}; 