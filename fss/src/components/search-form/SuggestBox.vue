<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount } from 'vue';
import { useSuggestHelper } from '@/composables/useSuggestHelper';
import SuggestEvent from '@/events/SuggestEvent';
import type { EventHandler } from '@/types/event.types';
import { SUGGEST_DEBOUNCE_DELAY_MS, SUGGEST_CANCEL_DELAY_MS } from '@/constants';
import {
  KEY_NAME_ENTER,
  KEY_NAME_TAB,
  KEY_NAME_ARROW_UP,
  KEY_NAME_ARROW_DOWN,
  isInputKey,
} from '@/constants/keyboard';

const { adjustBox, doSuggest } = useSuggestHelper();

/**
 * Component for suggest box.
 */

// Props interface
interface Props {
  suggestId?: string;
  targetElementId?: string;
  apiUrl?: string;
  suggestNum?: number;
  label?: string;
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  suggestId: 'fss',
  targetElementId: '',
  apiUrl: '',
  suggestNum: 10,
  label: '',
});

// State interface
interface State {
  show: boolean;
  suggestList: string[];
  top: string;
  left: string;
  width: string;
  /**
   * Index of currently focused suggestion item (-1 means no focus).
   * Used for keyboard navigation (arrow up/down) through suggestion list.
   */
  focusNum: number;
  /**
   * Flag to track if mouse cursor is over the suggest box or its items.
   * Prevents suggest box from closing when user is interacting with mouse.
   */
  isMouseOver: boolean;
}

// Reactive state
const state = reactive<State>({
  show: false,
  suggestList: [],
  top: '0px',
  left: '0px',
  width: '0px',
  focusNum: -1,
  isMouseOver: false,
});

/**
 * Initialize state to default values.
 */
const init = (): void => {
  state.show = false;
  state.suggestList = [];
  state.focusNum = -1;
  state.isMouseOver = false;
};

/**
 * Cancel suggest with a delay.
 */
const _cancel = (): void => {
  // Clear debounce timer to prevent pending suggest execution
  if (debounceTimerId !== null) {
    clearTimeout(debounceTimerId);
    debounceTimerId = null;
  }

  setTimeout(() => {
    init();
  }, SUGGEST_CANCEL_DELAY_MS);
};

/**
 * Handle focus out event.
 * Cancels suggest if mouse is not over the suggest box
 */
const handleFocusOut = (): void => {
  if (state.isMouseOver === false) {
    _cancel();
  }
};

/**
 * Handle key up events.
 * Processes keyboard navigation and input changes:
 * - Arrow Up: Navigate to previous suggestion
 * - Arrow Down: Navigate to next suggestion or trigger suggest if box is hidden
 * - Input keys: Trigger debounced suggest on text input
 */
const handleKeyup = (event: KeyboardEvent): boolean => {
  let ret = true;
  if (event.key === KEY_NAME_ARROW_UP && state.show) {
    // Navigate to previous suggestion when suggest box is shown
    ret = _handleUpAllowKey();
  } else if (event.key === KEY_NAME_ARROW_DOWN && state.show) {
    // Navigate to next suggestion when suggest box is shown
    ret = _handleDownAllowKey();
  } else if (event.key === KEY_NAME_ARROW_DOWN && !state.show) {
    // Trigger suggest when arrow down is pressed and box is hidden
    const inputElem = document.getElementById(props.targetElementId) as HTMLInputElement;
    if (inputElem) {
      _suggest(inputElem.value);
    }
  } else if (isInputKey(event.key)) {
    // Execute suggest when input is changed (alphanumeric, backspace, space, delete, punctuation)
    const target = event.target as HTMLInputElement;
    _handleUpdateKeywords(target.value);
  }
  return ret;
};

/**
 * Handle key down events.
 * Processes Enter key to confirm selection and Tab key to close suggest box:
 * - Enter: Apply focused suggestion to input field (prevents form submission)
 * - Tab: Close suggest box when mouse is over (allows tab navigation)
 */
