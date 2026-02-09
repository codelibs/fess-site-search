/**
 * Constants barrel export.
 * Re-exports all constants from keyboard and timing modules for convenient imports.
 *
 * @example
 * import { KEY_ENTER, SUGGEST_DEBOUNCE_DELAY_MS } from '@/constants';
 */

// Keyboard key code constants
export {
  KEY_ENTER,
  KEY_TAB,
  KEY_BACKSPACE,
  KEY_SPACE,
  KEY_DELETE,
  KEY_ARROW_UP,
  KEY_ARROW_DOWN,
  KEY_NUMBER_START,
  KEY_NUMBER_END,
  KEY_ALPHA_START,
  KEY_ALPHA_END,
  KEY_NUMPAD_START,
  KEY_NUMPAD_END,
  KEY_SYMBOL_START,
  KEY_SYMBOL_END,
  isInputKeyCode,
} from './keyboard';

// Timing constants
export { SUGGEST_DEBOUNCE_DELAY_MS, SUGGEST_CANCEL_DELAY_MS } from './timing';
