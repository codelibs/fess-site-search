<script>
import { defineComponent, reactive, onMounted } from "vue";
import SuggestHelper from "@/helper/SuggestHelper";

import SuggestEvent from '@/events/SuggestEvent';

const { adjustBox, doSuggest } = SuggestHelper();

/**
 * Component for suggest box.
 */
export default defineComponent({
  props: {
    // Id of this component.
    suggestId: {
      type: String,
      default: "fss"
    },
    // Id of target form element.
    targetElementId: {
      type: String,
      default: ""
    },
    // Url of suggest api.
    apiUrl: {
      type: String,
      default: ""
    },
    // Number of suggest words.
    suggestNum: {
      type: Number,
      default: 10
    },
    // Label for filtering words.
    label: {
      type: String,
      default: ""
    }
  },

  setup(props) {
    // reactive state
    const state = reactive({
      show: false,
      suggestList: [],
      top: "0px",
      left: "0px",
      width: "0px",
      focusNum: -1,
      newData: null,
      isMouseOver: false,
    });

    onMounted(() => {
      // Get target form element.
      const targetElem = document.getElementById(props.targetElementId);

      // Setting the display position.
      adjustBox(state, targetElem);
      window.addEventListener('resize', () => {
        adjustBox(state, targetElem);
      });

      // Handling key events in the input form.
      targetElem.addEventListener('keyup', handleKeyup);
      targetElem.addEventListener('keydown', handleKeydown);
      targetElem.addEventListener('compositionend', handleKeyup);
      targetElem.addEventListener('focusout', handleFocusOut);

      // Handling cancel event.
      SuggestEvent.$onCancel('fss', () => {
        _cancel();
      });

      // Periodically monitor the input.
      setInterval(() => {
        if (state.newData !== null) {
          // Execute suggest when form value is changed.
          _suggest(state.newData);
          state.newData = null;
        }
      }, 500);
    });

    const init = () => {
      state.show = false;
      state.suggestList = [];
      state.focusNum = -1;
      state.newData = null;
      state.isMouseOver = false;
    };

    /**
     * Cancel suggest.
     */
    const _cancel = () => {
      setTimeout(() => {
        init();
      }, 100);
    };

    /**
     * Handle forcus out.
     */
    const handleFocusOut = () => {
      if (state.isMouseOver === false) {
        _cancel();
      }
    };

    /**
     * Handle key up events.
     */
    const handleKeyup = (event) => {
      let ret = true;
      if (event.keyCode === 38 && state.show) {
        // Up allow key.
        ret = _handleUpAllowKey();
      } else if (event.keyCode === 40 && state.show) {
        // Down allow key when suggest bos is shown.
        ret = _handleDownAllowKey();
      } else if (event.keyCode === 40 && !state.show) {
        // Down allow key when suggest box is not shown.
        const inputText = document.getElementById(props.targetElementId).value;
        _suggest(inputText);
      } else if (_isInputKeyCode(event.keyCode)) {
        // Execute suggest when input is changed.
        _handleUpdateKeywords(event.target.value);
      } else {
        // ignore
      }
      return ret;
    };

    /**
     * Handle key down events.
     */
    const handleKeydown = (event) => {
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
     */
    const _handleEnterKey = (event) => {
      if (state.focusNum < 0) {
        return true;
      }

      // Fix search word.
      _fix();

      // Stop the Enter key event.
      event.stopPropagation();
      event.preventDefault();
      return false;
    };

    /**
     * Handle up allow key.
    */
    const _handleUpAllowKey = () => {
      state.focusNum -= 1;
      if (state.focusNum < -1) {
        state.focusNum = state.suggestList.length - 1;
      }
    };

    /**
     * Handle down allow key.
     */
    const _handleDownAllowKey = () => {
      state.focusNum += 1;
      if (state.focusNum >= state.suggestList.length) {
        state.focusNum = -1;
      }
    };

    /**
     * Handle update keywords.
     */
    const _handleUpdateKeywords = (data) => {
      state.newData = data;
    };

    /**
     * Handle mouse over on suggest list.
     */
    const handleMouseOver = (event) => {
      state.isMouseOver = true;
      state.focusNum = Number(event.target.getAttribute('data-suggest-item-id'));
    };

    /**
     * Handle mouse leave from suggest list.
     */
    const handleMouseLeave = () => {
      state.isMouseOver = false;
      state.focusNum = -1;
    };

    /**
     * Handle mouse over on suggest box.
     */
    const handleBoxMouseOver = () => {
      state.isMouseOver = true;
    };

    /**
     * Handle mouse leave from suggest box.
     */
    const handleBoxMouseLeave = () => {
      state.isMouseOver = false;
    };

    /**
     * Handle mouse click.
     */
    const handleMouseClick = (index) => {
      state.focusNum = index;
      _fix();
    };

    /**
     * Execute suggest.
     */
    const _suggest = (keyword) => {
      doSuggest(props.apiUrl, keyword, props.suggestNum, props.label.split(',')).then((suggestList) => {
        state.suggestList = suggestList;
        if (suggestList.length > 0) {
          state.show = true;
        } else {
          state.show = false;
        }
      }).catch((error) => {
        console.warn('Error occurred on suggest. ');
        console.warn(error);
      });
    };

    /**
     * Fix search word.
     */
    const _fix = () => {
      if (state.focusNum >= 0) {
        let result = state.suggestList[state.focusNum];
        SuggestEvent.$emitResult(props.suggestId, result);
      }
      init();
    };

    /**
     * Determine if the key code corresponds to a character input.
     */
    const _isInputKeyCode = (keyCode) => {
      return (keyCode >= 48 && keyCode <= 90) ||
        (keyCode >= 96 && keyCode <= 111) ||
        keyCode === 8 ||
        keyCode === 32 ||
        keyCode === 46 ||
        (keyCode >= 186 && keyCode <= 226);
    };

    return {
      state,
      handleMouseOver,
      handleMouseLeave,
      handleMouseClick,
      handleBoxMouseOver,
      handleBoxMouseLeave
    };
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
        :key="suggestItem.key"
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
