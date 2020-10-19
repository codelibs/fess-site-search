<script>
import SearchEvent from '@/events/SearchEvent';
import SearchService from '@/service/SearchService';
import MessageService from '@/service/MessageService';
import FrontHelper from '@/helper/FrontHelper';

export default {
  props: {
    fessUrl: {
      type: String,
      default: '',
    },
    recordCountRelation: {
      type: String,
      default: '',
    },
    recordCount: {
      type: Number,
      default: -1,
    },
    startRecordNumber: {
      type: Number,
      default: -1,
    },
    endRecordNumber: {
      type: Number,
      default: -1,
    },
    execTime: {
      type: Number,
      default: -1,
    },
    currentSearchCond: {
      type: Object,
      default: () => {
        return {};
      },
    },
    showAllOrders: {
      type: Boolean,
      default: false,
    },
    enableOrder: {
      type: Boolean,
      default: true,
    },
    enableLabel: {
      type: Boolean,
      default: true,
    },
    enableLabelTab: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: '',
    },
    enableRelated: {
      type: Boolean,
      default: false,
    },
    relatedQueries: {
      type: Array,
      default: () => {
        return [];
      }
    },
    relatedContents: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  data: function() {
    return {
      labels: [],
      selectedLabel: '',
      selectedSort: '',
      message: new MessageService(this.language),
    };
  },
  mounted: function() {
    this.$nextTick(() => {
      const service = new SearchService(this.fessUrl);
      service.getLabels().then((labels) => {
        this.labels = labels;
      }).catch((res) => {
        console.error("[FSS] Failed to get labels.");
        console.error(res);
      });
    });
  },
  updated: function() {
    if (this.selectedLabel !== this.currentSearchCond.label) {
      this.selectedLabel = this.currentSearchCond.label;
    }
    if (this.selectedSort !== this.currentSearchCond.sort) {
      this.selectedSort = this.currentSearchCond.sort;
    }
  },
  methods: {
    search() {
      const searchCond = {...this.currentSearchCond};
      searchCond.sort=this.selectedSort;
      searchCond.label=this.selectedLabel;
      searchCond.page=1;
      SearchEvent.sendBasicSearch(searchCond);
    },

    handleLabelTab(event) {
      if (event) {
        this.selectedLabel = event.target.getAttribute('value');
        this.search();
      }
    },

    getRelatedQueryLink(query) {
      const frontHelper = new FrontHelper();
      let url = location.href.replace(/\?.*$/, '') + '?fss.query=' + encodeURIComponent(query);
      const urlParams = frontHelper.getUrlParameters();
      const hash = urlParams['fess_url_hash'];
      Object.keys(urlParams).forEach(function(key) {
        if (key !== 'fss.query' && key !== 'fess_url_hash') {
          this[key].forEach(function(val) {
            url = url + '&' + encodeURIComponent(key) + '=' + encodeURIComponent(val);
          });
        }
      }, urlParams);
      if (hash !== undefined && hash !== '') {
        url = url + '#' + hash;
      }
      return url;
    },
  }
};
</script>

