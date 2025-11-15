<script>
import { defineComponent } from "vue";

import SearchEvent from "@/events/SearchEvent";

/**
 * Component for pagination of search result.
 */
export default defineComponent({
  props: {
    // List of page numbers.
    pageNumbers: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // Current page number.
    currentPageNumber: {
      type: Number,
      default: -1,
    },
    // Has previos page.
    prevPage: {
      type: Boolean,
      default: false,
    },
    // Has next page.
    nextPage: {
      type: Boolean,
      default: false,
    },
    // Current search condition.
    currentSearchCond: {
      type: Object,
      required: true,
    },
    // Language for search.
    language: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    // method definitions

    /**
     * Move to the specified page.
     */
    const movePage = (pageNum) => {
      const searchCond = SearchEvent.copySearchCond(props.currentSearchCond);
      searchCond.page = pageNum;
      SearchEvent.emitBasicSearchWithScroll(searchCond);
      return false;
    };

    return {
      movePage
    };
  },
});
</script>

<template>
  <ul class="pagination">
    <li v-if="prevPage" class="page-item" aria-label="Previous">
      <a
        class="page-link"
        href="#"
        @click.prevent="movePage(currentPageNumber - 1)"
      >
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li v-else class="page-item disabled" aria-label="Previous">
      <a class="page-link" href="#">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>

    <li
      v-for="page in pageNumbers"
      :key="page"
      :class="{ 'page-item': true, active: page === String(currentPageNumber) }"
    >
      <a class="page-link" href="#" @click.prevent="movePage(page)">
        <span aria-hidden="true">{{ page }}</span>
      </a>
    </li>

    <li v-if="nextPage" class="page-item" aria-label="Next">
      <a
        class="page-link"
        href="#"
        @click.prevent="movePage(currentPageNumber + 1)"
      >
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
    <li v-else class="page-item disabled" aria-label="Next">
      <a class="page-link" href="#">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</template>