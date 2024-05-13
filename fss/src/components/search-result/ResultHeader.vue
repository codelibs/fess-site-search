<script>
import { defineComponent, reactive, onMounted, onUpdated, nextTick, watch, toRefs } from "vue";

import SearchEvent from "@/events/SearchEvent";
import SearchService from "@/service/SearchService";
import MessageService from "@/service/MessageService";
import FrontHelper from "@/helper/FrontHelper";

/**
 * Component for header of search result.
 */
export default defineComponent({
  props: {
    // Url of fess.
    fessUrl: {
      type: String,
      default: "",
    },
    // Record count reration. (equal or gte)
    recordCountRelation: {
      type: String,
      default: "",
    },
    // Record count of search result.
    recordCount: {
      type: Number,
      default: -1,
    },
    // Record number of search start position.
    startRecordNumber: {
      type: Number,
      default: -1,
    },
    // Record number of search end position.
    endRecordNumber: {
      type: Number,
      default: -1,
    },
    // Execution time of search.
    execTime: {
      type: Number,
      default: -1,
    },
    // Search condition.
    currentSearchCond: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // Show order.
    enableAllOrders: {
      type: Boolean,
      default: false,
    },
    // Enable show order.
    enableOrder: {
      type: Boolean,
      default: true,
    },
    // Enable show label.
    enableLabel: {
      type: Boolean,
      default: true,
    },
    // Enable show label by tab style.
    enableLabelTab: {
      type: Boolean,
      default: false,
    },
    // Search language.
    language: {
      type: String,
      default: "",
    },
    // Enable show related info.
    enableRelated: {
      type: Boolean,
      default: false,
    },
    // Related query of search result.
    relatedQueries: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // Related content of search result.
    relatedContents: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  setup(props, context) {
    // reactive data
    const { currentSearchCond } = toRefs(props);
    const state = reactive({
      labels: [],
      selectedLabel: '_default_',
      selectedSort: '_default_'
    });

    // nextTick
    nextTick(() => {
      const service = new SearchService(props.fessUrl);

      // Get labels.
      if (props.enableLabel || props.enableLabelTab) {
        service
          .getLabels()
          .then((labels) => {
            state.labels = labels;
          })
          .catch((res) => {
            console.error('[FSS] Failed to get labels.');
            console.error(res);
          });
      }
    });

    // Watch props change.
    watch(currentSearchCond, (newValue, oldValue) => {
      if (currentSearchCond.label !== "") {
        state.selectedLabel = props.currentSearchCond.label;
      }
      if (currentSearchCond.sort !== "") {
        state.selectedSort = props.currentSearchCond.sort;
      }
    });

    const message = new MessageService(props.language);

    // method definitions

    /**
     * Execute search.
     */
    const search = () => {
      const searchCond = { ...props.currentSearchCond };
      if (state.selectedSort !== '_default_') {
        searchCond.sort = state.selectedSort;
      }
      if (state.selectedLabel !== '_default_') {
        searchCond.label = state.selectedLabel;
      }
      searchCond.page = 1;
      SearchEvent.emitBasicSearch(searchCond);
    };

    /**
     * Handle clicks on label tabs.
     */
    const handleLabelTab = (event) => {
      if (event) {
        state.selectedLabel = event.target.getAttribute("value");
        search();
      }
    };

    /**
     * Get url for related query.
     */
    const getRelatedQueryLink = (query) => {
      const frontHelper = new FrontHelper();
      let url =
        location.href.replace(/\?.*$/, "") +
        "?fss.query=" +
        encodeURIComponent(query);
      const urlParams = frontHelper.getUrlParameters();
      const hash = urlParams["fess_url_hash"];
      Object.keys(urlParams).forEach(function (key) {
        if (key !== "fss.query" && key !== "fess_url_hash") {
          this[key].forEach(function (val) {
            url =
              url +
              "&" +
              encodeURIComponent(key) +
              "=" +
              encodeURIComponent(val);
          });
        }
      }, urlParams);
      if (hash !== undefined && hash !== "") {
        url = url + "#" + hash;
      }
      return url;
    };

    return {
      state,
      message,
      search,
      handleLabelTab,
      getRelatedQueryLink,
    };
  },

});
</script>

<template>
  <div id="subheader" class="">
    <div v-if="enableLabelTab" class="label-tab-box">
      <div
        class="label-tab"
        :class="{ 'label-tab-selected': '' == state.selectedLabel || '_default_' == state.selectedLabel }"
        value=""
        @click="handleLabelTab"
      >
        {{ message.get("result.label.all", {}) }}
      </div>
      <div
        v-for="label in state.labels"
        :key="label.value"
        :value="label.value"
        class="label-tab"
        :class="{ 'label-tab-selected': label.value == state.selectedLabel }"
        @click="handleLabelTab"
      >
        {{ label.label }}
      </div>
    </div>
    <div v-if="enableRelated && relatedQueries.length > 0">
      <div v-for="query in relatedQueries" :key="query">
        {{ message.get("result.related_query_label") }}
        <a :href="getRelatedQueryLink(query)">{{ query }}</a>
      </div>
    </div>
    <div v-if="enableRelated && relatedContents.length > 0">
      <div v-for="content in relatedContents" :key="content" v-html="content" />
    </div>
    <table width="100%" class="result-header">
      <tbody>
        <td>
          <p
            v-if="recordCount === 0"
            v-html="
              message.get('result.did_not_match', {
                q: currentSearchCond.q,
              })
            "
          />
          <p
            v-else-if="recordCountRelation !== 'EQUAL_TO'"
            v-html="
              message.get('result.status', {
                q: currentSearchCond.q,
                recordCount: recordCount,
                startRecordNumber: startRecordNumber,
                endRecordNumber: endRecordNumber,
                execTime: execTime,
              })
            "
          />
          <p
            v-else
            v-html="
              message.get('result.status_over', {
                q: currentSearchCond.q,
                recordCount: recordCount,
                startRecordNumber: startRecordNumber,
                endRecordNumber: endRecordNumber,
                execTime: execTime,
              })
            "
          />
        </td>
        <td v-if="enableLabel" class="labels-box" align="right">
          <div class="labels">
            <select
              v-model="state.selectedLabel"
              class="form-control field-labels"
              @change="search"
            >
              <option value="_default_" disabled selected style="display: block">
                {{ message.get("result.label") }}
              </option>
              <option value="">
                {{ message.get("result.label.all") }}
              </option>
              <option
                v-for="label in state.labels"
                :key="label.value"
                :value="label.value"
              >
                {{ label.label }}
              </option>
            </select>
          </div>
        </td>
        <td v-if="enableOrder" class="order-box" align="right">
          <div class="order">
            <select
              v-model="state.selectedSort"
              class="form-control sort short"
              @change="search"
            >
              <option
                value="_default_"
                disabled
                selected
                style="display: block"
              >
                {{ message.get("result.order") }}
              </option>
              <option value="">
                {{ message.get("result.order.score") }}
              </option>
              <template v-if="enableAllOrders">
                <option value="filename.asc">
                  {{ message.get("result.order.filename") }} ({{
                    message.get("result.order.asc")
                  }})
                </option>
                <option value="filename.desc">
                  {{ message.get("result.order.filename") }} ({{
                    message.get("result.order.desc")
                  }})
                </option>
                <option value="created.asc">
                  {{ message.get("result.order.created") }} ({{
                    message.get("result.order.asc")
                  }})
                </option>
                <option value="created.desc">
                  {{ message.get("result.order.created") }} ({{
                    message.get("result.order.desc")
                  }})
                </option>
                <option value="content_length.asc">
                  {{
                    message.get("result.order.content_length")
                  }}
                  ({{ message.get("result.order.asc") }})
                </option>
                <option value="content_length.desc">
                  {{
                    message.get("result.order.content_length")
                  }}
                  ({{ message.get("result.order.desc") }})
                </option>
                <option value="last_modified.asc">
                  {{
                    message.get("result.order.last_modified")
                  }}
                  ({{ message.get("result.order.asc") }})
                </option>
                <option value="last_modified.desc">
                  {{
                    message.get("result.order.last_modified")
                  }}
                  ({{ message.get("result.order.desc") }})
                </option>
                <option value="click_count.asc">
                  {{ message.get("result.order.click_count") }} ({{
                    message.get("result.order.asc")
                  }})
                </option>
                <option value="click_count.desc">
                  {{ message.get("result.order.click_count") }} ({{
                    message.get("result.order.desc")
                  }})
                </option>
                <option value="favorite_count.asc">
                  {{
                    message.get("result.order.favorite_count")
                  }}
                  ({{ message.get("result.order.asc") }})
                </option>
                <option value="favorite_count.desc">
                  {{
                    message.get("result.order.favorite_count")
                  }}
                  ({{ message.get("result.order.desc") }})
                </option>
              </template>
              <template v-else>
                <option value="last_modified.desc">
                  {{ message.get("result.order.last_modified") }}
                </option>
              </template>
            </select>
          </div>
        </td>
      </tbody>
    </table>
  </div>
</template>