<template>
  <div id="subheader" class="">
    <div v-if="enableLabelTab" class="label-tab-box">
      <div @click="handleLabelTab" class="label-tab" value="">{{ message.get('result.label.all', {}) }}</div>
      <div v-for="label in labels" :key="label.value" :value="label.value" @click="handleLabelTab" class="label-tab">{{ label.label }}</div>
    </div>
    <div v-if="enableRelated && relatedQueries.length > 0">
      <div v-for="query in relatedQueries" :key="query">
        {{ message.get('result.related_query_label') }} <a :href="getRelatedQueryLink(query)">{{ query }}</a>
      </div>
    </div>
    <div v-if="enableRelated && relatedContents.length > 0">
      <div v-for="content in relatedContents" :key="content" v-html="content" />
    </div>
    <table width="100%" class="result-header">
      <tbody>
        <td>
          <p v-if="recordCount === 0" v-html="message.get('result.did_not_match', {q: currentSearchCond.q})" />
          <p v-else-if="recordCountRelation === 'EQUAL_TO'"
            v-html="message.get('result.status', {q: currentSearchCond.q, recordCount: recordCount, startRecordNumber: startRecordNumber, endRecordNumber:endRecordNumber, execTime:execTime})" />
          <p v-else
             v-html="message.get('result.status_over', {q: currentSearchCond.q, recordCount: recordCount, startRecordNumber: startRecordNumber, endRecordNumber:endRecordNumber, execTime:execTime})" />
        </td>
        <td v-if="enableLabel" class="labels-box" align="right">
          <div class="labels">
            <select v-model="selectedLabel" class="form-control field-labels" @change="search">
              <option value="_default_" disabled selected style="display:none;">{{ message.get('result.label') }}</option>
              <option value="">{{ message.get('result.label.all') }}</option>
              <option v-for="label in labels" :key="label.value" :value="label.value">{{ label.label }}</option>
            </select>
          </div>
        </td>
        <td v-if="enableOrder" class="order-box" align="right">
          <div class="order">
            <select v-model="selectedSort" class="form-control sort short" @change="search">
              <option value="_default_" disabled selected style="display:none;">{{ message.get('result.order') }}</option>
              <option value="">{{ message.get('result.order.score') }}</option>
              <template v-if="showAllOrders">
                <option value="filename.asc">{{ message.get('result.order.filename') }} ({{ message.get('result.order.asc') }})</option>
                <option value="filename.desc">{{ message.get('result.order.filename') }} ({{ message.get('result.order.desc') }})</option>
                <option value="created.asc">{{ message.get('result.order.created') }} ({{ message.get('result.order.asc') }})</option>
                <option value="created.desc">{{ message.get('result.order.created') }} ({{ message.get('result.order.desc') }})</option>
                <option value="content_length.asc">{{ message.get('result.order.content_length') }} ({{ message.get('result.order.asc') }})</option>
                <option value="content_length.desc">{{ message.get('result.order.content_length') }} ({{ message.get('result.order.desc') }})</option>
                <option value="last_modified.asc">{{ message.get('result.order.last_modified') }} ({{ message.get('result.order.asc') }})</option>
                <option value="last_modified.desc">{{ message.get('result.order.last_modified') }} ({{ message.get('result.order.desc') }})</option>
                <option value="click_count.asc">{{ message.get('result.order.click_count') }} ({{ message.get('result.order.asc') }})</option>
                <option value="click_count.desc">{{ message.get('result.order.click_count') }} ({{ message.get('result.order.desc') }})</option>
                <option value="favorite_count.asc">{{ message.get('result.order.favorite_count') }} ({{ message.get('result.order.asc') }})</option>
                <option value="favorite_count.desc">{{ message.get('result.order.favorite_count') }} ({{ message.get('result.order.desc') }})</option>

                <option value="filename.asc">{result.order.filename} ({result.order.asc})</option>
                <option value="filename.desc">{result.order.filename} ({result.order.desc})</option>
                <option value="created.asc">{result.order.created} ({result.order.asc})</option>
                <option value="created.desc">{result.order.created} ({result.order.desc})</option>
                <option value="content_length.asc">{result.order.content_length} ({result.order.asc})</option>
                <option value="content_length.desc">{result.order.content_length} ({result.order.desc})</option>
                <option value="last_modified.asc">{result.order.last_modified} ({result.order.asc})</option>
                <option value="last_modified.desc">{result.order.last_modified} ({result.order.desc})</option>
                <option value="click_count.asc">{result.order.click_count} ({result.order.asc})</option>
                <option value="click_count.desc">{result.order.click_count} ({result.order.desc})</option>
                <option value="favorite_count.asc">{result.order.favorite_count} ({result.order.asc})</option>
                <option value="favorite_count.desc">{result.order.favorite_count} ({result.order.desc})</option>
              </template>
              <template v-else>
                <option value="last_modified.desc">{{ message.get('result.order.last_modified') }}</option>
              </template>
            </select>
          </div>
        </td>
      </tbody>
    </table>
  </div>
</template>