const handleKeydown = (event: KeyboardEvent): boolean => {
  let ret = true;
  if (event.key === KEY_NAME_ENTER && state.show) {
    ret = _handleEnterKey(event);
  } else if (event.key === KEY_NAME_TAB && state.show && state.isMouseOver) {
    _cancel();
  }
  return ret;
};

/**
 * Handle Enter key event.
 * Fixes the selected suggestion if any
 */
const _handleEnterKey = (event: KeyboardEvent): boolean => {
  if (state.focusNum < 0) {
    return true;
  }

  // Fix search word
  _fix();

  // Stop the Enter key event
  event.stopPropagation();
  event.preventDefault();
  return false;
};

/**
 * Handle up arrow key.
 * Moves focus to previous suggestion (wraps to last item if at top).
 */
const _handleUpAllowKey = (): boolean => {
  state.focusNum -= 1;
  if (state.focusNum < -1) {
    state.focusNum = state.suggestList.length - 1;
  }
  return true;
};

/**
 * Handle down arrow key.
 * Moves focus to next suggestion (wraps to -1 if at bottom, meaning no focus).
 */
const _handleDownAllowKey = (): boolean => {
  state.focusNum += 1;
  if (state.focusNum >= state.suggestList.length) {
    state.focusNum = -1;
  }
  return true;
};

/**
 * Handle update keywords.
 * Executes suggest with debouncing to prevent excessive API calls.
 * Debouncing delays the API call until user stops typing for a configured period,
 * reducing server load and improving performance during rapid input.
 */
const _handleUpdateKeywords = (data: string): void => {
  // Skip suggest during IME composition (e.g., Japanese/Chinese input)
  if (isComposing) {
    return;
  }

  // Cancel previous debounce timer to reset the delay
  if (debounceTimerId !== null) {
    clearTimeout(debounceTimerId);
  }

  // Set new debounce timer - API call executes after user stops typing
  debounceTimerId = window.setTimeout(() => {
    _suggest(data);
    debounceTimerId = null;
  }, SUGGEST_DEBOUNCE_DELAY_MS);
};

/**
 * Handle mouse over on suggest list item.
 * Updates focus to the hovered item and sets isMouseOver flag.
 */
const handleMouseOver = (event: MouseEvent): void => {
  state.isMouseOver = true;
  const target = event.target as HTMLElement;
  const itemId = target.getAttribute('data-suggest-item-id');
  if (itemId !== null) {
    state.focusNum = Number(itemId);
  }
};

/**
 * Handle mouse leave from suggest list.
 * Clears focus and isMouseOver flag when cursor leaves the list area.
 */
const handleMouseLeave = (): void => {
  state.isMouseOver = false;
  state.focusNum = -1;
};

/**
 * Handle mouse over on suggest box.
 * Sets isMouseOver flag to prevent box from closing when cursor is over the container.
 */
const handleBoxMouseOver = (): void => {
  state.isMouseOver = true;
};

/**
 * Handle mouse leave from suggest box.
 * Clears isMouseOver flag to allow box to close when focus is lost.
 */
const handleBoxMouseLeave = (): void => {
  state.isMouseOver = false;
};

/**
 * Handle mouse click on suggestion.
 */
const handleMouseClick = (index: number): void => {
  state.focusNum = index;
  _fix();
};

/**
 * Execute suggest API call.
 */
const _suggest = (keyword: string): void => {
  const labels = props.label ? props.label.split(',') : [];
  const apiUrl = props.apiUrl ?? '';
  doSuggest(apiUrl, keyword, props.suggestNum, labels)
    .then((suggestList) => {
      state.suggestList = suggestList;
      if (suggestList.length > 0) {
        state.show = true;
      } else {
        state.show = false;
      }
    })
    .catch((error) => {
      console.warn('Error occurred on suggest. ');
      console.warn(error);
    });
};

/**
 * Fix search word with selected suggestion.
 */
