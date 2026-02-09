<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import SuggestHelper from '@/helper/SuggestHelper';
import SuggestEvent from '@/events/SuggestEvent';

const { adjustBox, doSuggest } = SuggestHelper();

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
  focusNum: number;
  newData: string | null;
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
  newData: null,
  isMouseOver: false,
});

/**
 * Initialize state to default values.
 */
const init = (): void => {
  state.show = false;
  state.suggestList = [];
  state.focusNum = -1;
  state.newData = null;
  state.isMouseOver = false;
};

/**
 * Cancel suggest with a delay.
 */
const _cancel = (): void => {
  setTimeout(() => {
    init();
  }, 100);
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
 * Handles arrow keys and input changes
 */
const handleKeyup = (event: KeyboardEvent): boolean => {
  let ret = true;
  if (event.keyCode === 38 && state.show) {
    // Up arrow key
    ret = _handleUpAllowKey();
  } else if (event.keyCode === 40 && state.show) {
    // Down arrow key when suggest box is shown
    ret = _handleDownAllowKey();
  } else if (event.keyCode === 40 && !state.show) {
    // Down arrow key when suggest box is not shown
    const inputElem = document.getElementById(props.targetElementId) as HTMLInputElement;
    if (inputElem) {
      _suggest(inputElem.value);
    }
  } else if (_isInputKeyCode(event.keyCode)) {
    // Execute suggest when input is changed
    const target = event.target as HTMLInputElement;
    _handleUpdateKeywords(target.value);
  }
  return ret;
};

/**
 * Handle key down events.
 * Handles Enter and Tab keys
 */
const handleKeydown = (event: KeyboardEvent): boolean => {
  let ret = true;
  if (event.keyCode === 13 && state.show) {
    ret = _handleEnterKey(event);
  } else if (event.keyCode === 9 && state.show && state.isMouseOver) {
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
 * Moves focus to previous suggestion
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
 * Moves focus to next suggestion
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
 * Stores new data for periodic suggest execution
 */
const _handleUpdateKeywords = (data: string): void => {
  state.newData = data;
};

/**
 * Handle mouse over on suggest list item.
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
 */
const handleMouseLeave = (): void => {
  state.isMouseOver = false;
  state.focusNum = -1;
};

/**
 * Handle mouse over on suggest box.
 */
const handleBoxMouseOver = (): void => {
  state.isMouseOver = true;
};

/**
 * Handle mouse leave from suggest box.
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
 * Determine if the key code corresponds to a character input.
 * Returns true for alphanumeric keys, backspace, space, delete, and punctuation
 */
const _isInputKeyCode = (keyCode: number): boolean => {
  return (
    (keyCode >= 48 && keyCode <= 90) ||
    (keyCode >= 96 && keyCode <= 111) ||
    keyCode === 8 ||
    keyCode === 32 ||
    keyCode === 46 ||
    (keyCode >= 186 && keyCode <= 226)
  );
};

// Component lifecycle
onMounted(() => {
  // Get target form element
  const targetElem = document.getElementById(props.targetElementId);

  if (!targetElem) {
    console.warn(`[FSS] Target element not found: ${props.targetElementId}`);
    return;
  }

  // Setting the display position
  adjustBox(state, targetElem);
  window.addEventListener('resize', () => {
    adjustBox(state, targetElem);
  });

  // Handling key events in the input form
  targetElem.addEventListener('keyup', handleKeyup);
  targetElem.addEventListener('keydown', handleKeydown);
  targetElem.addEventListener('compositionend', (e) => handleKeyup(e as unknown as KeyboardEvent));
  targetElem.addEventListener('focusout', handleFocusOut);

  // Handling cancel event
  SuggestEvent.$onCancel('fss', () => {
    _cancel();
  });

  // Periodically monitor the input
  setInterval(() => {
    if (state.newData !== null) {
      // Execute suggest when form value is changed
      _suggest(state.newData);
      state.newData = null;
    }
  }, 500);
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
