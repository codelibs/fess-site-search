<script setup lang="ts">
import { reactive } from 'vue';
import MessageService from '@/service/MessageService';

/**
 * Component for search result items.
 */

// Props interface
interface Props {
  fessUrl?: string;
  contentTitle?: string;
  docId?: string;
  queryId?: string;
  urlLink?: string;
  order?: number;
  contentDescription?: string;
  contentLength?: number;
  sitePath?: string;
  created?: Date | string | null;
  lastModified?: Date | string | null;
  language?: string;
  enableThumbnail?: boolean;
  linkTarget?: string;
  enableDetails?: boolean;
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  fessUrl: '',
  contentTitle: '',
  docId: '',
  queryId: '',
  urlLink: '',
  order: -1,
  contentDescription: '',
  contentLength: -1,
  sitePath: '',
  created: null,
  lastModified: null,
  language: '',
  enableThumbnail: true,
  linkTarget: '',
  enableDetails: true,
});

// State interface
interface State {
  existThumbnail: boolean;
  message: MessageService;
}

// Reactive state
const state = reactive<State>({
  existThumbnail: false,
  message: new MessageService(props.language),
});

/**
 * Format date string.
 * Converts Date object to YYYY-MM-DD HH:mm:ss format
 */
const formatDate = (date: Date | string | null): string => {
  if (date == null) {
    return '';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

  return (
    year +
    '-' +
    month.toString().padStart(2, '0') +
    '-' +
    day.toString().padStart(2, '0') +
    ' ' +
    hours.toString().padStart(2, '0') +
    ':' +
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0')
  );
};

/**
 * Format content length string with appropriate unit (B, KB, MB, etc.)
 */
const formatContentLength = (contentLength: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let l = 0;
  let n = parseInt(String(contentLength), 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  // Include a decimal point and a tenths-place digit if presenting
  // less than ten of KB or greater units
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
};

/**
 * Set the presence of a thumbnail.
 */
const hasThumbnail = (): void => {
  state.existThumbnail = true;
};

/**
 * Set the absence of a thumbnail.
 */
const noThumbnail = (): void => {
  state.existThumbnail = false;
};
</script>

<template>
  <div>
    <h3 class="title text-truncate">
      <a
class="link"
        :href="urlLink"
        :data-uri="urlLink"
        :data-id="docId" 
        :data-order="order"
        :target="linkTarget"
        v-html="contentTitle"
      >
      </a>
    </h3>
    <div class="body">
      <div v-if="enableThumbnail" v-show="state.existThumbnail" class="me-3">
        <a
          class="link d-none d-sm-flex"
          :href="urlLink"
          :data-uri="urlLink"
          :data-id="docId"
          :data-order="order"
          :target="linkTarget"
        >
          <img
            :src="`${fessUrl}/thumbnail/?docId=${docId}&queryId=${queryId}`"
            alt="thumbnail"
            class="thumbnail"
            @load="hasThumbnail"
            @error="noThumbnail"
          >
        </a>
      </div>
      <div class="description" v-html="contentDescription" />
    </div>
    <div class="site text-truncate">
      <cite>{{ sitePath }}</cite>
    </div>
    <div v-if="enableDetails" class="info">
      <small>
        <span v-if="created !== ''">
          {{ state.message.get('result.created') }} {{ formatDate(created) }}&nbsp;
        </span>
        <span v-if="lastModified !== ''">
          {{ state.message.get('result.order.last_modified') }} {{ formatDate(lastModified) }}&nbsp;
        </span>
        <span v-if="contentLength > -1">
          - {{ formatContentLength(contentLength) }} {{ state.message.get('result.size') }}&nbsp;
        </span>
      </small>
    </div>
  </div>
</template>