const _fix = (): void => {
  if (state.focusNum >= 0 && state.suggestList[state.focusNum]) {
    const result = state.suggestList[state.focusNum];
    const suggestId = props.suggestId ?? 'fss';
    SuggestEvent.$emitResult(suggestId, result ?? '');
  }
  init();
};

/**
 * Handle composition start event (IME input).
 * Prevents suggest API calls during IME composition (e.g., Japanese, Chinese input)
 * where intermediate characters should not trigger suggestions.
 */
const handleCompositionStart = (): void => {
  isComposing = true;
};

/**
 * Handle composition end event (IME input complete).
 * Clears IME composition flag and triggers suggest with the finalized text.
 * This ensures suggestions are shown after user completes multi-byte character input.
 */
const handleCompositionEnd = (event: CompositionEvent): void => {
  isComposing = false;
  // Trigger suggest after IME composition is complete with final text
  const target = event.target as HTMLInputElement;
  if (target && target.value) {
    _handleUpdateKeywords(target.value);
  }
};

// Store references for cleanup
let targetElem: HTMLElement | null = null;
let resizeHandler: (() => void) | null = null;
let cancelEventHandler: EventHandler<string> | null = null;

/**
 * Debounce timer ID for suggest execution.
 * Used to delay API calls until user stops typing, preventing excessive requests.
 */
let debounceTimerId: number | null = null;

/**
 * IME composition state flag.
 * True during multi-byte character input (Japanese, Chinese, etc.),
 * prevents suggest calls on intermediate composition characters.
 */
let isComposing = false;

// Component lifecycle
onMounted(() => {
  // Get target form element
  targetElem = document.getElementById(props.targetElementId);

  if (!targetElem) {
    console.warn(`[FSS] Target element not found: ${props.targetElementId}`);
    return;
  }

  // Setting the display position
  adjustBox(state, targetElem);
  resizeHandler = () => {
    if (targetElem) {
      adjustBox(state, targetElem);
    }
  };
  window.addEventListener('resize', resizeHandler);

  // Handling key events in the input form
  targetElem.addEventListener('keyup', handleKeyup);
  targetElem.addEventListener('keydown', handleKeydown);
  targetElem.addEventListener('compositionstart', handleCompositionStart);
  targetElem.addEventListener('compositionend', handleCompositionEnd);
  targetElem.addEventListener('focusout', handleFocusOut);

  // Handling cancel event
  cancelEventHandler = () => {
    _cancel();
  };
  SuggestEvent.$onCancel(props.suggestId, cancelEventHandler);
});

// Cleanup event handlers and listeners to prevent memory leaks
onBeforeUnmount(() => {
  // Clear debounce timer
  if (debounceTimerId !== null) {
    clearTimeout(debounceTimerId);
    debounceTimerId = null;
  }

  // Remove DOM event listeners
  if (targetElem) {
    targetElem.removeEventListener('keyup', handleKeyup);
    targetElem.removeEventListener('keydown', handleKeydown);
    targetElem.removeEventListener('compositionstart', handleCompositionStart);
    targetElem.removeEventListener('compositionend', handleCompositionEnd);
    targetElem.removeEventListener('focusout', handleFocusOut);
  }

  // Remove window event listener
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }

  // Remove EventBus handler
  if (cancelEventHandler) {
    SuggestEvent.$offCancel(props.suggestId, cancelEventHandler);
  }
});
</script>

<template>
  <div
    class="suggest-box"
    :style="{display: state.show === true ? 'block' : 'none', width: state.width}"
    @mouseenter="handleBoxMouseOver"
    @mouseleave="handleBoxMouseLeave"
  >
    <ol @mouseleave="handleMouseLeave">
      <li
        v-for="(suggestItem, index) in state.suggestList"
        :key="index"
        class="suggest-item"
        :style="{backgroundColor: index == state.focusNum ? '#aaa' : '#fff'}"
        :data-suggest-item-id="index"
        @mouseenter="handleMouseOver"
        @click="handleMouseClick(index)"
      >
        {{ suggestItem }}
      </li>
    </ol>
  </div>
</template>
