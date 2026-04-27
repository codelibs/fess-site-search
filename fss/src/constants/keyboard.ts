/**
 * Keyboard key code constants.
 * These constants define the key codes for various keyboard keys used throughout the application.
 *
 * NOTE: keyCode-based constants are deprecated and maintained for backward compatibility.
 * Use key-based constants (KEY_NAME_*) for new code.
 */

/**
 * Enter key code.
 */
export const KEY_ENTER = 13 as const;

/**
 * Tab key code.
 */
export const KEY_TAB = 9 as const;

/**
 * Backspace key code.
 */
export const KEY_BACKSPACE = 8 as const;

/**
 * Space key code.
 */
export const KEY_SPACE = 32 as const;

/**
 * Delete key code.
 */
export const KEY_DELETE = 46 as const;

/**
 * Up arrow key code.
 */
export const KEY_ARROW_UP = 38 as const;

/**
 * Down arrow key code.
 */
export const KEY_ARROW_DOWN = 40 as const;

/**
 * Number keys range (0-9).
 * Key codes 48-57 represent number keys on the main keyboard.
 */
export const KEY_NUMBER_START = 48 as const;
export const KEY_NUMBER_END = 57 as const;

/**
 * Alphabet keys range (A-Z).
 * Key codes 65-90 represent alphabet keys.
 */
export const KEY_ALPHA_START = 65 as const;
export const KEY_ALPHA_END = 90 as const;

/**
 * Numpad keys range (0-9 and operators).
 * Key codes 96-111 represent numpad keys and basic operators.
 */
export const KEY_NUMPAD_START = 96 as const;
export const KEY_NUMPAD_END = 111 as const;

/**
 * Punctuation and symbol keys range.
 * Key codes 186-226 represent various punctuation and symbol keys.
 */
export const KEY_SYMBOL_START = 186 as const;
export const KEY_SYMBOL_END = 226 as const;

/**
 * Check if the given key code is an input character key.
 * This includes alphanumeric keys, backspace, space, delete, and punctuation/symbols.
 *
 * @deprecated Use isInputKey() instead. keyCode is deprecated in favor of key property.
 * @param keyCode - The key code to check
 * @returns True if the key code represents an input character
 */
export const isInputKeyCode = (keyCode: number): boolean => {
  return (
    (keyCode >= KEY_NUMBER_START && keyCode <= KEY_ALPHA_END) ||
    (keyCode >= KEY_NUMPAD_START && keyCode <= KEY_NUMPAD_END) ||
    keyCode === KEY_BACKSPACE ||
    keyCode === KEY_SPACE ||
    keyCode === KEY_DELETE ||
    (keyCode >= KEY_SYMBOL_START && keyCode <= KEY_SYMBOL_END)
  );
};

/**
 * ========================================
 * Modern key-based constants (recommended)
 * ========================================
 * These constants use KeyboardEvent.key property instead of deprecated keyCode.
 * Use these for all new code.
 */

/**
 * Enter key name.
 */
export const KEY_NAME_ENTER = 'Enter' as const;

/**
 * Tab key name.
 */
export const KEY_NAME_TAB = 'Tab' as const;

/**
 * Backspace key name.
 */
export const KEY_NAME_BACKSPACE = 'Backspace' as const;

/**
 * Space key name (represents the space bar).
 */
export const KEY_NAME_SPACE = ' ' as const;

/**
 * Delete key name.
 */
export const KEY_NAME_DELETE = 'Delete' as const;

/**
 * Up arrow key name.
 */
export const KEY_NAME_ARROW_UP = 'ArrowUp' as const;

/**
 * Down arrow key name.
 */
export const KEY_NAME_ARROW_DOWN = 'ArrowDown' as const;

/**
 * Check if the given key is an input character key.
 * This includes alphanumeric keys, backspace, space, delete, and punctuation/symbols.
 *
 * Input keys are keys that typically modify the content of an input field:
 * - Alphanumeric characters (a-z, A-Z, 0-9)
 * - Backspace and Delete (remove characters)
 * - Space (adds space character)
 * - Punctuation and symbols (comma, period, etc.)
 *
 * Non-input keys that are excluded:
 * - Navigation keys (Arrow keys, Home, End, PageUp, PageDown)
 * - Modifier keys (Shift, Control, Alt, Meta)
 * - Function keys (F1-F12)
 * - Special keys (Escape, Tab, Enter when handled separately)
 *
 * @param key - The key property value from KeyboardEvent
 * @returns True if the key represents an input character
 */
export const isInputKey = (key: string): boolean => {
  // Single character keys (alphanumeric, punctuation, symbols) are input keys
  // This covers letters, numbers, and most printable characters
  if (key.length === 1) {
    return true;
  }

  // Special input keys that modify text content
  return key === KEY_NAME_BACKSPACE || key === KEY_NAME_DELETE;
};
