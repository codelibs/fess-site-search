<script>
import { defineComponent, reactive, onMounted } from "vue";
import SuggestHelper from "@/helper/SuggestHelper";

import SuggestEvent from '@/events/SuggestEvent';

const { adjustBox, doSuggest } = SuggestHelper();


export default defineComponent({
  props: {
    suggestId: {
      type: String,
      default: "fss"
    },
    targetElementId: {
      type: String,
      default: ""
    },
    apiUrl: {
      type: String,
      default: ""
    },
    suggestNum: {
      type: Number,
      default: 10
    },
    label: {
      type: String,
      default: ""
    }
  },

  setup(props, context) {
    // reactive state
    const state = reactive({
      show: false,
      suggestList: [],
      top: "0px",
      left: "0px",
      width: "0px",
      focusNum: -2,
      newData: null,
      isMouseOver: false,
    });

    onMounted(() => {
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

      setInterval(() => {
        if (state.newData !== null) {
          _suggest(state.newData);
          state.newData = null;
        }
      }, 500);
    });

    const init = () => {
      state.show = false;
      state.suggestList = [];
      state.focusNum = -2;
      state.inputText = '';
      state.newData = null;
      state.isMouseOver = false;
    };

    const _cancel = () => {
      console.log('cancel');
      setTimeout(() => {
        init();
      }, 100);
    };

    const handleFocusOut = () => {
      console.log('handle handleFocusOut ' + event.keyCode);
      if (state.isMouseOver === false) {
        _cancel();
      }
    };

    const handleKeyup = (event) => {
      console.log('handle keyup ' + event.keyCode);
      let ret = true;
      if (event.keyCode === 38 && state.show) {
        ret = _handleUpAllowKey();
      } else if (event.keyCode === 40 && state.show) {
        ret = _handleDownAllowKey();
      } else if (event.keyCode === 40 && !state.show) {
        _suggest();
      } else if (_isInputKeyCode(event.keyCode)) {
        console.log("text " + event.target.value);
        _handleUpdateKeywords(event.target.value);
      } else {
        // ignore
      }
      return ret;
    };

    const handleKeydown = (event) => {
      console.log('handle keydown ' + event.keyCode);
      let ret = true;
      if (event.keyCode === 13 && state.show) {
        ret = _handleEnterKey(event);
      } else if (event.keyCode === 9 && state.show && state.isMouseOver) {
        _cancel();
      }
      return ret;
    };

    const _handleEnterKey = (event) => {
      console.log("enter");
      if (state.focusNum < 0) {
        return true;
      }

      _fix();

      event.stopPropagation();
      event.preventDefault();
      return false;
    };

    const _handleUpAllowKey = () => {
      console.log('_handleUpAllowKey');
      state.focusNum -= 1;
      if (state.focusNum < -1) {
        state.focusNum = state.suggestList.length - 1;
      }
    };

    const _handleDownAllowKey = () => {
      console.log('_handleDownAllowKey');
      state.focusNum += 1;
      if (state.focusNum >= state.suggestList.length) {
        state.focusNum = -1;
      }
    };

    const _handleUpdateKeywords = (data) => {
      state.newData = data;
    };

    const handleMouseOver = (event) => {
      state.isMouseOver = true;
      state.focusNum = event.target.getAttribute('data-suggest-item-id');
      console.log("mouseOver focus:" + state.focusNum);
    };

    const handleMouseLeave = (event) => {
      console.log("mouseLeave");
      state.focusNum = -1;
    };

    const handleBoxMouseOver = (event) => {
      state.isMouseOver = true;
    };

    const handleBoxMouseLeave = (event) => {
      state.isMouseOver = false;
    };

    const handleMouseClick = (index) => {
      console.log('handle mouse click');
      state.focusNum = index;
      _fix();
    };

    const _suggest = (keyword) => {
      console.log('suggest! ' + keyword);
      doSuggest(props.apiUrl, keyword, props.num, props.label).then((suggestList) => {
        state.suggestList = suggestList;
        state.show = true;
      });
    };

    const _fix = () => {
      if (state.focusNum >= 0) {
        let result = state.suggestList[state.focusNum];
        console.log("suggest result: " + result);
        SuggestEvent.$emitResult(props.suggestId, result);
      }
      init();
    };

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
      handleMouseClick
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
        :style="{width: state.width, backgroundColor: index == state.focusNum ? '#aaa' : '#fff'}"
        :data-suggest-item-id="index"
        @mouseenter="handleMouseOver"
        @click="handleMouseClick(index)"
      >
        {{ suggestItem }}
      </li>
    </ol>
  </div>
</template>