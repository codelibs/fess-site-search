<script setup lang="ts">
import { reactive, nextTick, watch, toRefs } from 'vue';
import SearchEvent from '@/events/SearchEvent';
import SearchService from '@/service/SearchService';
import MessageService from '@/service/MessageService';
import FrontHelper from '@/helper/FrontHelper';
import type { SearchCondition, RelatedContent } from '@/types/search.types';

/**
 * Component for header of search result.
 */

// Label interface
interface Label {
  value: string;
  label: string;
}

// Props interface
interface Props {
  fessUrl?: string;
  recordCountRelation?: string;
  recordCount?: number;
  startRecordNumber?: number;
  endRecordNumber?: number;
  execTime?: number;
  currentSearchCond?: SearchCondition;
  enableAllOrders?: boolean;
  enableOrder?: boolean;
  enableLabel?: boolean;
  enableLabelTab?: boolean;
  language?: string;
  enableRelated?: boolean;
  relatedQueries?: string[];
  relatedContents?: RelatedContent[];
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  fessUrl: '',
  recordCountRelation: '',
  recordCount: -1,
  startRecordNumber: -1,
  endRecordNumber: -1,
  execTime: -1,
  currentSearchCond: () => ({
    q: '',
    page: 1,
    pageSize: 10,
  }),
  enableAllOrders: false,
  enableOrder: true,
  enableLabel: true,
  enableLabelTab: false,
  language: '',
  enableRelated: false,
  relatedQueries: () => [],
  relatedContents: () => [],
});

// State interface
interface State {
  labels: Label[];
  selectedLabel: string;
  selectedSort: string;
}

// Reactive data
const { currentSearchCond } = toRefs(props);
const state = reactive<State>({
  labels: [],
  selectedLabel: '_default_',
  selectedSort: '_default_',
});

// Initialize - fetch labels
nextTick(() => {
  const service = new SearchService(props.fessUrl);

  // Get labels if enabled
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

// Watch props change
watch(
  currentSearchCond,
  () => {
    const cond = currentSearchCond.value;
    if (cond && cond.label && cond.label !== '') {
      state.selectedLabel = cond.label;
    }
    if (cond && cond.sort && cond.sort !== '') {
      state.selectedSort = cond.sort;
    }
  },
  { deep: true }
);

const message = new MessageService(props.language);

/**
 * Execute search with current filter selections.
 */
const search = (): void => {
  const cond = props.currentSearchCond;
  if (!cond) return;

  const searchCond: SearchCondition = { ...cond };
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
const handleLabelTab = (event: MouseEvent): void => {
  if (event && event.target) {
    const target = event.target as HTMLElement;
    const value = target.getAttribute('value');
    if (value !== null) {
      state.selectedLabel = value;
      search();
    }
  }
};

/**
 * Get URL for related query.
 * Constructs URL with query parameter and preserves existing URL params
 */
const getRelatedQueryLink = (query: string): string => {
  const { getUrlParameters } = FrontHelper();
  let url =
    location.href.replace(/\?.*$/, '') + '?fss.query=' + encodeURIComponent(query);
  const urlParams = getUrlParameters();
  const hash = urlParams['fess_url_hash'];

  // Append other URL parameters
  Object.keys(urlParams).forEach((key: string) => {
    if (key !== 'fss.query' && key !== 'fess_url_hash' && urlParams[key]) {
      urlParams[key].forEach((val: string) => {
        url = url + '&' + encodeURIComponent(key) + '=' + encodeURIComponent(val);
      });
    }
  });

  // Append hash if exists
  if (hash !== undefined && hash.length > 0 && hash[0] !== '') {
    url = url + '#' + hash[0];
  }

  return url;
};
</script>

<template>
  <div id="subheader" class="">
    <div v-if="enableLabelTab" class="label-tab-box">
      <div
        class="label-tab"
        :class="{ 'label-tab-selected': state.selectedLabel === '' || state.selectedLabel === '_default_' }"
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
        :class="{ 'label-tab-selected': label.value === state.selectedLabel }"
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
      <div v-for="(content, index) in relatedContents" :key="index" v-html="content" />
    </div>
    <table width="100%" class="result-header">
      <tbody>
        <tr>
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
        </tr>
      </tbody>
    </table>
  </div>
</template>