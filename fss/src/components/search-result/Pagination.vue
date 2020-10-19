
<script>
import SearchEvent from '@/events/SearchEvent';

export default {
  props: {
    pageNumbers: {
      type: Array,
      default: () => {
        return [];
      },
    },
    currentPageNumber: {
      type: Number,
      default: -1,
    },
    prevPage: {
      type: Boolean,
      default: false,
    },
    nextPage: {
      type: Boolean,
      default: false,
    },
    currentSearchCond: {
      type: Object,
      required: true
    },
    language: {
      type: String,
      default: '',
    },
  },
  methods: {
    movePage(pageNum) {
      const searchCond = SearchEvent.copySearchCond(this.currentSearchCond);
      searchCond.page = pageNum;       
      SearchEvent.sendBasicSearchWithScroll(searchCond);
      return false;
    }
  }
};
</script>

<template>
  <ul class="pagination">
    <li v-if="prevPage" class="page-item" aria-label="Previous">
      <a class="page-link" href="#" @click.prevent="movePage(currentPageNumber - 1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li v-else class="page-item disabled" aria-label="Previous">
      <a class="page-link" href="#">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>

    <li v-for="page in pageNumbers" :key="page" :class="{'page-item': true, active: page === String(currentPageNumber)}">
      <a class="page-link" href="#" @click.prevent="movePage(page)">
        <span aria-hidden="true">{{ page }}</span>
      </a>
    </li>

    <li v-if="nextPage" class="page-item" aria-label="Next">
      <a class="page-link" href="#" @click.prevent="movePage(currentPageNumber + 1)">
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