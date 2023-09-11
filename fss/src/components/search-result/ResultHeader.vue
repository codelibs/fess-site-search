<script>
import { defineComponent, reactive, onMounted, onUpdated, nextTick, watch, toRefs } from "vue";

import SearchEvent from "@/events/SearchEvent";
import SearchService from "@/service/SearchService";
import MessageService from "@/service/MessageService";
import FrontHelper from "@/helper/FrontHelper";

export default defineComponent({
  props: {
    fessUrl: {
      type: String,
      default: "",
    },
    recordCountRelation: {
      type: String,
      default: "",
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
      default: "",
    },
    enableRelated: {
      type: Boolean,
      default: false,
    },
    relatedQueries: {
      type: Array,
      default: () => {
        return [];
      },
    },
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
      selectedSort: '_default_',
      message: new MessageService(props.language),
    });

    // nextTick
    nextTick(() => {
      const service = new SearchService(props.fessUrl);
      service
        .getLabels()
        .then((labels) => {
          state.labels = labels;
        })
        .catch((res) => {
          console.error('[FSS] Failed to get labels.');
          console.error(res);
        });
    });

    watch(currentSearchCond, (newValue, oldValue) => {
      if (currentSearchCond.label !== "") {
        state.selectedLabel = props.currentSearchCond.label;
      }
      if (currentSearchCond.sort !== "") {
        state.selectedSort = props.currentSearchCond.sort;
      }
    });

    // method definitions
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

    const handleLabelTab = (event) => {
      if (event) {
        state.selectedLabel = event.target.getAttribute("value");
        search();
      }
    };

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
      <div class="label-tab" value="" @click="handleLabelTab">
        {{ state.message.get("result.label.all", {}) }}
      </div>
      <div
        v-for="label in state.labels"
        :key="label.value"
        :value="label.value"
        class="label-tab"
        @click="handleLabelTab"
      >
        {{ label.label }}
      </div>
    </div>
    <div v-if="enableRelated && relatedQueries.length > 0">
      <div v-for="query in relatedQueries" :key="query">
        {{ state.message.get("result.related_query_label") }}
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
              state.message.get('result.did_not_match', {
                q: currentSearchCond.q,
              })
            "
          />
          <p
            v-else-if="recordCountRelation === 'EQUAL_TO'"
            v-html="
              state.message.get('result.status', {
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
              state.message.get('result.status_over', {
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
                {{ state.message.get("result.label") }}
              </option>
              <option value="">
                {{ state.message.get("result.label.all") }}
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
                {{ state.message.get("result.order") }}
              </option>
              <option value="">
                {{ state.message.get("result.order.score") }}
              </option>
              <template v-if="showAllOrders">
                <option value="filename.asc">
                  {{ state.message.get("result.order.filename") }} ({{
                    state.message.get("result.order.asc")
                  }})
                </option>
                <option value="filename.desc">
                  {{ state.message.get("result.order.filename") }} ({{
                    state.message.get("result.order.desc")
                  }})
                </option>
                <option value="created.asc">
                  {{ state.message.get("result.order.created") }} ({{
                    state.message.get("result.order.asc")
                  }})
                </option>
                <option value="created.desc">
                  {{ state.message.get("result.order.created") }} ({{
                    state.message.get("result.order.desc")
                  }})
                </option>
                <option value="content_length.asc">
                  {{
                    state.message.get("result.order.content_length")
                  }}
                  ({{ state.message.get("result.order.asc") }})
                </option>
                <option value="content_length.desc">
                  {{
                    state.message.get("result.order.content_length")
                  }}
                  ({{ state.message.get("result.order.desc") }})
                </option>
                <option value="last_modified.asc">
                  {{
                    state.message.get("result.order.last_modified")
                  }}
                  ({{ state.message.get("result.order.asc") }})
                </option>
                <option value="last_modified.desc">
                  {{
                    state.message.get("result.order.last_modified")
                  }}
                  ({{ state.message.get("result.order.desc") }})
                </option>
                <option value="click_count.asc">
                  {{ state.message.get("result.order.click_count") }} ({{
                    state.message.get("result.order.asc")
                  }})
                </option>
                <option value="click_count.desc">
                  {{ state.message.get("result.order.click_count") }} ({{
                    state.message.get("result.order.desc")
                  }})
                </option>
                <option value="favorite_count.asc">
                  {{
                    state.message.get("result.order.favorite_count")
                  }}
                  ({{ state.message.get("result.order.asc") }})
                </option>
                <option value="favorite_count.desc">
                  {{
                    state.message.get("result.order.favorite_count")
                  }}
                  ({{ state.message.get("result.order.desc") }})
                </option>

                <option value="filename.asc">
                  {result.order.filename} ({result.order.asc})
                </option>
                <option value="filename.desc">
                  {result.order.filename} ({result.order.desc})
                </option>
                <option value="created.asc">
                  {result.order.created} ({result.order.asc})
                </option>
                <option value="created.desc">
                  {result.order.created} ({result.order.desc})
                </option>
                <option value="content_length.asc">
                  {result.order.content_length} ({result.order.asc})
                </option>
                <option value="content_length.desc">
                  {result.order.content_length} ({result.order.desc})
                </option>
                <option value="last_modified.asc">
                  {result.order.last_modified} ({result.order.asc})
                </option>
                <option value="last_modified.desc">
                  {result.order.last_modified} ({result.order.desc})
                </option>
                <option value="click_count.asc">
                  {result.order.click_count} ({result.order.asc})
                </option>
                <option value="click_count.desc">
                  {result.order.click_count} ({result.order.desc})
                </option>
                <option value="favorite_count.asc">
                  {result.order.favorite_count} ({result.order.asc})
                </option>
                <option value="favorite_count.desc">
                  {result.order.favorite_count} ({result.order.desc})
                </option>
              </template>
              <template v-else>
                <option value="last_modified.desc">
                  {{ state.message.get("result.order.last_modified") }}
                </option>
              </template>
            </select>
          </div>
        </td>
      </tbody>
    </table>
  </div>
</template>